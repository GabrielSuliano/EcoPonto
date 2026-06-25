# EcoPonto API

API REST em Node.js e Express para fornecer informações de ecopontos ao aplicativo.

## Como executar

```powershell
cd eco-api
npm install
npm start
```

O serviço será iniciado na porta `3002`.

## Endpoints

- `GET /api/status`: verifica se a API está online.
- `GET /api/pontos-coleta`: retorna a lista normalizada de ecopontos.
- `GET /ecopontos`: mantém compatibilidade com a versão inicial do projeto.

Exemplo local:

```text
http://localhost:3002/api/pontos-coleta
```

## Origem dos dados

A API tenta consultar a planilha conectada ao SheetDB. Caso a planilha esteja
indisponível ou vazia, o serviço retorna uma lista local de segurança para manter
a apresentação funcional.

## Aplicativo no smartphone

O aplicativo consulta o SheetDB diretamente pela internet e mantém dados locais
de segurança quando a planilha estiver indisponível ou vazia. O smartphone não
depende de um servidor iniciado no computador.
