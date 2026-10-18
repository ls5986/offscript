import { readdir, writeFile, readFile, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { createHash } from "node:crypto";

for (const file of [".env", ".env.local"])
  if (existsSync(file)) loadEnvFile(file);

const escape = (text) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
const configuredOrigin =
  process.env.OFFSCRIPT_SITE_URL?.trim() ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "");
let origin = "";
if (configuredOrigin) {
  const url = new URL(configuredOrigin);
  if (
    url.protocol !== "https:" ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  )
    throw new Error(
      "OFFSCRIPT_SITE_URL must be a public HTTPS origin without credentials or a subdirectory.",
    );
  origin = url.origin;
}
const email = process.env.OFFSCRIPT_SUPPORT_EMAIL?.trim() || "";
if (
  email &&
  !/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?)+$/.test(
    email,
  )
)
  throw new Error(
    "OFFSCRIPT_SUPPORT_EMAIL must be a valid public contact email, not HTML or a URL.",
  );
const contact = email
  ? `<p>Email <a href="mailto:${escape(email)}">${escape(email)}</a> for support or privacy requests. Send only what is needed to explain your request. Do not send passwords or verification codes.</p>`
  : '<p>For general help, use the <a href="https://github.com/ls5986/offscript/issues">Off Script issue tracker</a>. Reports are public and posting requires a GitHub account. For a private request, ask for private contact instructions first without posting personal details.</p>';

function metadata(path) {
  return `${origin ? `<link rel="canonical" href="${escape(origin + path)}"><meta property="og:url" content="${escape(origin + path)}"><meta property="og:image" content="${escape(origin)}/share-card.png">` : ""}
<meta property="og:site_name" content="Off Script"><meta property="og:type" content="website"><meta name="theme-color" content="#172B49"><link rel="icon" href="/favicon.png"><link rel="apple-touch-icon" href="/icon-192.png"><link rel="manifest" href="/manifest.webmanifest">`;
}

async function files(path = "dist") {
  const all = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    const file = path + "/" + entry.name;
    if (entry.isDirectory()) all.push(...(await files(file)));
    else all.push(file);
  }
  return all.sort();
}

let html = await readFile("dist/index.html", "utf8");
html = html.replace(
  /<title>.*?<\/title>/,
  "<title>Play Off Script — Improv games &amp; prompts</title>",
);
if (!html.includes("<title>"))
  html = html.replace("</head>", "<title>Play Off Script</title></head>");
const lockup = await readFile("public/brand/lockup.svg", "utf8");
html = html.replace(
  '<div id="root"></div>',
  `<div id="root"><div role="status" aria-live="polite" class="boot">${lockup}<p>Getting the games ready…</p></div></div>`,
);
const preloads = (await files())
  .filter((path) => path.endsWith(".woff2"))
  .map(
    (path) =>
      `<link rel="preload" href="/${path.slice(5)}" as="font" type="font/woff2" crossorigin="anonymous">`,
  )
  .join("");
html = html.replace(
  "</head>",
  `${preloads}
<style>.boot{display:flex;flex:1;flex-direction:column;align-items:center;justify-content:center;gap:14px;background:#F8F6F1;color:#555F70;font:16px/1.5 system-ui,sans-serif}.boot svg{width:200px;height:40px}.boot p{margin:0}</style>
<meta name="description" content="Play 39 improv games and build prompts in your browser. One device, no account. Saves stay on this browser.">
<meta property="og:title" content="Play Off Script"><meta name="twitter:card" content="summary_large_image">${metadata("/play")}</head>`,
);
await writeFile("dist/app.html", html);

for (const [name, path] of [
  ["index", "/"],
  ["privacy", "/privacy"],
  ["support", "/support"],
]) {
  const source = await readFile(`release-pages/${name}.html`, "utf8");
  await writeFile(
    `dist/${name}.html`,
    source
      .replace("<!-- SITE_METADATA -->", metadata(path))
      .replace("<!-- SUPPORT_CONTACT -->", contact),
  );
}
await copyFile("release-pages/styles.css", "dist/styles.css");
await writeFile(
  "dist/404.html",
  '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found | Off Script</title><link rel="stylesheet" href="/styles.css"><main class="page"><h1>A little off script.</h1><p>This page does not exist.</p><p><a href="/">Go to the website</a> or <a href="/play">play Off Script</a>.</p></main></html>',
);
await writeFile(
  "dist/_redirects",
  [
    "/privacy /privacy.html 200",
    "/support /support.html 200",
    ...[
      "play",
      "library",
      "studio",
      "saved",
      "settings",
      "start",
      "games",
      "party",
      "session",
    ].flatMap((route) => [
      `/${route} /app.html 200`,
      `/${route}/* /app.html 200`,
    ]),
  ].join("\n") + "\n",
);

const paths = (await files())
  .filter((path) => !path.endsWith("/sw.js"))
  .map((path) => "/" + path.slice(5));
const digest = createHash("sha256");
for (const path of paths) {
  digest.update(path);
  digest.update(await readFile("dist" + path));
}
const version = digest.digest("hex").slice(0, 12);
await writeFile(
  "dist/sw.js",
  `const CACHE='off-script-${version}';
const ASSETS=${JSON.stringify(paths)};
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('off-script-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin||event.request.method!=='GET')return;
  if(event.request.mode==='navigate'){
    const path=url.pathname.replace(/\\/$/,'')||'/';
    const publicPages={'/':'/index.html','/index.html':'/index.html','/privacy':'/privacy.html','/privacy.html':'/privacy.html','/support':'/support.html','/support.html':'/support.html'};
    const fallback=publicPages[path]||(/^\\/(play|library|studio|saved|settings|start|games|party|session)(\\/|$)/.test(path)?'/app.html':'/404.html');
    event.respondWith(fetch(event.request).catch(async()=>{const cached=await caches.match(fallback);return cached||new Response('Offline. Connect once to load Off Script.',{status:503,headers:{'Content-Type':'text/plain'}})}));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
`,
);
console.log(
  `Website and offline cache ${version}: ${paths.length} local files. ${email ? "Public support email configured." : "No public support email configured; issue-tracker support only."}`,
);
