# pages/

Uma página interna por arquivo. A home não mora aqui — ela é `index.html` na raiz.

| Arquivo | Rota | Função |
|---|---|---|
| `sobre.html` | `/sobre` | Biografia e ficha técnica |
| `lp.html` | `/lp` | Landing da LP SINAL |
| `agenda.html` | `/agenda` | Lista de datas (`data-events`) |
| `locais.html` | `/locais` | Casas e palcos (`data-venues`) |
| `press-kit.html` | `/press-kit` | EPK, bios e banco de fotos |
| `campanhas.html` | `/campanhas` | Políticas de posicionamento |
| `contato.html` | `/contato` | Formulário de booking |
| `privacidade.html` | `/privacidade` | LGPD, cookies e permissões |
| `obrigado.html` | `/obrigado` | Confirmação de envio |
| `404.html` | *(fallback)* | Página não encontrada |

Caminhos de CSS, JS e imagens são absolutos (`/assets/...`). A URL limpa é definida em `netlify.toml`.
