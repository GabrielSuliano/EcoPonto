# EcoPonto

Aplicativo mobile feito com Ionic, Angular e Capacitor para incentivar o descarte consciente de residuos. O usuario consegue localizar ecopontos, registrar descartes com foto e localizacao, acompanhar pontuacao e participar de um fluxo de validacao administrativa.

## Objetivo

O EcoPonto conecta tecnologia e educacao ambiental para facilitar o descarte correto de materiais reciclaveis. A ideia central e transformar uma acao cotidiana em uma experiencia guiada, rastreavel e gamificada.

## Recursos principais

- Cadastro, login, recuperacao e alteracao de senha.
- Mapa de ecopontos com MapLibre GL e geolocalizacao.
- Busca de pontos de coleta via SheetDB e API auxiliar.
- Geocodificacao com Geoapify quando o ponto nao possui coordenadas.
- Registro de descarte com camera e localizacao.
- Ranking de usuarios por pontuacao.
- Area administrativa para validar descartes pendentes.
- Gerenciamento de administradores.
- Projeto Android via Capacitor, com script para gerar APK debug.

## Stack

- Ionic 8
- Angular 20
- TypeScript
- SCSS
- Capacitor
- Firebase Authentication
- Cloud Firestore
- MapLibre GL
- Geoapify
- Node.js e Express na API auxiliar

## Estrutura

```text
.
├── android/              # Projeto Android gerado pelo Capacitor
├── eco-api/              # API auxiliar em Node.js/Express
├── src/app/              # Paginas, rotas, guards e services do app
├── src/environments/     # Configuracoes de APIs e Firebase
├── firestore.rules       # Regras de seguranca do Firestore
├── capacitor.config.ts   # Configuracao do Capacitor
└── package.json          # Scripts e dependencias
```

## Como rodar

```bash
npm install
npm start
```

O app web abre normalmente em:

```text
http://localhost:4200
```

## Build e Android

```bash
npm run build
npx cap sync android
```

Para gerar um APK debug:

```bash
npm run apk
```

O script compila o Angular, sincroniza o Capacitor e gera o APK no projeto Android. Em Windows, tambem tenta copiar o arquivo para a Area de Trabalho.

## API auxiliar

A pasta `eco-api/` possui uma API Express para servir pontos de coleta e fallback local.

```bash
cd eco-api
npm install
node server.js
```

Rotas principais:

```text
GET /api/status
GET /api/pontos-coleta
GET /ecopontos
```

## Configuracao

Revise os arquivos abaixo antes de rodar em outro ambiente:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
firestore.rules
```

Configuracoes importantes:

- `firebaseConfig`: projeto Firebase usado pelo app.
- `geoapifyApiKey`: chave para mapa e geocodificacao.
- `apiPontosColetaUrl`: origem dos dados dos ecopontos.

## Status

Projeto academico funcional, com frontend mobile, Firebase, mapa, geolocalizacao, ranking, validacao administrativa e geracao de APK.

## Autores

- Gabriel Suliano
- Samuel Valentim
- Beatriz Freitas
