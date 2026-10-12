/**
 * Odonto Excellence Canela - Servidor Local de Desenvolvimento com Bun
 * Suporta URLs limpas sem .html (ex: /facetas, /sobre, /contato)
 */
import { statSync, existsSync } from "fs";
import { join, extname } from "path";
import contactHandler from "./api/contato.js";

const PORT = 3000;
const BASE_DIR = import.meta.dir;

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8"
};

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let pathname = decodeURIComponent(url.pathname);

    // Rota da API Serverless /api/contato
    if (pathname === "/api/contato") {
      let body: any = {};
      if (req.method === "POST") {
        try {
          body = await req.json();
        } catch {
          body = {};
        }
      }

      let statusCode = 200;
      const headers = new Headers();
      let responseBody: any = "";

      const mockRes = {
        status(code: number) {
          statusCode = code;
          return mockRes;
        },
        setHeader(name: string, value: string) {
          headers.set(name, value);
          return mockRes;
        },
        json(data: any) {
          headers.set("Content-Type", "application/json; charset=utf-8");
          responseBody = JSON.stringify(data);
          return mockRes;
        },
        end() {
          return mockRes;
        }
      };

      const mockReq = {
        method: req.method,
        headers: Object.fromEntries(req.headers.entries()),
        body
      };

      await contactHandler(mockReq as any, mockRes as any);

      return new Response(responseBody, {
        status: statusCode,
        headers
      });
    }

    // Resolve o caminho do arquivo
    let filePath = join(BASE_DIR, pathname);

    // Se for raiz '/', busca index.html
    if (pathname === "/") {
      filePath = join(BASE_DIR, "index.html");
    } 
    // Se for uma pasta existente ou slug sem extensão (ex: /sobre, /facetas)
    else if (!extname(pathname)) {
      const folderIndex = join(filePath, "index.html");
      const htmlFile = `${filePath}.html`;

      if (existsSync(folderIndex)) {
        filePath = folderIndex;
      } else if (existsSync(htmlFile)) {
        filePath = htmlFile;
      }
    }

    // Se o arquivo existe e é arquivo regular
    if (existsSync(filePath)) {
      try {
        const stat = statSync(filePath);
        if (stat.isFile()) {
          const file = Bun.file(filePath);
          const ext = extname(filePath).toLowerCase();
          const contentType = MIME_TYPES[ext] || "application/octet-stream";

          return new Response(file, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "no-cache"
            }
          });
        }
      } catch (err) {
        console.error("Erro ao ler arquivo:", err);
      }
    }

    // Página 404 personalizada
    const notFoundPath = join(BASE_DIR, "404.html");
    if (existsSync(notFoundPath)) {
      return new Response(Bun.file(notFoundPath), {
        status: 404,
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    return new Response("404 Not Found", { status: 404 });
  }
});

console.log(`🚀 Odonto Excellence Canela rodando em: http://localhost:${server.port}`);
