import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { test } from "node:test";
import { getFileInfo, resolveConfig } from "prettier";

test("CSP gilt global, erlaubt alle Inline-Hashes und bleibt im Cloudflare-Limit", async () => {
  const headers = await readFile("dist/_headers", "utf8");
  assert.ok(headers.startsWith("/*\n"));
  for (const line of headers.trimEnd().split("\n"))
    assert.ok(line.length <= 2000);
  const policy = headers.match(/Content-Security-Policy: (.+)/)?.[1];
  assert.ok(policy);
  const directives = new Map(
    policy.split(";").map((entry) => {
      const [name, ...values] = entry.trim().split(/\s+/);
      return [name, values];
    }),
  );
  assert.deepEqual(directives.get("default-src"), ["'self'"]);
  assert.deepEqual(directives.get("frame-ancestors"), ["'none'"]);
  assert.deepEqual(directives.get("object-src"), ["'none'"]);
  assert.ok(directives.get("connect-src").includes("https://api.mcsrvstat.us"));
  for (const unsafe of ["'unsafe-inline'", "'unsafe-eval'", "*"]) {
    assert.ok(!directives.get("script-src").includes(unsafe));
  }
  const files = (await readdir("dist", { recursive: true })).filter((name) =>
    name.endsWith(".html"),
  );
  assert.equal(files.length, 4);
  let checkedHashes = 0;
  for (const file of files) {
    const html = await readFile(`dist/${file}`, "utf8");
    assert.doesNotMatch(
      html,
      /<meta[^>]+http-equiv=["']content-security-policy/i,
    );
    for (const [, tag, attrs, content] of html.matchAll(
      /<(script|style)\b([^>]*)>([\s\S]*?)<\/\1>/gi,
    )) {
      if (
        tag === "script" &&
        (/\bsrc\s*=/.test(attrs) || /type="application\/ld\+json"/.test(attrs))
      )
        continue;
      const values = directives.get(`${tag}-src`) || [];
      assert.ok(
        values.some((value) => {
          const hash = value.match(/^'(sha256|sha384|sha512)-(.+)'$/);
          return (
            hash &&
            createHash(hash[1]).update(content).digest("base64") === hash[2]
          );
        }),
        `${file}: ${tag}-Hash fehlt`,
      );
      checkedHashes++;
    }
  }
  assert.ok(checkedHashes > 0);
});

test("Astro-Dateien werden ausdrücklich formatiert und verwenden LF", async () => {
  const file = "src/pages/index.astro";
  const config = await resolveConfig(file);
  assert.ok(config.plugins.includes("prettier-plugin-astro"));
  assert.equal(config.endOfLine, "lf");
  assert.equal(
    (await getFileInfo(file, { plugins: config.plugins })).inferredParser,
    "astro",
  );
});
