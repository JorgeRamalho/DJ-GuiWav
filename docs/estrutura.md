# Estrutura do repositório

Padrão usado: **raiz enxuta + uma responsabilidade por pasta + um arquivo por rota ou artefato**.

```
Projeto-DJ-GuiWave/
├── index.html              entrada pública
├── netlify.toml            deploy, headers e rotas
├── .gitignore
├── README.md
├── pages/                  páginas HTML internas (uma por rota)
├── assets/                 CSS, JS e mídia servidos ao navegador
│   ├── css/
│   ├── js/
│   └── img/
│       ├── brand/          selo, wordmark, lockup, favicon
│       ├── artista/        fotos oficiais de cabine
│       └── creatives/      peças de feed, story e capa
├── content/                arquivos para download, não são páginas do site
│   └── press-kit/          bios, one-sheet, legendas
├── data/                   pesquisa bruta (não entra no runtime do site)
├── seo/                    robots, sitemap e manifesto PWA
├── docs/                   documentação do projeto
└── scripts/                utilitários locais
```

## Por que assim

1. **Raiz enxuta** — quem abre o repositório vê entrada e config, não uma lista de HTML solto.
2. **Uma página, um arquivo** — cada rota pública tem um HTML em `pages/`. A home fica em `index.html` porque é o documento raiz da web.
3. **URL estável, pasta livre** — o visitante continua em `/sobre` e `/press-kit`. O Netlify reescreve para o arquivo físico. Ver `docs/rotas.md`.
4. **Conteúdo ≠ código** — bios e one-sheet não misturam com CSS/JS. Pesquisa do Instagram não mistura com `data.js` de produção.
5. **SEO na pasta, não na bagunça** — `robots.txt`, `sitemap.xml` e o manifesto precisam existir na URL raiz. Fisicamente ficam em `seo/`; o `netlify.toml` os publica em `/`.

## Convenção de caminhos

Todo recurso público usa caminho absoluto a partir da raiz do site (`/assets/...`, `/sobre`, `/`). Assim a profundidade da pasta do HTML não quebra CSS, imagens ou o menu.

Não abrir os arquivos via `file://`. Servir com `python scripts/dev-server.py` ou pelo Netlify.
