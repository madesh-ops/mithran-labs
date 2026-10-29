// Renders public/og-default.png (1200×630 social preview) from inline SVG.
// Usage: node scripts/og-image.mjs
import { fileURLToPath } from "node:url";
import sharp from "sharp";
const out = fileURLToPath(new URL("../public/og-default.png", import.meta.url));
const mark = (x, y, s, ink, acc) => `<g transform="translate(${x} ${y}) scale(${s})" fill="${ink}"><rect x="2" y="4" width="7" height="24" rx="1.6"/><rect x="12.5" y="4" width="7" height="15" rx="1.6"/><rect x="23" y="4" width="7" height="24" rx="1.6"/><rect x="12.5" y="22" width="7" height="6" rx="1.6" fill="${acc}"/></g>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f5f4f0"/>
${mark(80, 72, 2.4, "#141413", "#ff5b24")}
<text x="170" y="124" font-family="Segoe UI, Arial, sans-serif" font-size="40" font-weight="600" fill="#141413" letter-spacing="-1">Mithran <tspan fill="#141413" fill-opacity="0.5">Labs</tspan></text>
<text x="80" y="330" font-family="Segoe UI, Arial, sans-serif" font-size="84" font-weight="600" fill="#141413" letter-spacing="-3">Websites, designed and built</text>
<text x="80" y="428" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="88" fill="#b8400f" letter-spacing="-1">to do their job.</text>
<line x1="80" y1="520" x2="1120" y2="520" stroke="#141413" stroke-opacity="0.15" stroke-width="2"/>
<text x="80" y="566" font-family="Consolas, 'Courier New', monospace" font-size="22" fill="#66645f" letter-spacing="3">WEBSITE DESIGN &amp; DEVELOPMENT STUDIO</text>
<rect x="1040" y="552" width="80" height="4" rx="2" fill="#ff5b24"/>
</svg>`;
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
console.log("wrote public/og-default.png");
