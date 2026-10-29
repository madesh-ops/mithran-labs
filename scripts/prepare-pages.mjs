// Prepares a checkout for the static GitHub Pages export (run by
// .github/workflows/deploy-pages.yml before `next build`).
//
// GitHub Pages serves static files only, so the Pages build:
//  - drops server-only routes (src/app/api: the contact form's email endpoint);
//  - turns Cache Components off (see next.config.ts), so Cache Components-only
//    route segment config (`export const instant = …`) is removed too.
//
// It edits files in place, so it refuses to run outside CI unless forced:
//   node scripts/prepare-pages.mjs --force
import fs from "node:fs";
import path from "node:path";

if (!process.env.CI && !process.argv.includes("--force")) {
  console.error("prepare-pages: edits the checkout in place; run in CI or pass --force.");
  process.exit(1);
}

const root = path.resolve(import.meta.dirname, "..");
const app = path.join(root, "src", "app");

fs.rmSync(path.join(app, "api"), { recursive: true, force: true });
console.log("removed src/app/api");

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));

for (const file of walk(app).filter((f) => /\.(tsx?|jsx?)$/.test(f))) {
  const src = fs.readFileSync(file, "utf8");
  const out = src.replace(/^export const instant = [^;]+;\r?\n/gm, "");
  if (out !== src) {
    fs.writeFileSync(file, out);
    console.log("removed `instant` config from", path.relative(root, file));
  }
}
