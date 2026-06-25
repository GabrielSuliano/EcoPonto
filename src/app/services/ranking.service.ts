import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where
} from '@angular/fire/firestore';
import { Usuario } from './usuario.service';

export type StatusRegistro = 'pendente' | 'validado';

export interface RegistroDescarte {
  id: string;
  usuarioId: string;
  email: string;
  fotoDataUrl: string;
  fotoUrl?: string;
  lat: number;
  lng: number;
  dataISO: string;
  status: StatusRegistro;
}

export interface RankingEntry {
  uid?: string;
  email: string;
  pontos: number;
}

@Injectable({
  providedIn: 'root'
})
export class RankingService {
  private firestore = inject(Firestore);

  async registrarDescarte(usuario: Usuario, fotoDataUrl: string, lat: number, lng: number): Promise<RegistroDescarte> {
    const registroSemId = {
      usuarioId: usuario.uid ?? usuario.email,
      email: usuario.email,
      fotoDataUrl,
      lat,
      lng,
      dataISO: new Date().toISOString(),
      status: 'pendente' as StatusRegistro,
      criadoEm: serverTimestamp()
    };

    const referencia = await addDoc(collection(this.firestore, 'descartes'), registroSemId);

    return {
      id: referencia.id,
      ...registroSemId
    };
  }

  async validarRegistro(id: string): Promise<boolean> {
    const registroRef = doc(this.firestore, 'descartes', id);
    const snapshot = await getDoc(registroRef);

    if (!snapshot.exists()) {
      return false;
    }

    const registro = { id: snapshot.id, ...snapshot.data() } as RegistroDescarte;
    if (registro.status === 'validado') {
      return false;
    }

    await updateDoc(registroRef, {
      status: 'validado',
      validadoEm: serverTimestamp()
    });

    await this.adicionarPontos(registro.usuarioId, registro.email, 10);
    return true;
  }

  async getRegistrosPendentes(): Promise<RegistroDescarte[]> {
    const snapshot = await getDocs(
      query(collection(this.firestore, 'descartes'), where('status', '==', 'pendente'))
    );

    return snapshot.docs
      .map(documento => ({ id: documento.id, ...documento.data() } as RegistroDescarte))
      .sort((a, b) => b.dataISO.localeCompare(a.dataISO));
  }

  async getRegistrosPorUsuario(email: string): Promise<RegistroDescarte[]> {
    const snapshot = await getDocs(
      query(collection(this.firestore, 'descartes'), where('email', '==', email))
    );

    return snapshot.docs
      .map(documento => ({ id: documento.id, ...documento.data() } as RegistroDescarte))
      .sort((a, b) => b.dataISO.localeCompare(a.dataISO));
  }

  async getRanking(): Promise<RankingEntry[]> {
    const snapshot = await getDocs(query(collection(this.firestore, 'ranking'), orderBy('pontos', 'desc')));
    return snapshot.docs.map(documento => ({
      uid: documento.id,
      ...documento.data()
    } as RankingEntry));
  }

  private async adicionarPontos(uid: string, email: string, pontos: number): Promise<void> {
    await setDoc(
      doc(this.firestore, 'ranking', uid),
      {
        uid,
        email,
        pontos: increment(pontos),
        atualizadoEm: serverTimestamp()
      },
      { merge: true }
    );
  }
}
