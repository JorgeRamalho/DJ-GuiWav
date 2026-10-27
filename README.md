# DJ GuiWave

Site institucional de **Guilherme do Nascimento** (GUI WAV): Minimal e Tech House em Curitiba, booking, press kit e landing da LP **SINAL**.

Site estático, sem bundler. A pasta raiz contém só a entrada pública e a configuração do projeto.

## Raiz

| Arquivo | Papel |
|---|---|
| `index.html` | Única página HTML na raiz — home e ponto de entrada |
| `netlify.toml` | Build, headers, rotas limpas e 301 das URLs antigas |
| `.gitignore` | Ignora artefatos locais e pasta `.netlify` |

O restante vive em pastas por responsabilidade. Mapa completo: [`docs/estrutura.md`](docs/estrutura.md). Rotas públicas: [`docs/rotas.md`](docs/rotas.md). Pesquisa que alimenta o conteúdo: [`docs/pesquisa.md`](docs/pesquisa.md).

## Como visualizar

As páginas internas usam URLs limpas (`/sobre`, `/lp`, `/contato`). Isso depende dos *rewrites* do `netlify.toml`.

```bash
python scripts/dev-server.py
```

Abre `http://127.0.0.1:4173`. Em produção, o Netlify aplica as mesmas regras.

## Stack

- HTML semântico, CSS e JavaScript vanilla
- Dados de agenda, casas e tracklist em `assets/js/data.js`
- Formulário de booking via Netlify Forms (`pages/contato.html`)
- Identidade visual e fotos em `assets/img/`
