// QA helper: screenshots pages at several viewports with system Chrome and
// reports console errors, failed requests and horizontal overflow.
// Usage: node scripts/qa.mjs <outDir> <baseUrl> <viewport:desktop|tablet|mobile|all> <path...>
import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright-core";
import sharp from "sharp";

const [outDir, base, vpArg, ...paths] = process.argv.slice(2);
const viewports = { desktop: { width: 1440, height: 900 }, tablet: { width: 820, height: 1180 }, mobile: { width: 390, height: 844 } };
const chosen = vpArg === "all" ? Object.keys(viewports) : vpArg.split(",");
const theme = process.env.THEME || "light";
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({ channel: "chrome" });
const report = [];
for (const vp of chosen) {
  const ctx = await browser.newContext({
    viewport: viewports[vp],
    deviceScaleFactor: 1,
    colorScheme: theme === "dark" ? "dark" : "light",
    reducedMotion: process.env.REDUCED ? "reduce" : "no-preference",
    isMobile: vp === "mobile",
    hasTouch: vp !== "desktop",
  });
  // Skip the intro on every page after the first.
  await ctx.addInitScript(() => sessionStorage.setItem("ml-intro", "1"));
  for (const p of paths) {
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && errors.push("console: " + m.text().slice(0, 200)));
    page.on("pageerror", (e) => errors.push("pageerror: " + e.message.slice(0, 200)));
    page.on("requestfailed", (r) => errors.push("failed: " + r.url().slice(0, 120)));
    page.on("response", (r) => r.status() >= 400 && errors.push(`${r.status()}: ${r.url().slice(0, 120)}`));
    await page.goto(base + p, { waitUntil: "networkidle" });
    // Scroll through to trigger reveals and lazy images.
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 500) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(60);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(1200);
    const overflow = await page.evaluate(() => {
      const w = document.documentElement.clientWidth;
      const offenders = [...document.querySelectorAll("body *")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.right > w + 1 && getComputedStyle(el).position !== "fixed" && r.width > 0;
        })
        .slice(0, 5)
        .map((el) => `${el.tagName}.${String(el.className).slice(0, 40)} right=${Math.round(el.getBoundingClientRect().right)}`);
      return { scrollW: document.documentElement.scrollWidth, w, offenders };
    });
    const name = `${vp}${p.replace(/[^a-z0-9]+/gi, "_")}`.replace(/_$/, "") || vp;
    const file = path.join(outDir, `${name}.png`);
    // Chrome can't capture beyond ~16k px; cap very long pages.
    const fullH = Math.min(await page.evaluate(() => document.documentElement.scrollHeight), Number(process.env.MAXH || 14000));
    const scale = vp === "desktop" ? 0.5 : vp === "tablet" ? 0.6 : 0.8;
    const sliceH = 1800;
    const outFiles = [];
    for (let top = 0, i = 1; top < fullH; top += sliceH, i++) {
      const height = Math.min(sliceH, fullH - top);
      const f = file.replace(".png", `_${i}.png`);
      try {
        const buf = await page.screenshot({ fullPage: true, clip: { x: 0, y: top, width: viewports[vp].width, height } });
        await sharp(buf).resize(Math.round(viewports[vp].width * scale)).png().toFile(f);
        outFiles.push(path.basename(f));
      } catch (e) {
        errors.push(`screenshot failed at ${top}: ${e.message.slice(0, 80)}`);
      }
    }
    report.push({ vp, path: p, errors, overflow: overflow.scrollW > overflow.w ? overflow : "none", shots: outFiles });
    await page.close();
  }
  await ctx.close();
}
await browser.close();
console.log(JSON.stringify(report, null, 1));
