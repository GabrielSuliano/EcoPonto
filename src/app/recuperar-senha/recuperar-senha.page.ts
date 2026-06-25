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
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.page.html',
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
    IonTitle,
    IonToolbar
  ]
})
export class RecuperarSenhaPage {
  email = '';
  codigoRecuperacao = '';
  novaSenha = '';
  confirmacaoNovaSenha = '';
  emailEnviado = false;
  processando = false;
  mostrarAlerta = false;
  mensagemAlerta = '';
  tipoAlerta: 'success' | 'danger' = 'success';

  alertButtons = [{ text: 'OK', handler: () => this.fecharAlerta() }];

  private usuarioService = inject(UsuarioService);
  private roteador = inject(Router);

  async enviarLink(): Promise<void> {
    if (!this.emailValido() || this.processando) {
      return;
    }

    this.processando = true;
    try {
      await this.usuarioService.enviarEmailRecuperacaoSenha(this.email);
      this.codigoRecuperacao = '';
      this.novaSenha = '';
      this.confirmacaoNovaSenha = '';
      this.emailEnviado = true;
      this.mostrarMensagem(
        'Enviamos o código de recuperação no e-mail. Cole abaixo o código ou a mensagem recebida para definir sua nova senha.',
        'success'
      );
    } catch (erro: any) {
      this.mostrarMensagem(this.obterMensagemErroEnvio(erro?.code), 'danger');
    } finally {
      this.processando = false;
    }
  }

  async redefinirSenha(): Promise<void> {
    const mensagemValidacao = this.validarRedefinicaoSenha();
    if (mensagemValidacao || this.processando) {
      if (mensagemValidacao) {
        this.mostrarMensagem(mensagemValidacao, 'danger');
      }
      return;
    }

    this.processando = true;
    try {
      await this.usuarioService.confirmarRecuperacaoSenha(this.codigoRecuperacao, this.novaSenha);
      this.mostrarMensagem('Senha redefinida com sucesso. Entre usando sua nova senha.', 'success');
      this.codigoRecuperacao = '';
      this.novaSenha = '';
      this.confirmacaoNovaSenha = '';
      this.emailEnviado = false;
    } catch (erro: any) {
      this.mostrarMensagem(this.obterMensagemErroConfirmacao(erro?.code), 'danger');
    } finally {
      this.processando = false;
    }
  }

  voltarParaLogin(): void {
    this.roteador.navigateByUrl('/login', { replaceUrl: true });
  }

  fecharAlerta(): void {
    this.mostrarAlerta = false;
  }

  private emailValido(): boolean {
    const expressaoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (expressaoEmail.test(this.email.trim())) {
      return true;
    }

    this.mostrarMensagem('Informe um e-mail válido para recuperar sua senha.', 'danger');
    return false;
  }

  private obterMensagemErroEnvio(codigoErro?: string): string {
    if (codigoErro === 'firebase/tempo-limite-excedido') {
      return 'O Firebase demorou para responder. Verifique sua internet e tente novamente.';
    }
    if (codigoErro === 'auth/too-many-requests') {
      return 'Foram feitas muitas tentativas. Aguarde alguns minutos antes de tentar novamente.';
    }
    if (codigoErro === 'auth/network-request-failed') {
      return 'Não foi possível acessar o Firebase. Verifique sua conexão com a internet.';
    }
    return 'Não foi possível enviar o e-mail de recuperação. Verifique o endereço informado e tente novamente.';
  }

  private validarRedefinicaoSenha(): string {
    if (!this.codigoRecuperacao.trim()) {
      return 'Cole o código ou a mensagem recebida por e-mail.';
    }
    if (this.codigoRecuperacao.includes('@') && !this.codigoRecuperacao.includes('oobCode=')) {
      return 'Cole a URL recebida no e-mail. Este campo não deve conter seu endereço de e-mail.';
    }
    if (this.novaSenha.length < 6) {
      return 'A nova senha deve ter pelo menos 6 caracteres.';
    }
    if (!/[A-Z]/.test(this.novaSenha) || !/[a-z]/.test(this.novaSenha) || !/[0-9]/.test(this.novaSenha)) {
      return 'A nova senha deve conter letra maiúscula, letra minúscula e número.';
    }
    if (this.novaSenha !== this.confirmacaoNovaSenha) {
      return 'A confirmação deve ser igual à nova senha.';
    }
    return '';
  }

  private obterMensagemErroConfirmacao(codigoErro?: string): string {
    if (codigoErro === 'auth/expired-action-code') {
      return 'O código expirou. Solicite um novo e-mail de recuperação.';
    }
    if (codigoErro === 'auth/invalid-action-code') {
      return 'O código informado é inválido ou já foi utilizado.';
    }
    if (codigoErro === 'firebase/tempo-limite-excedido') {
      return 'O Firebase demorou para responder. Verifique sua internet e tente novamente.';
    }
    return 'Não foi possível redefinir a senha. Confira o código e tente novamente.';
  }

  private mostrarMensagem(mensagem: string, tipo: 'success' | 'danger'): void {
    this.mensagemAlerta = mensagem;
    this.tipoAlerta = tipo;
    this.mostrarAlerta = true;
  }
}
