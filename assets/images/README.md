# Guia de imagens — Landing GHK-Cu (Flynow)

Cada `<figure class="ph" data-img="NOME">` no `index.html` é um **placeholder**.
Substitua trocando o `<figure>` por uma `<img>` com o mesmo enquadramento, ou
coloque o arquivo aqui e ajuste o `src`. Formatos: use `.webp` quando possível
(fallback `.jpg`/`.png`). Fundos de mockup de produto devem ser **transparentes (PNG)**.

Paleta da página (para casar os fundos das fotos):
- Marfim `#FBF8F3` · Creme `#F3ECE1` · Areia `#E7DBCB`
- Cobre `#B67A54` · Blush `#EBD8CA` · Tinta `#2B2621`

| # | Arquivo (`data-img`)              | Onde aparece            | Tamanho sugerido | Observações |
|---|-----------------------------------|-------------------------|------------------|-------------|
| 1 | `logo` (texto "flynow")           | Header e footer         | ~140×40          | SVG/PNG horizontal. Versão escura p/ header, clara p/ footer. |
| 2 | `mockup-serum-hero.png`           | Hero principal          | 900×1100         | **Seu mockup do sérum.** Fundo transparente, luz suave, frasco centralizado. |
| 3 | `pele-close.jpg`                  | Seção Bioestimulação    | 800×960          | Close de pele/textura ou aplicação do produto. Tom quente. |
| 4 | `ativo-ghkcu.jpg`                 | Card ingrediente 1      | 600×600          | Molécula de cobre / gota / textura cobreada. |
| 5 | `ativo-acido-hialuronico.jpg`     | Card ingrediente 2      | 600×600          | Gota/gel translúcido, sensação de hidratação. |
| 6 | `ativo-colageno.jpg`              | Card ingrediente 3      | 600×600          | Textura estrutural / fibras suaves. |
| 7 | `ilustracao-sinalizacao.jpg`      | Seção Sinalização       | 760×760          | Ilustração da ação do peptídeo na pele ou abstrato cobre. |
| 8 | `serum-textura.jpg`               | Seção "Fórmulas avanç." | 820×980          | Macro da textura do sérum (gota escorrendo, swatch). |
| 9 | `concern-manchas.jpg`             | Indicações              | 400×400          | Ícone/foto redonda — manchas. |
| 10| `concern-olheiras.jpg`            | Indicações              | 400×400          | Redonda — área dos olhos. |
| 11| `concern-rugas.jpg`               | Indicações              | 400×400          | Redonda — linhas finas/firmeza. |
| 12| `concern-hidratacao.jpg`          | Indicações              | 400×400          | Redonda — hidratação/viço. |
| 13| `mockup-unidade.png`              | Plano "Unidade"         | 500×500          | 1 frasco, fundo transparente. |
| 14| `mockup-combo.png`                | Plano "Combo" (destaque)| 560×560          | 3 frascos, fundo transparente. |
| 15| `mockup-assinatura.png`           | Plano "Assinatura"      | 500×500          | 1 frasco + selo de recorrência. |
| 16| `cliente-1/2/3.jpg`               | Depoimentos             | 120×120          | Avatares redondos de clientes. |

## Como substituir um placeholder por imagem real

Troque isto:
```html
<figure class="ph ph--hero" data-img="mockup-serum-hero.png">
  <span class="ph__label">Mockup do Sérum GHK-Cu</span>
</figure>
```
Por isto:
```html
<img class="ph ph--hero" src="assets/images/mockup-serum-hero.png"
     alt="Sérum GHK-Cu Flynow" width="900" height="1100" loading="lazy" />
```
As classes `ph--hero`, `ph--square`, etc. já mantêm a proporção correta.
