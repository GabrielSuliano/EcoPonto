import { Injectable, inject } from '@angular/core';
import {
  Auth,
  EmailAuthProvider,
  authState,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  reauthenticateWithCredential,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  verifyPasswordResetCode
} from '@angular/fire/auth';
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc
} from '@angular/fire/firestore';
import { firstValueFrom } from 'rxjs';

export interface Usuario {
  uid?: string;
  nome: string;
  anoNascimento: string;
  telefone: string;
  email: string;
  senha?: string;
  tipo?: 'usuario' | 'admin';
}

const EMAILS_ADMINISTRADORES_FIXOS = [
  'gabrielsuliano13@gmail.com'
];

const TEMPO_LIMITE_FIREBASE_MS = 12000;
const TEMPO_LIMITE_INICIALIZACAO_MS = 4000;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuarioLogado: Usuario | null = null;
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  constructor() {
    this.monitorarAutenticacao();
  }

  getUsuarioLogado(): Usuario | null {
    return this.usuarioLogado;
  }

  async salvarUsuario(usuario: Usuario): Promise<boolean> {
    const email = usuario.email.trim().toLowerCase();
    const tipo = EMAILS_ADMINISTRADORES_FIXOS.includes(email) ? 'admin' : 'usuario';

    try {
      const credencial = await createUserWithEmailAndPassword(this.auth, email, usuario.senha ?? '');
      const usuarioFirestore: Usuario = {
        uid: credencial.user.uid,
        nome: usuario.nome.trim(),
        anoNascimento: usuario.anoNascimento,
        telefone: usuario.telefone.trim(),
        email,
        tipo
      };

      await setDoc(doc(this.firestore, 'usuarios', credencial.user.uid), {
        ...usuarioFirestore,
        criadoEm: serverTimestamp()
      });

      this.usuarioLogado = usuarioFirestore;
      return true;
    } catch (error: any) {
      if (error?.code === 'auth/email-already-in-use') {
        return false;
      }

      throw error;
    }
  }

  async login(email: string, senha: string): Promise<boolean> {
    try {
      const credencial = await signInWithEmailAndPassword(this.auth, email.trim().toLowerCase(), senha);
      this.usuarioLogado = await this.buscarUsuarioPorUid(credencial.user.uid);
      return !!this.usuarioLogado;
    } catch (error: any) {
      if (
        error?.code === 'auth/invalid-credential' ||
        error?.code === 'auth/user-not-found' ||
        error?.code === 'auth/wrong-password'
      ) {
        return false;
      }

      throw error;
    }
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    this.usuarioLogado = null;
  }

  async enviarEmailRecuperacaoSenha(email: string): Promise<void> {
    await this.executarComTempoLimite(
      sendPasswordResetEmail(this.auth, email.trim().toLowerCase())
    );
  }

  async confirmarRecuperacaoSenha(codigoRecuperacao: string, novaSenha: string): Promise<void> {
    const codigoFirebase = this.extrairCodigoRecuperacao(codigoRecuperacao);
    await this.executarComTempoLimite(verifyPasswordResetCode(this.auth, codigoFirebase));
    await this.executarComTempoLimite(confirmPasswordReset(this.auth, codigoFirebase, novaSenha));
  }

  async alterarSenhaUsuarioLogado(senhaAtual: string, novaSenha: string): Promise<void> {
    const usuarioFirebase = this.auth.currentUser;
    if (!usuarioFirebase?.email) {
      throw new Error('usuario-nao-autenticado');
    }

    const credencial = EmailAuthProvider.credential(usuarioFirebase.email, senhaAtual);
    await this.executarComTempoLimite(
      this.reautenticarEAtualizarSenha(usuarioFirebase, credencial, novaSenha)
    );
  }

  async verificarLogin(): Promise<boolean> {
    try {
      const firebaseUser = await this.obterUsuarioFirebaseAtual();
      if (!firebaseUser) {
        this.usuarioLogado = null;
        return false;
      }

      this.usuarioLogado = await this.executarComTempoLimite(
        this.buscarUsuarioPorUid(firebaseUser.uid),
        TEMPO_LIMITE_INICIALIZACAO_MS
      );
      return !!this.usuarioLogado;
    } catch {
      this.usuarioLogado = null;
      return false;
    }
  }

  async atualizarUsuarioLogado(): Promise<Usuario | null> {
    const firebaseUser = await this.obterUsuarioFirebaseAtual();
    this.usuarioLogado = firebaseUser ? await this.buscarUsuarioPorUid(firebaseUser.uid) : null;
    return this.usuarioLogado;
  }

  async listarUsuarios(): Promise<Usuario[]> {
    await this.exigirUsuarioAdministrador();
    const documentosUsuarios = await getDocs(collection(this.firestore, 'usuarios'));

    return documentosUsuarios.docs
      .map(documentoUsuario => this.normalizarUsuario(documentoUsuario.id, documentoUsuario.data() as Usuario))
      .sort((primeiroUsuario, segundoUsuario) => primeiroUsuario.nome.localeCompare(segundoUsuario.nome));
  }

  async alterarTipoUsuario(uid: string, novoTipo: 'usuario' | 'admin'): Promise<void> {
    const administradorLogado = await this.exigirUsuarioAdministrador();
    if (administradorLogado.uid === uid && novoTipo !== 'admin') {
      throw new Error('administrador-nao-pode-remover-proprio-acesso');
    }

    await updateDoc(doc(this.firestore, 'usuarios', uid), {
      tipo: novoTipo,
      atualizadoEm: serverTimestamp()
    });
  }

  private monitorarAutenticacao(): void {
    authState(this.auth).subscribe(async firebaseUser => {
      if (!firebaseUser) {
        this.usuarioLogado = null;
        return;
      }

      this.usuarioLogado = await this.buscarUsuarioPorUid(firebaseUser.uid);
    });
  }

  private async buscarUsuarioPorUid(uid: string): Promise<Usuario | null> {
    const snapshot = await getDoc(doc(this.firestore, 'usuarios', uid));
    if (!snapshot.exists()) {
      return null;
    }

    return this.normalizarUsuario(uid, snapshot.data() as Usuario);
  }

  private async exigirUsuarioAdministrador(): Promise<Usuario> {
    const usuarioFirebase = await this.obterUsuarioFirebaseAtual();
    const usuarioAtualizado = usuarioFirebase
      ? await this.buscarUsuarioPorUid(usuarioFirebase.uid)
      : null;

    if (!usuarioAtualizado || usuarioAtualizado.tipo !== 'admin') {
      throw new Error('usuario-nao-autorizado');
    }

    this.usuarioLogado = usuarioAtualizado;
    return usuarioAtualizado;
  }

  private async obterUsuarioFirebaseAtual() {
    return this.auth.currentUser ?? await this.executarComTempoLimite(
      firstValueFrom(authState(this.auth)),
      TEMPO_LIMITE_INICIALIZACAO_MS
    );
  }

  private normalizarUsuario(uid: string, usuario: Usuario): Usuario {
    const email = usuario.email.trim().toLowerCase();
    const tipoSalvo = usuario.tipo?.trim().toLowerCase();
    const tipo: 'usuario' | 'admin' =
      EMAILS_ADMINISTRADORES_FIXOS.includes(email) || tipoSalvo === 'admin'
        ? 'admin'
        : 'usuario';

    return {
      ...usuario,
      uid,
      email,
      tipo
    };
  }

  private async reautenticarEAtualizarSenha(
    usuarioFirebase: NonNullable<Auth['currentUser']>,
    credencial: ReturnType<typeof EmailAuthProvider.credential>,
    novaSenha: string
  ): Promise<void> {
    await reauthenticateWithCredential(usuarioFirebase, credencial);
    await updatePassword(usuarioFirebase, novaSenha);
  }

  private async executarComTempoLimite<T>(
    operacaoFirebase: Promise<T>,
    tempoLimiteMs = TEMPO_LIMITE_FIREBASE_MS
  ): Promise<T> {
    let identificadorTemporizador: ReturnType<typeof setTimeout> | undefined;

    const tempoLimite = new Promise<never>((_, rejeitar) => {
      identificadorTemporizador = setTimeout(() => {
        const erroTempoLimite = new Error('Tempo limite excedido ao acessar o Firebase.');
        Object.assign(erroTempoLimite, { code: 'firebase/tempo-limite-excedido' });
        rejeitar(erroTempoLimite);
      }, tempoLimiteMs);
    });

    try {
      return await Promise.race([operacaoFirebase, tempoLimite]);
    } finally {
      if (identificadorTemporizador !== undefined) {
        clearTimeout(identificadorTemporizador);
      }
    }
  }

  private extrairCodigoRecuperacao(codigoOuLink: string): string {
    const valorInformado = codigoOuLink.trim();

    try {
      const enderecoRecuperacao = new URL(valorInformado);
      return enderecoRecuperacao.searchParams.get('oobCode') ?? valorInformado;
    } catch {
      return valorInformado;
    }
  }
}
