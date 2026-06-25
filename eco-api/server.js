const axios = require('axios');
const cors = require('cors');
const express = require('express');

const PORTA_SERVIDOR = Number(process.env.PORTA_API ?? 3002);
const URL_PLANILHA_ECOPONTOS = 'https://sheetdb.io/api/v1/b1ayregriedy4';

const pontosColetaLocais = [
  {
    id: 'cg-01',
    nome: 'Ecoponto Campo Grande',
    tipo: 'lixo',
    bairro: 'Campo Grande',
    endereco: 'Avenida Maria Teresa, Campo Grande, Rio de Janeiro, RJ',
    avaliacao: 4.8,
    lat: -22.9051459,
    lng: -43.5658115
  },
  {
    id: 'cg-02',
    nome: 'Ecoponto Campo Grande Reciclável',
    tipo: 'reciclavel',
    bairro: 'Campo Grande',
    endereco: 'Avenida Maria Teresa, Campo Grande, Rio de Janeiro, RJ',
    avaliacao: 4.8,
    lat: -22.9051459,
    lng: -43.5658115
  },
  {
    id: 'bg-01',
    nome: 'Ecoponto Catiri',
    tipo: 'lixo',
    bairro: 'Bangu',
    endereco: 'Catiri, Bangu, Rio de Janeiro, RJ',
    avaliacao: 4.8,
    lat: -22.853089,
    lng: -43.468768
  },
  {
    id: 'bg-03',
    nome: 'Ecoponto Reciclável Bangu Shopping',
    tipo: 'reciclavel',
    bairro: 'Bangu',
    endereco: 'Rua Fonseca, 240 - Bangu, Rio de Janeiro - RJ',
    avaliacao: 4.8,
    lat: -22.862822,
    lng: -43.49097
  }
];

function normalizarTipoColeta(valor) {
  const tipoInformado = String(valor ?? '').toLowerCase();
  return tipoInformado.includes('recicl') ? 'reciclavel' : 'lixo';
}

function normalizarNumero(valor) {
  const numeroNormalizado = Number(String(valor ?? '').replace(',', '.'));
  return Number.isFinite(numeroNormalizado) ? numeroNormalizado : undefined;
}

function normalizarPontoColeta(ponto, indice) {
  const nome = ponto.nome ?? ponto.ecoponto ?? ponto.local;
  const endereco = ponto.endereco ?? ponto.endereço ?? ponto.address;
  if (!nome || !endereco) {
    return null;
  }

  return {
    id: String(ponto.id ?? `planilha-${indice + 1}`),
    nome: String(nome),
    tipo: normalizarTipoColeta(ponto.tipo ?? ponto.tipo_residuo ?? ponto.residuo),
    bairro: String(ponto.bairro ?? 'Não informado'),
    endereco: String(endereco),
    avaliacao: normalizarNumero(ponto.avaliacao ?? ponto.avaliação) ?? 4.8,
    lat: normalizarNumero(ponto.lat ?? ponto.latitude),
    lng: normalizarNumero(ponto.lng ?? ponto.longitude)
  };
}

async function buscarPontosColeta() {
  try {
    const respostaPlanilha = await axios.get(URL_PLANILHA_ECOPONTOS, { timeout: 5000 });
    const pontosPlanilha = Array.isArray(respostaPlanilha.data) ? respostaPlanilha.data : [];
    const pontosNormalizados = pontosPlanilha
      .map(normalizarPontoColeta)
      .filter(Boolean);

    return pontosNormalizados.length > 0 ? pontosNormalizados : pontosColetaLocais;
  } catch {
    return pontosColetaLocais;
  }
}

const aplicacao = express();
aplicacao.use(cors());

aplicacao.get('/api/status', (_requisicao, resposta) => {
  resposta.json({ servico: 'EcoPonto API', status: 'online' });
});

aplicacao.get('/api/pontos-coleta', async (_requisicao, resposta) => {
  resposta.json(await buscarPontosColeta());
});

// Mantém compatibilidade com a rota usada na versão inicial da API.
aplicacao.get('/ecopontos', async (_requisicao, resposta) => {
  resposta.json(await buscarPontosColeta());
});

aplicacao.listen(PORTA_SERVIDOR, () => {
  console.log(`EcoPonto API disponível em http://localhost:${PORTA_SERVIDOR}`);
  console.log(`Consulte os ecopontos em http://localhost:${PORTA_SERVIDOR}/api/pontos-coleta`);
});
