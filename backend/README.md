# /dis-quiz — página de disparo (backend / WhatsApp)

Cópia da página principal (`/`) adaptada para o tráfego de disparo.
**Não usa RedTrack** — a atribuição vem inteira dos parâmetros da URL.

## Como montar a URL do disparo

```
https://divessencebeauty.com.br/dis-quiz?src=SUA-CAMPANHA&utm_source=whatsapp&utm_medium=disparo-dv&full_name=NOME&email=EMAIL&phone=TELEFONE
```

| Parâmetro | Para que serve | Obrigatório |
|---|---|---|
| `src` | origem do disparo (lista, data, criativo) | recomendado — sem ele usa `dis-quiz` |
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

## Como o kit é identificado

Cada card aponta para um produto diferente da Payt, então o kit já fica
identificado pelo produto. O `src` é **o mesmo para todos os kits** — quem
diferencia é o `utm_content`, preenchido automaticamente:

| Card | Produto Payt | `utm_content` |
|---|---|---|
| 1 unidade | `xQW35b4LU2RGXoGg` | `k1` |
| Compre 2, leve 3 | `E0eMwPyBF23R1v7K` | `k3` |
| 6 unidades | `K0owb2yYIVwmpvna` | `k6` |
| Assinatura mensal | `Pko6KYzlcngL8en0` | `assinatura` |

O `split=12` nos três kits controla o parcelamento exibido no checkout.

## Arquivos

- `assets/js/checkout-params.js` — captura os parâmetros da URL, guarda no
  `localStorage` e monta o link da Payt conforme a oferta selecionada.
- Demais `assets/` — espelho da página principal `/`. Ao aprimorar a raiz,
  reaplique aqui; a única diferença proposital são os links de checkout.

Para depurar no console: `CheckoutParams.getSavedParams()`.

## Teste rápido

Abra com `?src=teste&full_name=Maria%20Silva&email=teste@teste.com&phone=11988887777`,
selecione cada kit e confira o `href` do botão "Comprar agora".
