# /backend-cupom — página de disparo com cupom (WhatsApp)

Versão de disparo da `/pv-cupom`. Mantém o conteúdo da página original — 7 motivos,
raspadinha, checkout inline, contador de 30 min — e troca a camada de checkout.
**Não usa RedTrack:** a atribuição vem inteira dos parâmetros da URL.

## Como montar a URL do disparo

```
https://divessencebeauty.com.br/backend-cupom?src=SUA-CAMPANHA&utm_source=whatsapp&utm_medium=disparo-dv&full_name=NOME&email=EMAIL&phone=TELEFONE
```

| Parâmetro | Para que serve | Obrigatório |
|---|---|---|
| `src` | origem do disparo (lista, data, criativo) | recomendado — sem ele usa `backend-cupom` |
| `utm_source`, `utm_medium`, `utm_campaign`, `utm_term` | rastreio de campanha | opcional |
| `full_name` | **pré-preenche** NOME COMPLETO no checkout | opcional |
| `email` | **pré-preenche** E-MAIL no checkout | opcional |
| `phone` | **pré-preenche** CELULAR / WHATSAPP | opcional |
| `fbclid`, `gclid` | repassados adiante | opcional |

Os três campos de pré-preenchimento cobrem a **etapa 1 inteira** do checkout da Payt.
O campo de CPF não aceita pré-preenchimento.

> **Codifique os valores.** Nome com espaço vira `Maria%20Silva` ou `Maria+Silva`
> (a Payt aceita os dois); acento vira `%C3%A7` etc. Se o disparador não codificar,
> a URL quebra em nomes compostos ou acentuados.

## Produtos da Payt

Esta página usa os produtos **PROMOCIONAIS**, com preço de cupom — diferentes
dos que a `/backend` usa. Cada card aponta para um produto distinto, então o kit
já fica identificado pelo produto; o `utm_content` vai junto só para facilitar o
relatório.

| Card | Produto Payt | Cobrado | `utm_content` |
|---|---|---|---|
| 1 unidade | `nVoQ4YkRCZPlNvbq` | R$ 89,90 | `k1` |
| Compre 2, leve 3 | `zVWR3XAwTmLR3vxR` | R$ 179,91 | `k3` |
| 6 unidades | `9RoG1PZPc0MJ7W7K` | R$ 279,90 | `k6` |
| Assinatura mensal | `r0oZRXgLTbkRpo6P` | R$ 79,90 | `assinatura` |

O `src` é **o mesmo para todos os kits** e vem da URL do disparo.

### Não use `split=12` nestes links

O parâmetro faz a Payt exibir o parcelamento em 12x **com juros** (~20,5%) como
total em destaque, contradizendo o "12x sem juros" que a página anuncia:

| Card | Página anuncia | Payt com `split=12` |
|---|---|---|
| 1 un | 12x R$ 7,49 (R$ 89,88) | 12x R$ 9,03 (R$ 108,36) |
| 3 un | 12x R$ 14,99 (R$ 179,88) | 12x R$ 18,06 (R$ 216,72) |
| 6 un | 12x R$ 23,33 (R$ 279,96) | 12x R$ 28,10 (R$ 337,20) |

Sem o parâmetro, o checkout exibe o valor à vista real e o cliente escolhe o
parcelamento na etapa de pagamento.

## Diferenças em relação à /pv-cupom

- Links de checkout: produtos Payt diretos no lugar de `red.track/click/N`
- Sem RedTrack (nem `unilpclick.js`, nem postback, nem `smartplayer-click-event`)
- Contador com a chave `divessence-backend-cupom-deadline-v1`, própria, para não
  dividir o prazo com a `/pv-cupom` no mesmo domínio
- Kit de 3 exibido como R$ 179,91 (a `/pv-cupom` exibe R$ 179,90, mas a Payt
  cobra 179,91 — e 59,97 × 3 = 179,91, que é o valor por frasco que a própria
  página mostra)

## Arquivos

- `assets/js/checkout-params.js` — captura os parâmetros da URL, guarda no
  `localStorage` e monta o link da Payt conforme a oferta selecionada.
- `assets/js/7-motivos.js` — seção editorial, raspadinha, modais de depoimento
  e contador regressivo.
- Demais `assets/` — cópia própria, **isolada da `/pv-cupom` de propósito**:
  ajustes feitos lá para tráfego pago não devem afetar o disparo.

Para depurar no console: `CheckoutParams.getSavedParams()`.

## Teste rápido

Abra com `?src=teste&full_name=Maria%20Silva&email=teste@teste.com&phone=11988887777`,
raspe a raspadinha, selecione cada kit e confira o `href` do botão "Comprar agora".
