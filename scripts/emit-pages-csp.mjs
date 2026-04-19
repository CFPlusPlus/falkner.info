import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const DIST_DIR = path.resolve("dist");
const HEADERS_PATH = path.join(DIST_DIR, "_headers");
const EXTRA_HEADER_POLICIES = ["style-src-attr 'unsafe-inline'"];

const META_CSP_RE =
  /<meta\s+http-equiv="content-security-policy"\s+content="([^"]*)"\s*\/?>/i;
const INLINE_SCRIPT_RE = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;

function isExecutableInlineScript(attributes) {
  const normalized = attributes.toLowerCase();
  if (/\ssrc\s*=/.test(normalized)) return false;

  const typeMatch = normalized.match(/\stype\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
  const type = (typeMatch?.[1] || typeMatch?.[2] || "").trim();

  if (!type) return true;

  return (
    type === "module" ||
    type === "text/javascript" ||
    type === "application/javascript"
  );
}

function collectInlineScriptPolicy(html) {
  const hashes = [];

  for (const match of html.matchAll(INLINE_SCRIPT_RE)) {
    const attributes = match[1] ?? "";
    const content = match[2] ?? "";

    if (!isExecutableInlineScript(attributes)) continue;

    const hash = createHash("sha256").update(content).digest("base64");
    const value = `'sha256-${hash}'`;

    if (!hashes.includes(value)) hashes.push(value);
  }

  return hashes.length > 0 ? `script-src ${hashes.join(" ")}` : null;
}

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

    const inlineScriptPolicy = collectInlineScriptPolicy(html);
    if (inlineScriptPolicy) policies.push(inlineScriptPolicy);

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

  // Style-Attribute werden an mehreren legitimen Stellen im HTML verwendet
  // und muessen deshalb in der finalen HTTP-CSP explizit erlaubt werden.
  const mergedPolicy = mergePolicies([...policies, ...EXTRA_HEADER_POLICIES]);
  const headersBody = `/*\n  Content-Security-Policy: ${mergedPolicy}\n`;

  await writeFile(HEADERS_PATH, headersBody, "utf8");
}

await main();
