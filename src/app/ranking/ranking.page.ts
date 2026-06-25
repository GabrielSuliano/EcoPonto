// =====================================================================================
// PÁGINA RANKING - CLASSIFICAÇÃO E HISTÓRICO DE DESCARTES
// =====================================================================================
// Responsável por exibir o ranking geral de usuários, itens pendentes para validação
// e histórico individual de descartes.
// =====================================================================================

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonIcon
} from '@ionic/angular/standalone';
import { RankingService, RankingEntry, RegistroDescarte } from '../services/ranking.service';
import { UsuarioService } from '../services/usuario.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.page.html',
  styleUrls: ['./ranking.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonBadge,
    IonButton,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonIcon
  ]
})
export class RankingPage implements OnInit {
  ranking: RankingEntry[] = [];
  pendentes: RegistroDescarte[] = [];
  meusRegistros: RegistroDescarte[] = [];
  isAdmin = false;

  private rankingService = inject(RankingService);
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  ngOnInit(): void {
    this.carregar();
  }

  ionViewWillEnter(): void {
    this.carregar();
  }

  voltarParaHome(): void {
    this.router.navigateByUrl('/home', { replaceUrl: true });
  }

  async validarRegistro(id: string): Promise<void> {
    if (!this.isAdmin) {
      return;
    }

    const sucesso = await this.rankingService.validarRegistro(id);
    if (sucesso) {
      await this.carregar();
    }
  }

  private async carregar(): Promise<void> {
    this.ranking = await this.rankingService.getRanking();
    const usuario = await this.usuarioService.atualizarUsuarioLogado();
    this.isAdmin = usuario?.tipo?.trim().toLowerCase() === 'admin';
    this.pendentes = this.isAdmin ? await this.rankingService.getRegistrosPendentes() : [];
    this.meusRegistros = usuario ? await this.rankingService.getRegistrosPorUsuario(usuario.email) : [];
  }
}
