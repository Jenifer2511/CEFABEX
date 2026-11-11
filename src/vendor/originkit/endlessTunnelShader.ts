/**
 * Endless Tunnel Square — Originkit.
 * Shader and tuned defaults extracted verbatim from the source supplied by the user.
 * Reference: https://www.originkit.dev/components/endless-tunnel-square
 * The complete supplied component is retained next to this file for provenance.
 */
export const TUNNEL_DEFAULTS = {
    tilesPerRing: 24,
    ringStepMs: 1600,
    centerY: 54,
    tileSize: 76,
    jitter: 11,
    tilt: 9,
    lineWeight: 16,
    lineOpacity: 92,
    edgeColor: "#8AA6CC",
    edgeDim: 50,
    centerFalloff: 5,
    haloColor: "#6F93C8",
    haloPx: 2,
    haloOpacity: 15,
    ghostColor: "#34486A",
    ghostOffset: 35,
    ghostOpacity: 55,
    gridColor: "#22304A",
    gridOpacity: 30,
    fill: 85,
    subColor: "#8FA9CF",
    subGrid: 4,
    subOpacity: 50,
    fineDetail: 50,
    hazeColor: "#0A1020",
    hazeRadius: 30,
    glowRadius: 14,
    glowMid: "#9EC4F0",
    glowDeep: "#3D5F8C",
    pulse: 10,
    grain: 0,
    vignette: 10,
} as const

export const TUNNEL_VERTEX = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`

export const TUNNEL_FRAGMENT = `#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform vec3 uBg;
uniform vec3 uBase;
uniform vec3 uAccent;
uniform float uScale;
uniform float uN;
uniform float uZ;
uniform float uTurn;
uniform float uGlow;
uniform float uHoverK;
uniform float uCenterY;
uniform float uTileSize;
uniform float uJitter;
uniform float uTilt;
uniform float uLine;
uniform float uLineAlpha;
uniform vec3 uEdge;
uniform float uEdgeDim;
uniform float uFalloff;
uniform vec3 uHaloCol;
uniform float uHaloPx;
uniform float uHaloAlpha;
uniform vec3 uGhost;
uniform float uGhostOff;
uniform float uGhostAlpha;
uniform vec3 uGrid;
uniform float uGridAlpha;
uniform float uFill;
uniform vec3 uSub;
uniform float uSubGrid;
uniform float uSubAlpha;
uniform float uFine;
uniform vec3 uHaze;
uniform float uHazeR;
uniform float uCore;
uniform vec3 uGlowMid;
uniform vec3 uGlowDeep;
uniform float uGrain;
uniform float uVignette;
out vec4 outColor;

const float TAU = 6.28318530718;

vec4 h4(vec2 p) {
    vec4 p4 = fract(vec4(p.xyxy) * vec4(0.1031, 0.1030, 0.0973, 0.1099));
    p4 += dot(p4, p4.wzxy + 33.33);
    return fract((p4.xxyz + p4.yzzw) * p4.zywx);
}
mat2 rot(float a) { float c = cos(a), sn = sin(a); return mat2(c, sn, -sn, c); }
float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}
float stroke(float d, float w, float aa) {
    return 1.0 - smoothstep(max(w - 0.5 * aa, 0.0), w + 0.5 * aa, abs(d));
}
float ringOff(float ring) {
    return h4(vec2(mod(ring, 16.0) * 1.7 + 5.3, 91.0)).x;
}
// One hashed square per grid cell (kept inside its cell), outline only.
float subSquares(vec2 tq, float G, vec2 seed, float density, float hmin, float hmax, float tilt, float w, float aaG) {
    vec2 g = tq * G;
    vec2 gi = floor(g);
    vec2 gf = fract(g) - 0.5;
    vec4 h = h4(gi + seed);
    if (h.x > density) return 0.0;
    float hsz = mix(hmin, hmax, h.y);
    float room = max(0.5 - hsz * 1.15 - w - aaG, 0.0);
    vec2 o = (vec2(h.w, fract(h.w * 7.31 + h.y * 3.17)) - 0.5) * 2.0 * room;
    float d = sdBox(rot((h.z - 0.5) * 2.0 * tilt) * (gf - o), vec2(hsz));
    return stroke(d, w, aaG) * (0.7 + 0.3 * fract(h.y * 13.7));
}

void main() {
    vec2 frag = gl_FragCoord.xy;
    float H = max(uRes.y, 1.0);
    float pull = clamp(uHover, 0.0, 1.0) * uHoverK;

    // Vanishing point, eased toward the pointer (up to ~6% of the frame).
    vec2 c0 = vec2(0.5 * uRes.x, uCenterY * H);
    vec2 c = c0 + (uMouse * uRes - c0) * 0.12 * pull;
    vec2 p = frag - c;
    float r = max(length(p), 1e-4);
    float rh = r / H;
    float th = atan(p.y, p.x);
    float N = max(uN, 3.0);

    float u = (log(rh) - uZ) * N / TAU;
    float vb = th * N / TAU + uTurn * N;
    float ring0 = floor(u);
    float s = max(TAU * r / N, 1e-3);               // device px per cell
    float aa = 1.0 / s;
    float tileVis = smoothstep(2.5, 7.0, s);

    vec2 dm = (frag - uMouse * uRes) / H;
    float pl = exp(-dot(dm, dm) / 0.04) * pull;

    float hot = exp(-rh * uFalloff);
    vec3 hotLine = mix(uBase, uAccent, 0.6);
    vec3 lineCol = mix(uBase, hotLine, hot);
    lineCol = mix(lineCol, uEdge, smoothstep(0.2, 0.75, rh) * uEdgeDim);
    lineCol *= 1.0 + 0.5 * pl;
    vec3 subCol = mix(uSub, mix(uSub, uAccent, 0.65), hot) * (1.0 + 0.5 * pl);

    // Ground: near-black with a faint cold haze around the middle.
    vec3 col = mix(uBg, uHaze, exp(-pow(rh / max(uHazeR, 1e-3), 2.0)));

    // Faint polar grid on this pixel's own cell boundaries.
    vec2 local = vec2(fract(vb + ringOff(ring0)), fract(u));
    vec2 ge = min(local, 1.0 - local);
    float gridL = 1.0 - smoothstep(0.25 * aa, aa, min(ge.x, ge.y));
    col = mix(col, uGrid, gridL * uGridAlpha * tileVis);

    // Tiles from the 3×3 neighbouring cells, so a jittered tile can overlap its neighbours.
    float lw = 0.5 * max(s * uLine, 1.2) * aa;
    float edge = 0.0;
    float ghost = 0.0;
    float haloD = 1e3;
    float best = -1.0;
    float bIn = 0.0;
    float bhs = 0.5;
    vec2 bq = vec2(0.0);
    vec2 bid = vec2(0.0);
    for (int dr = -1; dr <= 1; dr++) {
        float ring = ring0 + float(dr);
        float rid = mod(ring, 16.0);
        float v = vb + ringOff(ring);
        float uy = u - ring - 0.5;
        float t0 = floor(v);
        for (int dt = -1; dt <= 1; dt++) {
            float tile = t0 + float(dt);
            float tid = mod(tile, N);
            vec4 hA = h4(vec2(rid + 3.7, tid + 11.3));
            vec4 hB = h4(vec2(tid * 1.37 + 57.0, rid * 2.11 + 19.0));
            float hs = 0.5 * uTileSize * mix(0.8, 1.12, hA.x);
            vec2 off = (hA.yz - 0.5) * 2.0 * uJitter;
            mat2 R = rot((hA.w - 0.5) * 2.0 * uTilt);
            vec2 cl = vec2(v - tile - 0.5, uy) - off;
            vec2 q = R * cl;
            float d = sdBox(q, vec2(hs));
            edge = max(edge, stroke(d, lw, aa));
            haloD = min(haloD, max(abs(d) - lw, 0.0));
            if (hB.x < 0.7) {
                float dg = sdBox(R * (cl - vec2(0.0, uGhostOff)), vec2(hs * 1.02));
                ghost = max(ghost, stroke(dg, 0.5 * aa, aa));
            }
            float ins = 1.0 - smoothstep(-aa, aa, d);
            if (ins > 0.0 && hB.y > best) {
                best = hB.y;
                bIn = ins;
                bhs = hs;
                bq = q;
                bid = vec2(tid, rid);
            }
        }
    }

    // Duplicate outlines pushed outward (layered look), then tile bodies cover what is behind them.
    col = mix(col, uGhost, ghost * uGhostAlpha * tileVis);
    col = mix(col, uBg, bIn * uFill * tileVis);

    // Nested sub-squares in the tile that owns this pixel.
    if (bIn > 0.0 && s > 3.0) {
        vec2 tq = (bq / (2.0 * bhs) + 0.5 - 0.05) / 0.9;
        float G = max(uSubGrid, 1.0);
        float span = 2.0 * bhs * 0.9;
        float subPx = s * span / G;
        float f1 = smoothstep(3.0, 8.0, subPx);
        float wPx = 0.5 * max(1.0, s * 0.0045);
        vec2 seed = vec2(bid.x * 7.0 + 1.3, bid.y * 13.0 + 5.1);

        float a1 = aa * G / span;
        float l1 = subSquares(tq, G, seed, 0.8, 0.28, 0.42, 0.14, wPx * a1, a1);

        float G2 = max(G - 1.0, 1.0);
        float a2 = aa * G2 / span;
        float l2 = subSquares(tq + 0.5 / G2, G2, seed + vec2(41.0, 17.0), 0.5, 0.24, 0.38, 0.14, wPx * a2, a2);

        float G3 = G * 3.0;
        float a3 = aa * G3 / span;
        float f3 = smoothstep(3.0, 8.0, subPx / 3.0) * uFine;
        float l3 = subSquares(tq, G3, seed + vec2(83.0, 29.0), 0.2, 0.28, 0.42, 0.2, 0.5 * a3, a3);

        float sa = max(max(l1, l2 * 0.85), l3 * 0.55 * f3) * f1 + (1.0 - f1) * 0.22;
        col = mix(col, subCol, clamp(sa * uSubAlpha * bIn * tileVis, 0.0, 1.0));
    }

    // Crisp outlines with a slight halo.
    float halo = exp(-haloD * s / max(uHaloPx, 0.1));
    col += uHaloCol * halo * uHaloAlpha * tileVis * (1.0 - edge) * 0.6;
    col = mix(col, lineCol, edge * uLineAlpha * tileVis);

    // Cells too small to draw become a bright mesh haze.
    col += hotLine * 0.35 * (1.0 - tileVis);

    // Vanishing-point glow (additive, pulsed).
    float gc = max(uCore, 1e-4);
    vec3 g = uAccent * exp(-pow(rh / gc, 2.0))
           + uGlowMid * 0.7 * exp(-pow(rh / (gc * 2.7), 2.0))
           + uGlowDeep * 0.45 * exp(-pow(rh / (gc * 7.5), 2.0));
    col += g * uGlow;
    col = min(col, vec3(0.97));

    // Vignette and grain overlays.
    vec2 uv = frag / uRes;
    vec2 vq = (uv - 0.5) * vec2(uRes.x / H, 1.0);
    col *= 1.0 - uVignette * smoothstep(0.3, 0.95, length(vq));
    col += (h4(frag + vec2(mod(floor(uTime * 24.0), 64.0) * 37.0, 0.0)).x - 0.5) * uGrain * 0.12;

    outColor = vec4(max(col, 0.0), 1.0);
}`
