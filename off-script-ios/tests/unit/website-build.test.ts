import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { expect, test } from "vitest";

const builder = resolve("scripts/offline.mjs");
function build(environment: Record<string, string | undefined> = {}) {
  const directory = mkdtempSync(join(tmpdir(), "offscript-site-"));
  for (const path of ["dist", "public/brand", "release-pages"])
    mkdirSync(join(directory, path), { recursive: true });
  writeFileSync(
    join(directory, "dist/index.html"),
    '<html><head><title>App</title></head><body><div id="root"></div></body></html>',
  );
  writeFileSync(
    join(directory, "public/brand/lockup.svg"),
    '<svg xmlns="http://www.w3.org/2000/svg"></svg>',
  );
  for (const name of ["index", "privacy", "support"])
    writeFileSync(
      join(directory, `release-pages/${name}.html`),
      "<html><head><!-- SITE_METADATA --></head><body><!-- SUPPORT_CONTACT --></body></html>",
    );
  writeFileSync(
    join(directory, "release-pages/styles.css"),
    "body { color: #202B3E; }",
  );
  const result = spawnSync(process.execPath, [builder], {
    cwd: directory,
    env: {
      ...process.env,
      OFFSCRIPT_SITE_URL: "",
      OFFSCRIPT_SUPPORT_EMAIL: "",
      VERCEL_PROJECT_PRODUCTION_URL: "",
      ...environment,
    },
    encoding: "utf8",
  });
  return {
    result,
    read: (file: string) => readFileSync(join(directory, "dist", file), "utf8"),
    cleanup: () => rmSync(directory, { recursive: true, force: true }),
  };
}

test("static export separates the landing from the app shell without inventing a public host", () => {
  const output = build();
  try {
    expect(output.result.status, output.result.stderr).toBe(0);
    expect(output.read("app.html")).toContain("Getting the games ready");
    expect(output.read("index.html")).not.toContain('id="root"');
    expect(output.read("app.html")).not.toContain("chatgpt.site");
    expect(output.read("index.html")).not.toContain('rel="canonical"');
    expect(output.read("sw.js")).toContain("/app.html");
    expect(output.read("sw.js")).toContain("/privacy.html");
    expect(output.read("support.html")).toContain(
      "github.com/ls5986/offscript/issues",
    );
  } finally {
    output.cleanup();
  }
});

test("owner-selected domain and public support email are emitted without leaking unrelated environment values", () => {
  const output = build({
    OFFSCRIPT_SITE_URL: "https://improv.example.net/",
    OFFSCRIPT_SUPPORT_EMAIL: "help+offscript@example.net",
    OFFSCRIPT_SECRET_TEST: "never-ship-this-value",
  });
  try {
    expect(output.result.status, output.result.stderr).toBe(0);
    expect(output.read("index.html")).toContain(
      'href="https://improv.example.net/"',
    );
    expect(output.read("privacy.html")).toContain(
      'href="https://improv.example.net/privacy"',
    );
    expect(output.read("support.html")).toContain(
      'href="mailto:help+offscript@example.net"',
    );
    expect(output.read("app.html")).toContain(
      'href="https://improv.example.net/play"',
    );
    for (const file of [
      "app.html",
      "index.html",
      "support.html",
      "privacy.html",
      "sw.js",
    ])
      expect(output.read(file)).not.toContain("never-ship-this-value");
  } finally {
    output.cleanup();
  }
});

test.each([
  { OFFSCRIPT_SITE_URL: "javascript:alert(1)" },
  { OFFSCRIPT_SITE_URL: "https://person:password@example.net" },
  { OFFSCRIPT_SITE_URL: "https://example.net/subdirectory" },
  { OFFSCRIPT_SUPPORT_EMAIL: 'help@example.net"><script>bad()</script>' },
])(
  "invalid public website configuration fails explicitly: %j",
  (environment) => {
    const output = build(environment);
    try {
      expect(output.result.status).not.toBe(0);
      expect(output.result.stderr).toMatch(
        /OFFSCRIPT_(SITE_URL|SUPPORT_EMAIL)/,
      );
    } finally {
      output.cleanup();
    }
  },
);
