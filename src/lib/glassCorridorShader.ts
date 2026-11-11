/**
 * CEFABEX Liquid Corridor — an original visual variation built from the
 * user-supplied Originkit Endless Tunnel Square's log-polar zoom mapping.
 * The unmodified supplied shader/component remains in src/vendor/originkit.
 * Square tiles are replaced by continuous glass ribs, refracted studio bands,
 * helical light rails and water-like caustics. All phase comes from scroll.
 */
export const GLASS_CORRIDOR_FRAGMENT=`#version 300 es
precision highp float;
uniform vec2 uRes;
uniform float uZ;
uniform float uTurn;
uniform float uProgress;
uniform vec3 uBg;
uniform vec3 uBase;
uniform vec3 uAccent;
uniform vec3 uPearl;
out vec4 outColor;
const float TAU=6.28318530718;
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,s,-s,c);}
float hash(vec2 p){vec3 p3=fract(vec3(p.xyx)*.1031);p3+=dot(p3,p3.yzx+33.33);return fract((p3.x+p3.y)*p3.z);}
void main(){
 vec2 uv=gl_FragCoord.xy/uRes;
 float H=max(uRes.y,1.);
 float aspect=uRes.x/H;
 float mobile=1.-smoothstep(.7,1.,aspect);
 // A gently bending optical axis replaces the original stationary vanishing point.
 vec2 center=vec2(mix(.60,.53,mobile)+sin(uProgress*3.14159)*.025,.48+sin(uProgress*TAU)*.025);
 vec2 p=(gl_FragCoord.xy-center*uRes)/H;
 p=rot(uTurn*TAU*.35)*p;
 p.x*=.94;
 float r=max(length(p),.0001);
 float theta=atan(p.y,p.x);
 // Originkit's log-radius translation, reshaped into continuous curved glass.
 float logRadius=log(r)-uZ;
 float bend=.10*sin(theta*3.+uTurn*TAU)+.045*sin(theta*5.-logRadius*.32);
 float tunnel=(logRadius+bend)*2.1;
 float phase=fract(tunnel+.5)-.5;
 float detail=smoothstep(.035,.09,r);
 float body=1.-smoothstep(.12,.31,abs(phase));
 float innerLip=exp(-abs(phase+.21)*42.);
 float outerLip=exp(-abs(phase-.25)*55.);
 float shoulder=smoothstep(-.30,-.08,phase)*(1.-smoothstep(.03,.29,phase));
 // Smooth radial glass normals bend a procedural studio environment.
 float ridgeNormal=sin(phase*10.);
 vec3 N=normalize(vec3(cos(theta)*ridgeNormal,sin(theta)*ridgeNormal,.55+shoulder*.8));
 vec3 reflected=reflect(vec3(0.,0.,-1.),N);
 vec3 refracted=refract(vec3(0.,0.,-1.),N,1./1.333);
 float stripA=pow(max(dot(reflected,normalize(vec3(-.65,.85,.5))),0.),28.);
 float stripB=pow(max(dot(reflected,normalize(vec3(.8,-.4,.7))),0.),22.);
 float fresnel=pow(1.-abs(N.z),3.);
 float sky=smoothstep(-.7,.75,refracted.y+.18*sin(theta*2.+logRadius));
 vec3 glassSky=mix(vec3(.015,.060,.080),uBase*.34,sky);
 glassSky=mix(glassSky,uPearl*.22,pow(sky,6.));
 float haze=exp(-r*3.2);
 vec3 col=mix(uBg,vec3(.015,.045,.060),haze*.6);
 col+=glassSky*body*.55*detail;
 col+=uBase*(innerLip*.20+outerLip*.09)*detail;
 col+=mix(uBase,uPearl,sky)*(stripA*1.2+stripB*.45)*body*detail;
 col+=uAccent*fresnel*body*.075*detail;
 // Fine caustics remain inside the glass rather than covering the page.
 float caustic=pow(max(sin(theta*6.+tunnel*.55)*cos(theta*3.-tunnel*.35),0.),6.);
 col+=uBase*caustic*body*.10*detail;
 // Two paired light rails spiral through the corridor, with a pearl counterlight.
 float railPhase=theta*3.+logRadius*.82+uTurn*TAU;
 float rail=pow(max(cos(railPhase),0.),96.);
 float railGlow=pow(max(cos(railPhase),0.),18.);
 float counterRail=pow(max(cos(railPhase+1.55),0.),130.);
 col+=uBase*(rail*.40+railGlow*.045)*detail;
 col+=uPearl*counterRail*.18*detail;
 // An off-axis specular wash lends the foreground a water-lens sheen.
 float wash=pow(max(cos(theta+1.0),0.),8.)*pow(max(sin(tunnel*.7+.8),0.),4.);
 col+=mix(uBase,uPearl,.6)*wash*body*.11*detail;
 // Quiet distant light; no pulsing, strobing, clock or free-running particles.
 col+=uAccent*exp(-pow(r/.010,2.))*.55;
 col+=uBase*exp(-pow(r/.055,2.))*.12;
 // Sparse, scroll-locked glints along the far surface.
 vec2 cells=vec2(theta*24.,logRadius*20.);
 vec2 cell=floor(cells);
 float glint=smoothstep(.985,1.,hash(cell))*exp(-length(fract(cells)-.5)*60.);
 col+=uAccent*glint*.35*detail;
 vec2 vignette=(uv-.5)*vec2(aspect,1.);
 col*=1.-smoothstep(.28,1.15,length(vignette))*.45;
 outColor=vec4(clamp(col,0.,.97),1.);
}`
