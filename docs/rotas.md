# Rotas públicas

O visitante nunca precisa ver `/pages` nem `/seo`. A tabela abaixo é o contrato de URL.

## Páginas

| URL pública | Arquivo | Observação |
|---|---|---|
| `/` | `index.html` | Home |
| `/sobre` | `pages/sobre.html` | Biografia |
| `/lp` | `pages/lp.html` | Landing SINAL |
| `/agenda` | `pages/agenda.html` | Datas |
| `/locais` | `pages/locais.html` | Casas de Curitiba |
| `/press-kit` | `pages/press-kit.html` | EPK |
| `/campanhas` | `pages/campanhas.html` | Políticas de posicionamento |
| `/contato` | `pages/contato.html` | Booking + Netlify Forms |
| `/privacidade` | `pages/privacidade.html` | LGPD e cookies |
| `/obrigado` | `pages/obrigado.html` | Pós-envio do formulário (`noindex`) |
| *(qualquer outra)* | `pages/404.html` | Status 404 |

## Materiais de imprensa

| URL pública | Arquivo |
|---|---|
| `/press-kit/one-sheet` | `content/press-kit/one-sheet.html` |
| `/press-kit/bio-curta.txt` | `content/press-kit/bio-curta.txt` |
| `/press-kit/bio-longa.txt` | `content/press-kit/bio-longa.txt` |
| `/press-kit/legendas-sociais.md` | `content/press-kit/legendas-sociais.md` |

## Descoberta

| URL pública | Arquivo |
|---|---|
| `/robots.txt` | `seo/robots.txt` |
| `/sitemap.xml` | `seo/sitemap.xml` |
| `/manifest.webmanifest` | `seo/manifest.webmanifest` |

## Compatibilidade

URLs antigas com `.html` na raiz (`/sobre.html`, `/lp.html`, …) e `/press` respondem **301** para a URL limpa. O sitemap já lista só as URLs canônicas.
