import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { test } from "node:test";
import { parser } from "typescript-eslint";

test("TypeScript-ESLint akzeptiert allowDefaultProject mit minimatch 11", async () => {
  const dir = await mkdtemp(path.join(tmpdir(), "falkner-eslint-"));
  try {
    await mkdir(path.join(dir, "src"));
    await writeFile(path.join(dir, "src/main.ts"), "export {};\n");
    await writeFile(
      path.join(dir, "tsconfig.json"),
      JSON.stringify({ include: ["src/**/*.ts"] }),
    );
    const code = "const value: number = 1;";
    const filePath = path.join(dir, "config.ts");
    await writeFile(filePath, code);
    const result = parser.parseForESLint(code, {
      filePath,
      tsconfigRootDir: dir,
      projectService: { allowDefaultProject: ["*.ts"] },
    });
    assert.ok(result.services.program);
    assert.equal(result.ast.body[0].type, "VariableDeclaration");
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
