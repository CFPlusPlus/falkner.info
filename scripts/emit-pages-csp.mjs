import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const HEADERS_PATH = path.join(DIST_DIR, "_headers");

const META_CSP_RE =
  /<meta\s+http-equiv="content-security-policy"\s+content="([^"]*)"\s*\/?>/i;

async function collectHtmlFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectHtmlFiles(fullPath);
      return entry.isFile() && entry.name.endsWith(".html") ? [fullPath] : [];
    }),
  );

  return files.flat();
}

function splitDirective(entry) {
  const trimmed = entry.trim();
  if (!trimmed) return null;

  const firstSpace = trimmed.indexOf(" ");
  if (firstSpace === -1) return { name: trimmed, values: [] };

  const name = trimmed.slice(0, firstSpace).trim();
  const values = trimmed
    .slice(firstSpace + 1)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  return { name, values };
}

function mergePolicies(policies) {
  const merged = new Map();

  for (const policy of policies) {
    for (const rawDirective of policy.split(";")) {
      const directive = splitDirective(rawDirective);
      if (!directive) continue;

      const existing = merged.get(directive.name);
      if (!existing) {
        merged.set(directive.name, [...directive.values]);
        continue;
      }

      for (const value of directive.values) {
        if (!existing.includes(value)) existing.push(value);
      }
    }
  }

  return [...merged.entries()]
    .map(([name, values]) =>
      values.length > 0 ? `${name} ${values.join(" ")}` : name,
    )
    .join("; ");
}

async function main() {
  const distStat = await stat(DIST_DIR).catch(() => null);
  if (!distStat?.isDirectory()) {
    throw new Error(
      "dist-Verzeichnis nicht gefunden. Bitte zuerst build ausfuehren.",
    );
  }

  const htmlFiles = await collectHtmlFiles(DIST_DIR);
  const policies = [];

  for (const file of htmlFiles) {
    const html = await readFile(file, "utf8");
    const match = html.match(META_CSP_RE);
    if (!match) continue;

    policies.push(match[1]);

    const withoutMeta = html.replace(META_CSP_RE, "");
    if (withoutMeta !== html) {
      await writeFile(file, withoutMeta, "utf8");
    }
  }

  if (policies.length === 0) {
    throw new Error(
      "Keine CSP-Meta-Tags in den gebauten HTML-Dateien gefunden.",
    );
  }

  const mergedPolicy = mergePolicies(policies);
  const headersBody = `/*\n  Content-Security-Policy: ${mergedPolicy}\n`;

  await writeFile(HEADERS_PATH, headersBody, "utf8");
}

await main();
