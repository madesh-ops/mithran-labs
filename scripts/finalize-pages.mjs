// Post-processes the static export in out/ for GitHub Pages (run by
// .github/workflows/deploy-pages.yml after `next build`).
//
// 1. Prefetch payloads: the export writes per-segment RSC data as nested
//    folders (services/__next.services/__PAGE__.txt), but the client requests
//    one dot-joined file (services/__next.services.__PAGE__.txt). A Node server
//    maps between them; a static host can't, so every link prefetch would 404.
//    Copy each nested payload to its flat name (originals are kept).
// 2. .nojekyll: stops Pages from running Jekyll, which hides "_" folders
//    such as /_next.
import fs from "node:fs";
import path from "node:path";

const out = path.resolve(import.meta.dirname, "..", "out");
if (!fs.existsSync(out)) {
  console.error("finalize-pages: out/ not found — run the static export first.");
  process.exit(1);
}

let copied = 0;
const visit = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const full = path.join(dir, entry.name);
    if (entry.name.startsWith("__next.")) flatten(dir, full, [entry.name]);
    else if (entry.name !== "_next") visit(full);
  }
};
// Walk a nested "__next.*" folder and copy each file to <pageDir>/<a.b.c.file>.
const flatten = (pageDir, dir, parts) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) flatten(pageDir, full, [...parts, entry.name]);
    else {
      fs.copyFileSync(full, path.join(pageDir, [...parts, entry.name].join(".")));
      copied++;
    }
  }
};

visit(out);
fs.writeFileSync(path.join(out, ".nojekyll"), "");
console.log(`finalize-pages: flattened ${copied} prefetch payload(s); wrote .nojekyll`);
