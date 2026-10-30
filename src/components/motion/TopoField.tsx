"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Live background: a slowly drifting topographic map — fine contour lines in
 * the page's own ink colour, every fifth line a touch stronger (as on a real
 * map), and one contour picked out in the signal orange. Silver hairlines on
 * black in the dark theme, graphite on warm paper in the light one. Rendered
 * by one fragment shader on a fixed, full-viewport canvas behind the page
 * (z-index -1): a single full-screen pass per frame and nothing on the main
 * thread beyond a few uniforms.
 *
 * - Theme: under the liquid-wave switch the new palette is revealed by the
 *   wave itself; on the crossfade paths (reduced motion, no View Transitions)
 *   the palette blends over ~1.2s, so it transforms rather than swaps.
 * - Readability: lines stay faint, quieter behind the copy column and as you
 *   scroll into content; solid sections (cards, ink bands) sit on top of it.
 * - Reduced motion: a single still frame (redrawn only on theme/resize).
 * - Full frame rate on desktop, ~30fps on phones; pixel ratio capped at 1.25,
 *   or 1 on phones. Hidden tabs: paused (rAF stops).
 * - No WebGL (or a lost context): a static CSS rendition (.topo-fallback).
 */

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 uRes;        // canvas size in CSS px
uniform float uDpr;
uniform float uTime;
uniform float uTheme;     // 0 = dark, 1 = light
uniform float uIntensity; // 1 at the top of the page, lower in content
uniform vec3 uBgDark;
uniform vec3 uBgLight;
uniform vec3 uInkDark;
uniform vec3 uInkLight;
uniform vec3 uSignalDark;
uniform vec3 uSignalLight;

const float SCALE = 520.0;  // CSS px per noise unit: large, gentle landforms
const float LEVELS = 14.0;  // contour levels across the height range
const float SIGNAL = 7.0;   // the one level drawn in orange

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Height of the terrain at p. A slow drift moves the map; a slower domain
// warp reshapes it, so contours morph rather than only slide.
float height(vec2 p, float t) {
  p += vec2(t * 0.006, -t * 0.004);
  vec2 w = vec2(noise(p * 0.6 + t * 0.02), noise(p * 0.6 + vec2(5.2, 1.3) - t * 0.02)) - 0.5;
  p += 0.7 * w;
  return 0.55 * noise(p) + 0.3 * noise(p * 2.03 + 3.1) + 0.15 * noise(p * 4.01 + 7.7);
}

void main() {
  vec2 px = gl_FragCoord.xy / uDpr;          // CSS px, origin bottom-left
  float y = 1.0 - px.y / uRes.y;             // 0 top .. 1 bottom
  float xn = px.x / max(uRes.x, 1.0);        // 0 .. 1 across
  float t = uTime;

  // Height and its screen-space gradient (finite differences, one device px
  // apart: WebGL1 has no fwidth without an extension). Dividing the distance
  // to the nearest level by the gradient keeps every line ~1 CSS px wide.
  vec2 p = px / SCALE;
  float e = 1.0 / (uDpr * SCALE);
  float h = height(p, t);
  float hx = height(p + vec2(e, 0.0), t);
  float hy = height(p + vec2(0.0, e), t);
  float g = max(length(vec2(hx - h, hy - h)) * LEVELS * uDpr, 1e-4); // levels per CSS px

  float f = h * LEVELS;
  float level = floor(f + 0.5);
  float dist = abs(f - level) / g;           // CSS px to the nearest contour
  float isIndex = step(abs(mod(level, 5.0)), 0.5);
  float isSignal = step(abs(level - SIGNAL), 0.5);
  float width = mix(1.0, 1.4, max(isIndex, isSignal));
  float line = 1.0 - smoothstep(0.0, width, dist);

  // Reading veil: on wide screens copy sits on the left, so lines fade there
  // and run full strength on the right; on narrow screens text spans the
  // width, so the whole map calms instead, rising toward the bottom edge.
  float wide = step(1.0, uRes.x / max(uRes.y, 1.0));
  float narrowVeil = mix(0.5, 0.75, smoothstep(0.7, 0.98, y));
  float veil = mix(narrowVeil, mix(0.4, 1.0, smoothstep(0.24, 0.72, xn)), wide);
  float k = uIntensity * veil * line;

  vec3 bg = mix(uBgDark, uBgLight, uTheme);
  vec3 ink = mix(uInkDark, uInkLight, uTheme);
  vec3 signal = mix(uSignalDark, uSignalLight, uTheme);
  // Paper absorbs less than black shows, so light lines sit a little fainter.
  float inkA = mix(mix(0.11, 0.2, isIndex), mix(0.09, 0.16, isIndex), uTheme);
  float sigA = mix(0.6, 0.5, uTheme);

  vec3 col = mix(bg, ink, k * inkA * (1.0 - isSignal));
  col = mix(col, signal, k * sigA * isSignal);
  gl_FragColor = vec4(col, 1.0);
}
`;

// Mirrors of the CSS tokens in globals.css.
const rgb = (hex: number): [number, number, number] => [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255];
const PALETTE = {
  uBgDark: rgb(0x121211), // --bg (dark)
  uBgLight: rgb(0xf5f4f0), // --paper
  uInkDark: rgb(0xf2f1ed), // --ink (dark)
  uInkLight: rgb(0x141413), // --ink-0
  uSignalDark: rgb(0xff5b24), // --signal
  uSignalLight: rgb(0xb8400f), // --signal-ink
};

export function TopoField() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: "low-power" });
    if (!gl) {
      setFallback(true);
      return;
    }

    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFallback(true);
      return;
    }
    gl.useProgram(prog);
    // One full-screen triangle.
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes"), uDpr = u("uDpr"), uTime = u("uTime"), uTheme = u("uTheme"), uIntensity = u("uIntensity");
    for (const [name, value] of Object.entries(PALETTE)) gl.uniform3fv(u(name), value);

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const reduceMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    const targetTheme = () => (root.dataset.theme === "dark" ? 0 : 1);
    let theme = targetTheme();
    let dpr = 1;
    let w = 0, h = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1 : 1.25);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    // Full strength in the hero, calming to 45% within the first ~80% of a viewport,
    // so long reading sections stay quiet.
    const intensity = () => {
      const k = Math.min(1, window.scrollY / ((window.innerHeight || 1) * 0.8));
      const ease = k * k * (3 - 2 * k);
      return 1 - ease * 0.55;
    };

    const start = performance.now();
    const draw = (now: number) => {
      gl.uniform2f(uRes, w, h);
      gl.uniform1f(uDpr, dpr);
      gl.uniform1f(uTime, reduceMq.matches ? 12 : (now - start) / 1000);
      gl.uniform1f(uTheme, theme);
      gl.uniform1f(uIntensity, intensity());
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    let raf = 0;
    let last = performance.now();
    let skip = false;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      // Ease the palette toward the active theme (~1.2s to settle) — except
      // under the liquid-wave switch (html.theme-morph), where the wave is the
      // transition: the new snapshot must already show the new palette, or the
      // wave would reveal the old dark field behind light content.
      const target = targetTheme();
      if (root.classList.contains("theme-morph")) theme = target;
      else theme += (target - theme) * (1 - Math.exp(-dt / 0.3));
      if (Math.abs(target - theme) < 0.001) theme = target;
      // Full rate on desktop so the slow flow never steps; ~30fps on phones,
      // where the GPU and battery budget is tighter.
      if (coarse && (skip = !skip)) return;
      draw(now);
    };

    // Reduced motion: no loop — one still frame, redrawn when something changes.
    const still = () => {
      theme = targetTheme();
      draw(performance.now());
    };

    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMq.matches) still();
    });
    ro.observe(canvas);
    resize();

    const mo = new MutationObserver(() => reduceMq.matches && still());
    mo.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    const onScroll = () => reduceMq.matches && still();
    window.addEventListener("scroll", onScroll, { passive: true });

    const run = () => {
      cancelAnimationFrame(raf);
      if (reduceMq.matches) still();
      else {
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    };
    reduceMq.addEventListener("change", run);
    run();

    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      setFallback(true);
    };
    canvas.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("scroll", onScroll);
      reduceMq.removeEventListener("change", run);
      canvas.removeEventListener("webglcontextlost", onLost);
    };
  }, []);

  return fallback ? (
    <div className="topo-field topo-fallback" aria-hidden="true" />
  ) : (
    <canvas ref={ref} className="topo-field" aria-hidden="true" />
  );
}
