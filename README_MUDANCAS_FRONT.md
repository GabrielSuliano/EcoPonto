# Mudancas do Front-end

Este arquivo resume a revisao visual e estrutural feita no front-end do EcoPonto.

## Status da revisao

- `npm run lint`: aprovado.
- `npm run build`: aprovado.
- `npm test -- --watch=false --browsers=ChromeHeadless`: aprovado, 8 testes com sucesso.
- `npm audit`: sem vulnerabilidades apos o override de `esbuild`.
- Nao foram encontrados erros estruturais graves no front-end.

Observacao: o Node instalado e `v25.9.0`. O Angular avisa que versoes impares do Node nao sao LTS, mas isso nao bloqueia o projeto da faculdade.

## Ajustes aplicados

### Home

- Troca do titulo `App do Suliano` para `EcoPonto`.
- Ajuste do bloco verde inicial para melhorar contraste e leitura.
- Reducao da camada clara sobre o hero, deixando o verde mais forte.
- Reforco de contraste nos textos e cards de estatisticas.
- Correcao do atalho que apontava para o ranking, mas estava escrito como guia de reciclagem.
  - Antes: `Guia de Reciclagem`.
  - Agora: `Ver Ranking`.

Arquivos:

- `src/app/home/home.page.html`
- `src/app/home/home.page.scss`

### Mapa e registro de descarte

- Troca do icone de seta/navegacao pelo icone de camera.
- Inclusao de uma chamada visual no mapa:
  - `Registrar reciclagem`
  - `Tire foto do material reciclado.`
- O botao redondo e a chamada visual executam a mesma acao: abrir a camera para registrar o descarte.
- Inclusao do icone `camera-outline` no registro global de icones.

Arquivos:

- `src/app/coleta/coleta.page.html`
- `src/app/coleta/coleta.page.scss`
- `src/app/app.component.ts`

### Ranking

- Ajuste do titulo da tela para ficar coerente com o conteudo.
  - Antes: `Ranking de Ecopontos`.
  - Agora: `Ranking de Usuarios`.

Arquivo:

- `src/app/ranking/ranking.page.html`

### Organizacao de icones

- Criado um helper central para registrar todos os icones usados no app.
- O `AppComponent` agora chama esse helper, deixando o componente principal mais limpo.
- O setup de testes tambem usa o mesmo helper, removendo warnings de Ionicons nos testes unitarios.

Arquivos:

- `src/app/app-icons.ts`
- `src/app/app.component.ts`
- `src/test.ts`

### Dependencias

- Adicionado override para `esbuild@0.28.1`.
- O objetivo foi resolver os alertas do `npm audit` sem usar `npm audit fix --force`, pois o fix automatico sugeria voltar o builder do Angular para uma versao antiga e arriscada para o projeto.

Arquivos:

- `package.json`
- `package-lock.json`

## Conclusao

O front esta organizado o suficiente para entrega academica: build e lint passam, os principais botoes agora comunicam melhor suas acoes e os pontos visuais confusos foram ajustados.
