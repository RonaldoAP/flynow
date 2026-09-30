# Advertorial 3 Divessence

Página estática baseada no conteúdo de `Advertorial 3 - Divessence .docx` e na composição visual de https://officialquasi.com/pages/5-reasons. Site da operação: https://www.divessencebeauty.com.br/.

## Publicação

Extraia o ZIP e envie `index.html`, `css/`, `js/` e `assets/` para a pasta escolhida na hospedagem. Todos os caminhos são relativos. Não exige instalação ou build. Esta versão foi criada localmente; não foi publicada automaticamente.

## Conteúdo e visual

Cinco motivos, assinatura, nota, prova social, oferta e condições do Word preservados. Corrigidos apenas “ela transforma” para “ele transforma” e o espaço em “agindo. De”. Marcadores de edição do Word não entram na página. A diagramação usa imagem ao lado do texto no desktop, blocos empilhados no celular e oferta em duas colunas no final, com a identidade azul do Divessence.

O DOCX não contém imagens. As imagens de produto, aplicação e logo vieram dos materiais Divessence já existentes no projeto; a foto da autora veio do HTML fornecido anteriormente pelo usuário, associado à mesma assinatura. Fontes Manrope locais. Nenhum asset da marca Quasi foi incluído.

## RedTrack

- Domínio correto: `https://red.track.divessencebeauty.com.br`, sem `www`.
- Dois CTAs em `/preclick`, com `data-offer-link` e `smartplayer-click-event`.
- Uma única inclusão de `https://red.track.divessencebeauty.com.br/pretrack.js?` no final do `body`, depois de `config.js` e `main.js`.
- UTMs e parâmetros recebidos são preservados; o script oficial atribui `clickid` e `rtkck`. Valores antigos desses dois parâmetros na entrada não são duplicados.
- Nenhum postback manual de checkout ou compra nesta pressel.
- O arquivo oficial consultado em 30/09/2026 não contém campanha padrão. O fluxo precisa receber `rtkcid` válido pelo link da campanha, ou `rtkcmpid` para a entrada direta. Não foi inventado um ID de campanha. O destino após o preclick depende do funil configurado no painel.

## Contador

A pedido do usuário, inicia em **05h59min59s a cada abertura/recarregamento**, sem data fixa. Os dois contadores compartilham o mesmo prazo e acompanham o tempo decorrido mesmo após a aba ficar em segundo plano. Não há persistência entre aberturas. Ao zerar, os contadores são ocultados e o rótulo superior passa a “Consulte a oferta atual”; não reiniciam automaticamente nessa abertura.

A duração está em `js/config.js`, campo `offerDurationSeconds: 21599`.

## Conferência

Conteúdo comparado com o Word, arquivos e imagens conferidos, JavaScript validado. Prévia conferida em desktop e larguras de 390 e 320 px, sem rolagem horizontal. Contadores sincronizados e reinício ao recarregar conferidos. Oito verificações dos dois CTAs em quatro cenários offline cobrem atribuição oficial, UTMs, parâmetros repetidos e ausência de duplicação. Nenhum evento real de teste foi enviado ao RedTrack. Aceitação no painel e redirecionamento real exigem uma visita válida da campanha.

As pastas `.source/` e `.qa/` são internas e não fazem parte do ZIP de publicação.
