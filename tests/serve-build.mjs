import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = path.resolve("dist");
const headerFile = await readFile(path.join(root, "_headers"), "utf8");
const csp = headerFile.match(/^\s+Content-Security-Policy:\s*(.+)$/m)?.[1];
if (!headerFile.startsWith("/*\n") || !csp) {
  throw new Error("Globaler CSP-Header fehlt. Zuerst npm run build ausführen.");
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".webp": "image/webp",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".xml": "application/xml",
  ".txt": "text/plain",
};

createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    let file = path.resolve(root, `.${pathname}`);
    if (!file.startsWith(`${root}${path.sep}`) && file !== root) {
      res.writeHead(400).end();
      return;
    }
    if ((await stat(file).catch(() => null))?.isDirectory()) {
      file = path.join(file, "index.html");
    }
    let body = await readFile(file).catch(() => null);
    let status = 200;
    if (!body) {
      file = path.join(root, "404.html");
      body = await readFile(file);
      status = 404;
    }
    res.writeHead(status, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
      "Content-Security-Policy": csp,
      "Cache-Control": "no-store",
    });
    res.end(req.method === "HEAD" ? undefined : body);
  } catch {
    res.writeHead(400).end();
  }
}).listen(4322, "127.0.0.1", () => {
  console.log("Local: http://127.0.0.1:4322 (Produktions-Build mit CSP)");
});
