import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname } from "node:path";

const root = resolve("dist");
const port = Number(process.env.OFFSCRIPT_TEST_PORT ?? 4173);
const config = JSON.parse(await readFile("vercel.json", "utf8"));
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".webmanifest": "application/manifest+json",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};
function matches(source, pathname) {
  if (source === "/(.*)") return true;
  if (source.endsWith("/:path*")) {
    const base = source.slice(0, -"/:path*".length);
    return pathname === base || pathname.startsWith(base + "/");
  }
  return source === pathname;
}

http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      const pathname = decodeURIComponent(url.pathname);
      if (pathname !== "/" && pathname.endsWith("/")) {
        res.writeHead(308, {
          Location: pathname.replace(/\/+$/, "") + url.search,
        });
        res.end();
        return;
      }
      const route = config.rewrites.find((rule) =>
        matches(rule.source, pathname),
      );
      let file = resolve(
        root,
        "." +
          (route?.destination ?? (pathname === "/" ? "/index.html" : pathname)),
      );
      if (!file.startsWith(root + "/")) {
        res.writeHead(403);
        res.end();
        return;
      }
      let status = 200;
      try {
        if (!(await stat(file)).isFile()) {
          status = 404;
          file = root + "/404.html";
        }
      } catch (error) {
        if (error.code !== "ENOENT" && error.code !== "ENOTDIR") throw error;
        status = 404;
        file = root + "/404.html";
      }
      const headers = {
        "Content-Type": types[extname(file)] ?? "application/octet-stream",
        "Cache-Control": "no-cache",
      };
      for (const rule of config.headers)
        if (matches(rule.source, pathname))
          for (const header of rule.headers) headers[header.key] = header.value;
      res.writeHead(status, headers);
      res.end(req.method === "HEAD" ? undefined : await readFile(file));
    } catch (error) {
      console.error("Off Script export request failed:", error);
      res.writeHead(500);
      res.end("Unable to load Off Script");
    }
  })
  .listen(port, "0.0.0.0", () =>
    console.log(`Off Script Vercel-style export at http://localhost:${port}`),
  );
