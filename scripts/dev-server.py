#!/usr/bin/env python3
"""Servidor local com as mesmas rotas limpas do netlify.toml."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
HOST = "127.0.0.1"
PORT = 4173

REWRITES = {
    "/press-kit/one-sheet": "/content/press-kit/one-sheet.html",
    "/press-kit/bio-curta.txt": "/content/press-kit/bio-curta.txt",
    "/press-kit/bio-longa.txt": "/content/press-kit/bio-longa.txt",
    "/press-kit/legendas-sociais.md": "/content/press-kit/legendas-sociais.md",
    "/robots.txt": "/seo/robots.txt",
    "/sitemap.xml": "/seo/sitemap.xml",
    "/manifest.webmanifest": "/seo/manifest.webmanifest",
}

LEGACY = {
    "/sobre.html": "/sobre/",
    "/lp.html": "/lp/",
    "/agenda.html": "/agenda/",
    "/locais.html": "/locais/",
    "/press-kit.html": "/press-kit/",
    "/campanhas.html": "/campanhas/",
    "/contato.html": "/contato/",
    "/privacidade.html": "/privacidade/",
    "/obrigado.html": "/obrigado/",
    "/press-kit/one-sheet.html": "/press-kit/one-sheet",
    "/press": "/press-kit/",
}


def clean_path(raw: str) -> str:
    path = urlparse(raw).path.rstrip("/") or "/"
    return path


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def translate_path(self, path):
        cleaned = clean_path(path)
        if cleaned in REWRITES:
            return super().translate_path(REWRITES[cleaned])
        folder = ROOT / cleaned.lstrip("/")
        index = folder / "index.html"
        if folder.is_dir() and index.exists():
            return str(index)
        return super().translate_path(path)

    def do_GET(self):
        raw = urlparse(self.path).path
        path = clean_path(self.path)
        if path in LEGACY:
            self.send_response(301)
            self.send_header("Location", LEGACY[path])
            self.end_headers()
            return
        folder = ROOT / path.lstrip("/")
        if path != "/" and folder.is_dir() and not raw.endswith("/"):
            self.send_response(301)
            self.send_header("Location", path + "/")
            self.end_headers()
            return
        return super().do_GET()

    def send_error(self, code, message=None, explain=None):
        if code != 404:
            return super().send_error(code, message, explain)
        body = (ROOT / "404.html").read_bytes()
        self.send_response(404)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD" and self.wfile:
            self.wfile.write(body)


if __name__ == "__main__":
    server = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"GuiWave local em http://{HOST}:{PORT}", flush=True)
    server.serve_forever()
