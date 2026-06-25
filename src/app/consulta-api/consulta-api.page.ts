import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  IonBadge,
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
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import { ColetaPontosService, PontoColeta } from '../services/coleta-pontos.service';

@Component({
  selector: 'app-consulta-api',
  templateUrl: './consulta-api.page.html',
  styleUrls: ['./consulta-api.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonBadge,
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
    IonItem,
    IonLabel,
    IonList,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonText,
    IonTitle,
    IonToolbar
  ]
})
export class ConsultaApiPage implements OnInit {
  pontosColeta: PontoColeta[] = [];
  pontoColetaSelecionado?: PontoColeta;
  carregandoInformacoes = true;
  mensagemErro = '';

  private pontosColetaService = inject(ColetaPontosService);
  private roteador = inject(Router);

  async ngOnInit(): Promise<void> {
    await this.carregarInformacoesApi();
  }

  async carregarInformacoesApi(): Promise<void> {
    this.carregandoInformacoes = true;
    this.mensagemErro = '';

    try {
      this.pontosColeta = await this.pontosColetaService.getPontosDaApi();
      this.pontoColetaSelecionado = this.pontosColeta[0];
    } catch {
      this.pontosColeta = [];
      this.pontoColetaSelecionado = undefined;
      this.mensagemErro = 'Não foi possível consultar os ecopontos. Verifique sua conexão com a internet e tente novamente.';
    } finally {
      this.carregandoInformacoes = false;
    }
  }

  selecionarPontoColeta(identificadorPontoColeta: string): void {
    this.pontoColetaSelecionado = this.pontosColeta.find(
      pontoColeta => pontoColeta.id === identificadorPontoColeta
    );
  }

  voltarParaTelaPrincipal(): void {
    this.roteador.navigateByUrl('/home', { replaceUrl: true });
  }
}
