import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonAlert,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-alterar-senha',
  templateUrl: './alterar-senha.page.html',
  styleUrls: ['../login/login.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonAlert,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonTitle,
    IonToolbar
  ]
})
export class AlterarSenhaPage {
  senhaAtual = '';
  novaSenha = '';
  confirmacaoNovaSenha = '';
  processandoAlteracao = false;
  mostrarAlerta = false;
  mensagemAlerta = '';
  tipoAlerta: 'success' | 'danger' = 'success';

  alertButtons = [{ text: 'OK', handler: () => this.fecharAlerta() }];

  private usuarioService = inject(UsuarioService);
  private roteador = inject(Router);

  async alterarSenha(): Promise<void> {
    const mensagemValidacao = this.validarNovaSenha();
    if (mensagemValidacao || this.processandoAlteracao) {
      if (mensagemValidacao) {
        this.mostrarMensagem(mensagemValidacao, 'danger');
      }
      return;
    }

    this.processandoAlteracao = true;
    try {
      await this.usuarioService.alterarSenhaUsuarioLogado(this.senhaAtual, this.novaSenha);
      this.senhaAtual = '';
      this.novaSenha = '';
      this.confirmacaoNovaSenha = '';
      this.mostrarMensagem('Senha alterada com sucesso. Use a nova senha no próximo acesso.', 'success');
    } catch (erro: any) {
      this.mostrarMensagem(this.obterMensagemErroAlteracao(erro?.code), 'danger');
    } finally {
      this.processandoAlteracao = false;
    }
  }

  voltarParaPainel(): void {
    this.roteador.navigateByUrl('/painel', { replaceUrl: true });
  }

  fecharAlerta(): void {
    this.mostrarAlerta = false;
  }

  private validarNovaSenha(): string {
    if (!this.senhaAtual) {
      return 'Informe sua senha atual.';
    }
    if (this.novaSenha.length < 6) {
      return 'A nova senha deve ter pelo menos 6 caracteres.';
    }
    if (!/[A-Z]/.test(this.novaSenha)) {
      return 'A nova senha deve conter pelo menos uma letra maiúscula.';
    }
    if (!/[a-z]/.test(this.novaSenha)) {
      return 'A nova senha deve conter pelo menos uma letra minúscula.';
    }
    if (!/[0-9]/.test(this.novaSenha)) {
      return 'A nova senha deve conter pelo menos um número.';
    }
    if (this.novaSenha !== this.confirmacaoNovaSenha) {
      return 'A confirmação deve ser igual à nova senha.';
    }
    return '';
  }

  private obterMensagemErroAlteracao(codigoErro?: string): string {
    if (codigoErro === 'firebase/tempo-limite-excedido') {
      return 'O Firebase demorou para responder. Verifique sua internet e tente novamente.';
    }
    if (
      codigoErro === 'auth/invalid-credential' ||
      codigoErro === 'auth/wrong-password'
    ) {
      return 'A senha atual está incorreta.';
    }
    if (codigoErro === 'auth/requires-recent-login') {
      return 'Por segurança, saia da conta, entre novamente e repita a alteração da senha.';
    }
    if (codigoErro === 'auth/network-request-failed') {
      return 'Não foi possível acessar o Firebase. Verifique sua conexão com a internet.';
    }
    return 'Não foi possível alterar a senha. Tente novamente.';
  }

  private mostrarMensagem(mensagem: string, tipo: 'success' | 'danger'): void {
    this.mensagemAlerta = mensagem;
    this.tipoAlerta = tipo;
    this.mostrarAlerta = true;
  }
}
