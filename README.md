# EcoPonto

EcoPonto é um aplicativo mobile desenvolvido com Ionic, Angular e Capacitor para incentivar o descarte consciente de resíduos. O projeto ajuda o usuário a localizar ecopontos, registrar descartes com foto e localização, consultar dados técnicos da API e acompanhar pontuação em um ranking.

O foco do projeto é unir tecnologia e conscientização ambiental: a pessoa encontra onde descartar, entende melhor os pontos de coleta disponíveis e participa de um fluxo gamificado com validação administrativa.

## Objetivo

O objetivo principal do EcoPonto é conscientizar usuários sobre o descarte correto de lixo e materiais recicláveis.

Na prática, o app busca:

- facilitar a localização de ecopontos;
- orientar o usuário com informações de endereço, tipo de coleta e avaliação;
- registrar descartes usando foto e geolocalização;
- permitir validação administrativa dos registros;
- incentivar participação por meio de pontos e ranking.

## Principais recursos

- Cadastro e login de usuários com Firebase Authentication.
- Home com atalhos para as principais áreas do app.
- Mapa de ecopontos com MapLibre GL.
- Integração com Geoapify para geocodificação e estilo do mapa.
- Integração com SheetDB para carregar pontos de coleta.
- Registro de descarte com câmera e localização do celular.
- Ranking de usuários por pontuação.
- Área administrativa para validar descartes pendentes.
- Gerenciamento de administradores.
- Recuperação e alteração de senha.
- Tela explicativa com informações técnicas da API.

## Tecnologias utilizadas

### Frontend mobile

- Ionic
- Angular
- TypeScript
- SCSS
- Ionicons

### Recursos nativos

- Capacitor
- Camera
- Geolocation
- Android

### Dados, autenticação e serviços externos

- Firebase Authentication
- Cloud Firestore
- Geoapify
- MapLibre GL
- SheetDB

### API auxiliar

- Node.js
- Express
- Axios
- CORS

## Como o mapa funciona

O mapa combina dados de diferentes fontes:

1. O app busca os ecopontos no SheetDB.
2. Cada ponto pode vir com `lat` e `lng`.
3. Se um ponto não tiver coordenadas, o app envia o endereço para a API da Geoapify.
4. A Geoapify retorna `lat` e `lon`.
5. No app, `lon` é convertido para `lng`.
6. O MapLibre usa as coordenadas no formato `[longitude, latitude]`.
7. O app cria marcadores no mapa com `setLngLat([ponto.lng, ponto.lat])`.
8. As coordenadas encontradas são salvas em cache local para evitar chamadas repetidas.

O app também usa a localização do usuário para calcular a distância aproximada até cada ecoponto usando a fórmula de Haversine.

## Fluxo do usuário

1. O usuário cria uma conta ou faz login.
2. Acessa a tela inicial do EcoPonto.
3. Entra na área de pontos de coleta.
4. Visualiza ecopontos no mapa e em lista.
5. Filtra por tipo de descarte.
6. Registra um descarte com foto e localização.
7. Aguarda validação administrativa.
8. Recebe pontuação após o descarte ser validado.
9. Acompanha sua posição no ranking.

## Fluxo administrativo

Usuários administradores possuem permissões extras:

- visualizar registros pendentes;
- validar descartes enviados;
- conceder ou remover acesso administrativo;
- acompanhar ranking e pendências.

Um descarte só gera pontuação depois de ser validado por um administrador.

## Estrutura do projeto

```text
EcoPonto/
├── android/                         # Projeto Android gerado pelo Capacitor
├── eco-api/                         # API auxiliar em Node.js/Express
├── src/
│   ├── app/
│   │   ├── coleta/                  # Tela de mapa, ecopontos e registro
│   │   ├── consulta-api/            # Tela com informações da API
│   │   ├── ranking/                 # Ranking e validação de descartes
│   │   ├── painel/                  # Painel do usuário
│   │   ├── gerenciar-administradores/
│   │   ├── services/                # Serviços de usuário, coleta e ranking
│   │   └── app.routes.ts            # Rotas e guards
│   ├── environments/                # Configurações de APIs e Firebase
│   └── main.ts                      # Inicialização do Angular/Firebase
├── firestore.rules                  # Regras de segurança do Firestore
├── capacitor.config.ts              # Configuração do Capacitor
├── package.json                     # Scripts e dependências
└── README.md
```

## Requisitos

- Node.js LTS
- npm
- Angular CLI
- Android Studio, para gerar APK
- Java JDK compatível com Gradle/Android
- Conta/projeto Firebase configurado
- Chave da Geoapify

## Instalação

Clone o repositório e instale as dependências:

```bash
npm install
```

## Rodando no navegador

```bash
npm start
```

Depois acesse:

```text
http://localhost:4200
```

## Build web

```bash
npm run build
```

O resultado é gerado na pasta `www/`, usada pelo Capacitor para o Android.

## Sincronizando com Android

```bash
npx cap sync android
```

## Gerando APK

O projeto possui um script para gerar APK debug:

```bash
npm run apk
```

Esse script compila o Angular, sincroniza o Capacitor e gera um APK debug. No Windows, ele também tenta copiar o arquivo para a Área de Trabalho.

Se o Gradle reclamar do `JAVA_HOME`, configure a variável para um JDK instalado, por exemplo:

```powershell
$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-21.0.10.7-hotspot'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
npm run apk
```

## API auxiliar local

A pasta `eco-api/` possui uma API simples em Node.js/Express para servir pontos de coleta.

Para rodar:

```bash
cd eco-api
npm install
node server.js
```

Endpoints principais:

```text
GET /api/status
GET /api/pontos-coleta
GET /ecopontos
```

A API tenta buscar dados no SheetDB. Se não conseguir, usa uma lista local de fallback.

## Firebase e Firestore

O app usa Firebase para autenticação e Firestore para dados de usuários, descartes, ranking e permissões administrativas.

As regras do Firestore ficam em:

```text
firestore.rules
```

Para publicar regras, use o Firebase CLI com o projeto correto configurado.

## Configurações importantes

As URLs e chaves ficam em:

```text
src/environments/environment.ts
src/environments/environment.prod.ts
```

Configurações principais:

- `apiPontosColetaUrl`: URL do SheetDB.
- `geoapifyApiKey`: chave usada para mapa/geocodificação.
- `firebaseConfig`: configuração do projeto Firebase.

Para uso em produção, revise as chaves, restrições de domínio, regras do Firestore e permissões administrativas.

## Participantes

- Gabriel Suliano
- Samuel Valentim
- Beatriz Freitas

## Status do projeto

Projeto acadêmico funcional com:

- app mobile Ionic/Angular;
- integração com mapa e geolocalização;
- Firebase Authentication;
- Firestore;
- ranking;
- área administrativa;
- geração de APK via Capacitor.
