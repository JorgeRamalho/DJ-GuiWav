# Pesquisa e fontes

O conteúdo público do site (bios, números, agenda e casas) foi cruzado com fontes abertas. A coleta bruta fica em `data/`; o runtime do site lê só `assets/js/data.js`.

## Arquivo-fonte

| Arquivo | O que guarda |
|---|---|
| `data/instagram-research.json` | Coleta de 26–27 out 2026: perfil `@gui_wav`, posts, destaques, SoundCloud e YouTube |

Método registrado no JSON: Playwright sobre o perfil público e posts abertos. Não há credencial nem dado privado.

## O que entrou no site

- Nome civil, handle, formação AIMEC, alias Frenyx e CEO da WAV Fest
- 1.339 seguidores, 11 posts, razão de comentário no post da jornada
- 4.098 plays do set `@CIRCUITO2026`
- Vice da 3ª etapa e classificação à final no Park Art
- Casas-alvo de Curitiba (Vibe, Danghai, Park Art e demais)

## O que não entra no runtime

O JSON de pesquisa não é carregado pelo navegador. Se um número mudar, atualize `assets/js/data.js` e, se for o caso, o texto das páginas — depois registre a nova coleta em `data/`.
