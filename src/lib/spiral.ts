// Arc-length parametrisation from the supplied Originkit Spiral Images.
const TWO_PI = Math.PI * 2
export function createSpiral(turns = 3.5) {
        const spiral = (n: number, R: number) => {
            const ang = n * turns * TWO_PI
            const rad = R * (1 - n)
            return { x: rad * Math.cos(ang), y: -rad * Math.sin(ang) }
        }

        // Arc-length reparameterization: equal arc steps → equal visual spacing
        // (a uniform parameter step would bunch cards near the center). Shape is
        // R-independent, so build the table once at R=1.
        const M = 2000
        const cum = new Float32Array(M + 1)
        let prev = spiral(0, 1)
        for (let k = 1; k <= M; k++) {
            const pt = spiral(k / M, 1)
            const dx = pt.x - prev.x
            const dy = pt.y - prev.y
            cum[k] = cum[k - 1] + Math.sqrt(dx * dx + dy * dy)
            prev = pt
        }
        const total = cum[M] || 1
        const K = 1024
        const nForArc = new Float32Array(K + 1)
        let j = 0
        for (let a = 0; a <= K; a++) {
            const target = (a / K) * total
            while (j < M && cum[j + 1] < target) j++
            const seg = cum[Math.min(j + 1, M)] - cum[j]
            const f2 = seg > 0 ? (target - cum[j]) / seg : 0
            nForArc[a] = (j + f2) / M
        }
        // arc fraction s in [0,1) → spiral parameter n (interpolated; rounding
        // here would quantize motion into visible steps / chop).
        const arcToN = (s: number) => {
            const x = Math.max(0, Math.min(K, s * K))
            const i = Math.floor(x)
            const a = nForArc[i]
            const b = nForArc[Math.min(i + 1, K)]
            return a + (b - a) * (x - i)
        }


 return {spiral,arcToN}
}
