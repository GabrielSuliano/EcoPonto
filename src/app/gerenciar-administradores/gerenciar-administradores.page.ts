import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonSpinner,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { Usuario, UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-gerenciar-administradores',
  templateUrl: './gerenciar-administradores.page.html',
  styleUrls: ['./gerenciar-administradores.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonBadge,
    IonButton,
    IonButtons,
    IonCard,
    IonCardContent,
    IonContent,
    IonHeader,
    IonIcon,
    IonSpinner,
    IonTitle,
    IonToolbar
  ]
})
export class GerenciarAdministradoresPage implements OnInit {
  usuarios: Usuario[] = [];
  carregando = true;
  uidEmAtualizacao = '';
  mensagemErro = '';

  private usuarioService = inject(UsuarioService);
  private roteador = inject(Router);

  async ngOnInit(): Promise<void> {
    await this.carregarUsuarios();
  }

  async alterarTipoUsuario(usuario: Usuario): Promise<void> {
    if (!usuario.uid || this.uidEmAtualizacao) {
      return;
    }

    const novoTipo = usuario.tipo === 'admin' ? 'usuario' : 'admin';
    this.uidEmAtualizacao = usuario.uid;
    this.mensagemErro = '';

    try {
      await this.usuarioService.alterarTipoUsuario(usuario.uid, novoTipo);
      await this.carregarUsuarios();
    } catch (erro: any) {
      this.mensagemErro = erro?.message === 'administrador-nao-pode-remover-proprio-acesso'
        ? 'Você não pode remover o seu próprio acesso administrativo.'
        : 'Não foi possível atualizar o acesso. Verifique sua conexão e tente novamente.';
    } finally {
      this.uidEmAtualizacao = '';
    }
  }

  voltarParaPainel(): void {
    this.roteador.navigateByUrl('/painel', { replaceUrl: true });
  }

  private async carregarUsuarios(): Promise<void> {
    this.carregando = true;
    this.mensagemErro = '';

    try {
      this.usuarios = await this.usuarioService.listarUsuarios();
    } catch {
      this.usuarios = [];
      this.mensagemErro = 'Não foi possível carregar os usuários.';
    } finally {
      this.carregando = false;
    }
  }
}
