"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Live background: hundreds of hair-thin vertical light streaks gathered into
 * slow, flowing wave bands — red light out of black in the dark theme, ruby ink
 * on warm paper in the light one. Rendered by one fragment shader on a fixed,
 * full-viewport canvas behind the page (z-index -1), so it costs the GPU a
 * single full-screen pass per frame and nothing on the main thread beyond a
 * few uniforms.
 *
 * - Theme: under the liquid-wave switch the new palette is revealed by the
 *   wave itself; on the crossfade paths (reduced motion, no View Transitions)
 *   the palette blends over ~1.2s, so it transforms rather than swaps.
 * - Readability: full strength at the top of the page, calming as you scroll
 *   into content; solid sections (cards, ink bands) sit on top of it.
 * - Reduced motion: a single still frame (redrawn only on theme/resize).
 * - Full frame rate on desktop, ~30fps on phones; pixel ratio capped at 1.25,
 *   or 1 on phones. Hidden tabs: paused (rAF stops).
 * - No WebGL (or a lost context): a static CSS rendition (.streak-fallback).
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

float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
float noise(float x) {
  float i = floor(x), f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(hash(i), hash(i + 1.0), u);
}
float noise2(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float n = i.x + i.y * 57.0;
  return mix(mix(hash(n), hash(n + 1.0), u.x), mix(hash(n + 57.0), hash(n + 58.0), u.x), u.y);
}

// The three ribbons, sampled with one column's jitter (offset) and thickness.
// Shared terms flow sideways with time (xf), so ribbons stream across the
// page rather than bobbing in place. G is the un-jittered body, for glow.
float ribbons(float y, float xf, float t, float jit, float thick, out float G) {
  float I = 0.0;
  G = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float base = 0.17 + fi * 0.33;
    float wave = 0.16 * sin(xf * (1.1 + fi * 0.45) * 3.14159 + t * (0.063 + fi * 0.028) + fi * 2.1)
               + 0.08 * (noise(xf * 2.0 + t * 0.04 + fi * 10.0) - 0.5);
    float h = 0.055 + 0.05 * noise(xf * 2.2 - t * 0.035 + fi * 5.0);
    // Where a ribbon is present along x: long runs, with black gaps between.
    float presence = smoothstep(0.2, 0.62, noise(xf * 1.2 + t * 0.028 + fi * 3.7));
    // A wide range of per-column lengths gives torn, uneven ribbon edges.
    float dc = (y - (base + wave + (jit - 0.5) * 0.06)) / (h * (0.4 + 1.3 * thick));
    float dg = (y - (base + wave)) / (h * 1.3);
    I += exp(-dc * dc) * presence;
    G += exp(-dg * dg) * presence;
  }
  return I;
}

// One layer of streaks at a given pitch: each column sits off-centre in its
// cell by a hashed amount (irregular spacing), with a hair-thin core plus a
// faint, wider Gaussian falloff (soft-lit, not a hard bar). Returns the lit
// line profile and the column's brightness * slow flicker.
float layer(float x, float pitch, float seed, float t, out float r1, out float r2, out float bright) {
  float c = floor(x / pitch);
  r1 = hash(c * 1.37 + seed);
  r2 = hash(c * 7.11 + seed + 3.0);
  float r3 = hash(c * 3.73 + seed + 11.0);
  float center = (c + 0.5 + (hash(c * 5.17 + seed) - 0.5) * 0.7) * pitch;
  float d = x - center;
  float w = 0.32 + 0.5 * r3;                                   // core width, px
  float profile = exp(-(d * d) / (w * w)) + 0.22 * exp(-(d * d) / (w * w * 16.0));
  // Slow, low-amplitude flicker (±8%, ~0.3–0.8 Hz) — alive, never a shimmer.
  float flick = 1.0 + 0.16 * (noise(t * (0.35 + 0.45 * r1) + r2 * 40.0) - 0.5);
  bright = (0.25 + 0.75 * r3 * r3 + 0.35 * step(0.88, r2)) * flick; // a few columns run hot
  return profile;
}

void main() {
  vec2 px = gl_FragCoord.xy / uDpr;          // CSS px, origin bottom-left
  float y = 1.0 - px.y / uRes.y;             // 0 top .. 1 bottom
  float xn = px.x / max(uRes.x, 1.0);        // 0 .. 1 across
  float t = uTime;
  float xf = xn + t * 0.015;                 // slow sideways flow

  // Two overlaid streak layers at non-multiple pitches: no regular grid, so
  // no barcode look or moiré as the ribbons move.
  float a1, a2, aB, b1, b2, bB, G, Gb;
  float lineA = layer(px.x, 2.3, 0.0, t, a1, a2, aB);
  float lineB = layer(px.x + 1.1, 5.1, 71.0, t, b1, b2, bB);
  float IA = ribbons(y, xf, t, a1, a2, G);
  float IB = ribbons(y, xf, t, b1, b2, Gb);

  // Bright clusters breathe slowly (~10–14s) as they swell and fade.
  // (A 0.5 floor keeps the field alive at its quietest; the peak is unchanged.)
  float cluster = 0.5 + 1.15 * smoothstep(0.15, 0.95, noise2(vec2(xf * 3.5, t * 0.085)));
  float bodyA = IA * aB, bodyB = IB * bB;

  // Reading veil: on wide screens copy sits on the left, so the light fades
  // there and runs full strength on the right; on narrow screens text spans
  // the width, so the whole field calms instead.
  float wide = step(1.0, uRes.x / max(uRes.y, 1.0));
  // (The ramp starts past the hero copy column, ~42% of the width, so no
  // drifting ribbon can bring full light behind the headline or paragraph.)
  // On narrow screens copy fills the width, so the field stays calm (~28%)
  // and only rises (~55%) toward the bottom edge of the screen.
  // Light theme a further 25% calmer here: the orange italic accent on pink is
  // the weakest contrast pair on the site.
  float narrowVeil = mix(0.28, 0.55, smoothstep(0.7, 0.98, y)) * mix(1.0, 0.75, uTheme);
  float veil = mix(narrowVeil, mix(0.22, 1.0, smoothstep(0.24, 0.72, xn)), wide);
  float k = uIntensity * veil * cluster;
  // Fine lines carry most of the light; a faint haze between them reads as
  // the blurred streak body in the reference.
  float streak = clamp((bodyA * lineA * 1.25 + bodyB * lineB * 1.45 + (bodyA + bodyB) * 0.22) * k, 0.0, 2.0);
  float glow = clamp(G * k, 0.0, 1.6);

  // Dark: additive crimson -> scarlet -> saturated bright red out of black.
  // No white-hot cores: the reference stays red all the way up.
  vec3 scarlet = vec3(1.0, 0.1, 0.06);
  vec3 crimson = vec3(0.62, 0.02, 0.06);
  vec3 brightRed = vec3(1.0, 0.18, 0.12);
  float s1 = clamp(streak, 0.0, 1.0);
  vec3 dark = uBgDark * (1.0 - 0.35 * clamp(glow, 0.0, 1.0))  // light deepens the black around it
            + mix(crimson, scarlet, s1) * streak
            + crimson * glow * 0.3
            + brightRed * s1 * s1 * 0.25;

  // Light: soft ruby ink on warm paper, leaning on pale-pink halos; ink is
  // capped so dark body text keeps its contrast.
  vec3 ruby = vec3(0.70, 0.04, 0.13);
  vec3 pink = vec3(0.98, 0.78, 0.80);
  vec3 light = mix(uBgLight, pink, clamp(glow * 0.8, 0.0, 0.6));
  light = mix(light, ruby, clamp(streak * 0.6, 0.0, 0.55));

  gl_FragColor = vec4(mix(dark, light, uTheme), 1.0);
}
`;

const BG_DARK: [number, number, number] = [0x12 / 255, 0x12 / 255, 0x11 / 255]; // --bg (dark)
const BG_LIGHT: [number, number, number] = [0xf5 / 255, 0xf4 / 255, 0xf0 / 255]; // --paper

export function StreakField() {
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
    gl.uniform3fv(u("uBgDark"), BG_DARK);
    gl.uniform3fv(u("uBgLight"), BG_LIGHT);

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

    // Strong in the hero, calming to 30% within the first ~80% of a viewport,
    // so long reading sections stay quiet.
    const intensity = () => {
      const k = Math.min(1, window.scrollY / ((window.innerHeight || 1) * 0.8));
      const ease = k * k * (3 - 2 * k);
      return 1 - ease * 0.7;
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
    <div className="streak-field streak-fallback" aria-hidden="true" />
  ) : (
    <canvas ref={ref} className="streak-field" aria-hidden="true" />
  );
}
