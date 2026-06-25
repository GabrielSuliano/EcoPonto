// =====================================================================================
// PÁGINA PAINEL - NAVEGAÇÃO E AÇÕES DO PERFIL
// =====================================================================================
// Responsável por centralizar ações rápidas do usuário autenticado e servir como
// ponto de navegação para recursos principais do aplicativo.
// =====================================================================================

import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon,
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-painel',
  templateUrl: './painel.page.html',
  styleUrls: ['./painel.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonIcon,
  ]
})
export class PainelPage implements OnInit {
  usuarioAdministrador = false;

  private router = inject(Router);
  private usuarioService = inject(UsuarioService);

  ngOnInit(): void {
    this.carregarPermissoesUsuario();
  }

  ionViewWillEnter(): void {
    this.carregarPermissoesUsuario();
  }

  irParaColeta(): void {
    this.router.navigateByUrl('/coleta', { replaceUrl: true });
  }

  irParaSobre(): void {
    this.router.navigateByUrl('/sobre', { replaceUrl: true });
  }

  irParaRanking(): void {
    this.router.navigateByUrl('/ranking', { replaceUrl: true });
  }

  irParaValidacaoDescartes(): void {
    this.router.navigateByUrl('/ranking', { replaceUrl: true });
  }

  irParaGerenciarAdministradores(): void {
    this.router.navigateByUrl('/gerenciar-administradores', { replaceUrl: true });
  }

  irParaConsultaApi(): void {
    this.router.navigateByUrl('/consulta-api', { replaceUrl: true });
  }

  irParaAlterarSenha(): void {
    this.router.navigateByUrl('/alterar-senha', { replaceUrl: true });
  }

  voltarParaHome(): void {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  async sair(): Promise<void> {
    await this.usuarioService.logout();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  private async carregarPermissoesUsuario(): Promise<void> {
    const usuario = await this.usuarioService.atualizarUsuarioLogado();
    this.usuarioAdministrador = usuario?.tipo?.trim().toLowerCase() === 'admin';
  }
}
