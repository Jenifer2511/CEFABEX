// Cylinder curl shader adapted from the user-supplied Originkit Poster Page Curl.
// Poster artwork, Framer controls and lavender styling are intentionally omitted.
const TILT_FOCAL=2.4
const VERT = `#version 300 es
in vec2 aPx;
uniform vec2 uRes;
void main() {
    gl_Position = vec4(aPx.x / uRes.x * 2.0 - 1.0, 1.0 - aPx.y / uRes.y * 2.0, 0.0, 1.0);
}
`

// MODE 0: everything. MODE 1: flat paper only. MODE 2: the top-right curl only. At rest
// the poster is cut into those three regions, so the full shader runs only where the
// lower-left fan can show (software and weak GPUs run every branch they are handed).
const FRAG = `#version 300 es
precision highp float;
#define MODE __MODE__
uniform vec2 uRes;
uniform vec2 uCtr;
uniform float uSpx;
uniform vec2 uRot;
uniform vec2 uTilt;
uniform float uA;
uniform sampler2D uStack;
uniform sampler2D uFront;
uniform vec3 uBack;
uniform vec3 uBackDark;
uniform vec3 uBackEdge;
uniform vec4 uK1;
uniform vec3 uL1;
uniform vec4 uK2;
uniform vec4 uL2;
uniform vec4 uShade;
uniform vec4 uLook;
uniform vec3 uFx;
uniform float uFib;
out vec4 outColor;
const float PI = 3.14159265;
const float F = ${TILT_FOCAL.toFixed(3)};

float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
}

// how far c lies outside the sheet box (x0, y0, x1, y1), > 0 outside. Box (max) norm:
// only the sign and the soft shadow falloff use it.
float outside(vec2 c, vec4 B) {
    vec2 e = max(B.xy - c, c - B.zw);
    return max(e.x, e.y);
}
float outside(vec2 c) {
    return outside(c, vec4(0.0, 0.0, uA, 1.0));
}

// exp(-x) for the shadow falloffs, without a transcendental per call
float fall(float x) {
    return 1.0 / (1.0 + x * (1.0 + x * (0.5 + x * 0.1667)));
}

// Cylinder curl with a lifted flap on the sheet B, folding its corner C.
// K = (N, D, r), L = (sin, cos, angle) of the lift. kind: 0 none, 1 flat front,
// 2 rolled front, 3 back. The user's curl had the flap lying flat on the sheet
// (lift 0); past the roll the sheet now leaves at the lift angle, so its arc s maps
// to d = r sin(a) - (s - r(PI-a)) cos(a).
float curl(vec2 p, vec2 C, vec4 K, vec3 L, vec4 B, float sw, out vec2 q, out float ang, out float sl, out float sh) {
    vec2 N = K.xy;
    float r = max(K.w, 1e-4);
    float d = dot(p - C, N) + K.z;
    q = p; ang = 0.0; sl = 0.0; sh = 0.0;
    float rs = r * L.x;
    float wrap = r * (PI - L.z);
    // past the flap's far tip (and its shadow) the sheet is simply flat: most pixels stop
    // here. sMax is the arc to the sheet's farthest point, whichever corner that is.
    float sMax = K.z + max((B.x - C.x) * N.x, (B.z - C.x) * N.x) + max((B.y - C.y) * N.y, (B.w - C.y) * N.y);
    if (d < min(rs - (sMax - wrap) * L.y, 0.0) - 4.0 * sw) return outside(p, B) > 0.0 ? 0.0 : 1.0;
    vec2 base = p - N * d;
    // one arcsine serves both layers of the roll
    float as = asin(clamp(d / r, -1.0, 1.0));
    if (d <= r) {
        float s = d > rs ? r * (PI - as) : wrap + (rs - d) / L.y;
        vec2 c = base + N * s;
        float o = outside(c, B);
        if (o <= 0.0) { q = c; ang = min(s / r, PI - L.z); sl = s - wrap; return 3.0; }
        sh = fall(o / sw);
    }
    if (d >= 0.0 && d <= r) {
        float s = r * as;
        vec2 c = base + N * s;
        if (outside(c, B) <= 0.0) { q = c; ang = s / r; return 2.0; }
    }
    if (d < 0.0) return outside(p, B) > 0.0 ? 0.0 : 1.0;
    if (d > r) {
        vec2 c = base + N * (PI * r * 0.5);
        if (outside(c, B) <= 0.0) sh = max(sh, fall((d - r) / sw));
    }
    return 0.0;
}

float fibre(vec2 q) {
    return 1.0 + uLook.x * (hash(floor(q * uFib)) - 0.5) * 2.0;
}

vec3 backCol(float ang, float sl, float lift, vec2 q) {
    vec3 c;
    if (sl < 0.0) {
        // on the roll: a touch darker toward the silhouette, plus the optional rim light
        float t = clamp((ang - 0.5 * PI) / max(0.5 * PI - lift, 1e-3), 0.0, 1.0);
        c = uBack * (1.0 - 0.5 * uShade.z * (1.0 - t) * (1.0 - t));
        if (uShade.w > 0.0) c += uShade.w * exp(-pow((ang - 1.72) / 0.12, 2.0));
    } else {
        c = mix(uBack, uBackDark, smoothstep(0.0, uLook.y, sl));
    }
    return c * fibre(q);
}

// The lower-left dog-ears darken a little into their own folds; most of the poster's
// deep blue-grey is the shade each one casts on the flap behind it (see main).
// L.w is how far that darkening reaches.
vec3 fanCol(vec2 p, vec2 C, vec4 K, vec4 L, vec2 q, float ang, float sl) {
    float d = dot(p - C, K.xy) + K.z;
    float t = clamp((K.w - d) / (0.3 * L.w), 0.0, 1.0);
    vec3 c = backCol(ang, sl, L.z, q);
    return mix(c, uBackEdge * fibre(q), 0.5 * uLook.w * (1.0 - t));
}

float rollDim(float ang) {
    return 1.0 - uShade.z * pow(ang / (0.5 * PI), 2.0);
}

vec3 stackCol(vec2 p) {
    return texture(uStack, vec2(p.x / uA, p.y)).rgb;
}

void main() {
    vec2 fc = gl_FragCoord.xy;
    // frame -> poster: undo the offsets, then Angle, then Tilt (applied in that order forward)
    vec2 v = (vec2(fc.x, uRes.y - fc.y) - uCtr) / uSpx;
    v = vec2(v.x * uRot.x + v.y * uRot.y, -v.x * uRot.y + v.y * uRot.x);
    float den = uTilt.x * F + v.y * uTilt.y;
    if (den <= 1e-3) { outColor = vec4(0.0); return; }
    float pv = v.y * F / den;
    vec2 p = vec2(v.x * (F - pv * uTilt.y) / F + 0.5 * uA, pv + 0.5);

#if MODE == 1
    vec3 col = texture(uFront, vec2(p.x / uA, p.y)).rgb;
    float alpha = 1.0;
#else
    vec4 sheet = vec4(0.0, 0.0, uA, 1.0);
    vec2 q1; float a1; float l1; float s1;
    float k1 = curl(p, vec2(uA, 0.0), uK1, uL1, sheet, uShade.x, q1, a1, l1, s1);
    float out0 = outside(p);
    vec3 col;
    float alpha = 1.0;
    if (k1 > 2.5 && out0 > 0.0) {
        // the peeled sheet passing over the background
        col = backCol(a1, l1, uL1.z, q1);
    } else if (out0 > 0.0) {
        outColor = vec4(0.0, 0.0, 0.0, uShade.y * 0.6 * s1);
        return;
    } else {
        vec2 q2; float a2; float l2; float s2;
#if MODE == 0
        float k2 = curl(p, vec2(0.0, 1.0), uK2, uL2.xyz, sheet, uShade.x, q2, a2, l2, s2);
#else
        float k2 = 1.0; q2 = p; a2 = 0.0; l2 = 0.0; s2 = 0.0;
#endif
        float k; vec2 q; float a; float l;
        bool top = true;
        if (k1 == 1.0 && k2 == 1.0) { k = 1.0; q = p; a = 0.0; l = 0.0; }
        else if (k1 == 1.0) { k = k2; q = q2; a = a2; l = l2; top = false; }
        else if (k2 == 1.0 || k1 >= k2) { k = k1; q = q1; a = a1; l = l1; }
        else { k = k2; q = q2; a = a2; l = l2; top = false; }
        float shadow = max(s1, s2);

        if (k > 0.5 && k < 2.5) {
            col = texture(uFront, vec2(q.x / uA, q.y)).rgb;
            // on the white the flap edge reads as a hairline, not a soft shade
            if (k > 1.5) col *= rollDim(a);
            else col *= 1.0 - uShade.y * 0.35 * shadow * shadow * shadow;
        } else if (k > 2.5 && top) {
            col = backCol(a, l, uL1.z, q);
        } else {
            // the next sheet underneath, or the top sheet's own lower flap
            if (k > 2.5) col = fanCol(p, vec2(0.0, 1.0), uK2, uL2, q, a, l);
            else { outColor=vec4(0.0); return; }
        }
    }
#endif
    if (uFx.x + uFx.y > 0.0) {
        vec2 uv = fc / uRes;
        col *= 1.0 - uFx.y * smoothstep(0.35, 0.95, length(uv - 0.5) * 1.414);
        col += uFx.x * (hash(fc + fract(uFx.z * 13.7) * 91.0) - 0.5) * 0.35;
    }
    outColor = vec4(clamp(col, 0.0, 1.0) * alpha, alpha);
}
`


export function createPageCurl(canvas:HTMLCanvasElement,front:HTMLCanvasElement){
 const gl=canvas.getContext('webgl2',{alpha:true,premultipliedAlpha:true,antialias:true,preserveDrawingBuffer:true})
 if(!gl)return null
 const compile=(type:number,source:string)=>{const shader=gl.createShader(type)!;gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){console.error(gl.getShaderInfoLog(shader));gl.deleteShader(shader);throw Error('Page curl shader failed')}return shader}
 const vs=compile(gl.VERTEX_SHADER,VERT),fs=compile(gl.FRAGMENT_SHADER,FRAG.replace('__MODE__','0'))
 const program=gl.createProgram()!;gl.attachShader(program,vs);gl.attachShader(program,fs);gl.bindAttribLocation(program,0,'aPx');gl.linkProgram(program)
 if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Page curl link failed')
 gl.useProgram(program)
 const dpr=Math.min(devicePixelRatio,1.5);canvas.width=Math.round(innerWidth*dpr);canvas.height=Math.round(innerHeight*dpr)
 gl.viewport(0,0,canvas.width,canvas.height)
 const vao=gl.createVertexArray();gl.bindVertexArray(vao)
 const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer)
 const w=canvas.width,h=canvas.height
 gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([0,0,w,0,0,h,0,h,w,0,w,h]),gl.STATIC_DRAW)
 gl.enableVertexAttribArray(0);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0)
 const texture=gl.createTexture();gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,texture)
 gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE)
 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,front)
 const loc=(n:string)=>gl.getUniformLocation(program,n)
 gl.uniform1i(loc('uFront'),1);gl.uniform1i(loc('uStack'),1)
 gl.uniform2f(loc('uRes'),w,h);gl.uniform2f(loc('uCtr'),w/2,h/2);gl.uniform1f(loc('uSpx'),h);gl.uniform1f(loc('uA'),w/h)
 gl.uniform2f(loc('uRot'),1,0);gl.uniform2f(loc('uTilt'),1,0)
 gl.uniform3f(loc('uBack'),.94,.95,.94);gl.uniform3f(loc('uBackDark'),.65,.68,.66);gl.uniform3f(loc('uBackEdge'),.25,.28,.26)
 const lift=40*Math.PI/180
 gl.uniform3f(loc('uL1'),Math.sin(lift),Math.cos(lift),lift)
 gl.uniform4f(loc('uK2'),-.707,.707,-10,.01);gl.uniform4f(loc('uL2'),0,1,0,1)
 gl.uniform4f(loc('uShade'),.016,.32,.2,.04);gl.uniform4f(loc('uLook'),.008,.3,.05,.1);gl.uniform3f(loc('uFx'),0,0,0);gl.uniform1f(loc('uFib'),1200)
 return {render:(p:number)=>{canvas.dataset.curlProgress=String(p);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform4f(loc('uK1'),.707106,-.707106,p*(w/h+1.5),.085+p*.025);gl.drawArrays(gl.TRIANGLES,0,6)},dispose:()=>{gl.deleteTexture(texture);gl.deleteBuffer(buffer);gl.deleteVertexArray(vao);gl.deleteProgram(program);gl.deleteShader(vs);gl.deleteShader(fs)}}
}
