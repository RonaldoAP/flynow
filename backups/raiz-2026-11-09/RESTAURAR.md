# Backup da raiz anterior à promoção do carrossel

Data 09/11/2026, horário de Brasília.
Tag Git backup-raiz-2026-11-09 preserva o estado completo antes da alteração.
O index.html desta pasta é uma cópia exata da raiz anterior.
SHA-256 443fa03a3ed40706a3ccc32033c66b035590df37b2529e5cc90028230556664a

Para restaurar somente a página inicial sem desfazer outros trabalhos, executar na raiz do repositório

    git restore --source=backup-raiz-2026-11-09 -- index.html
    git add index.html
    git commit -m "Restore root homepage from pre-carousel backup"
    git push origin main

Depois conferir a publicação na URL https://www.divessencebeauty.com.br/ e o carregamento dos recursos.
A tag permite recuperar também qualquer dependência caso tenha sido modificada posteriormente.
A cópia HTML de backup serve para restauração. Seus scripts conservam o comportamento original, inclusive as datas da campanha.
