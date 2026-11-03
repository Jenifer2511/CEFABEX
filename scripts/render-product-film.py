from PIL import Image,ImageDraw,ImageFilter
import numpy as np, math, subprocess, pathlib, sys
W,H=3840,2160
root=pathlib.Path(sys.argv[1])
out=root/'public/films'
assets=pathlib.Path(sys.argv[2])
out.mkdir(parents=True,exist_ok=True)
items=[('web-experience',-7,0,-1,.16),('product-system',0,.15,0,.07),('mobile-experience',7,-.1,.5,-.08),('data-platform',14,.15,-.5,-.16)]
textures={name:Image.open(assets/(name+'.png')).convert('RGBA') for name,*_ in items}
y,x=np.mgrid[0:H,0:W]
light=np.exp(-(((x-W*.55)/(W*.65))**2+((y-H*.45)/(H*.8))**2))
r=np.asarray(10+light*12,dtype=np.uint8);g=np.asarray(23+light*17,dtype=np.uint8);b=np.asarray(21+light*14,dtype=np.uint8)
base=Image.fromarray(np.dstack([r,g,b])).convert('RGBA')
del x,y,r,g,b,light

def coeffs(dst,src):
 A=[];B=[]
 for (x,y),(u,v) in zip(dst,src):
  A.extend([[x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]]);B.extend([u,v])
 return np.linalg.solve(np.asarray(A),np.asarray(B))

def render(p):
 frame=base.copy(); d=ImageDraw.Draw(frame)
 camx=-2+12*(p*p*(3-2*p));camy=.45-.2*math.sin(p*math.pi);camz=12.4-1.1*math.sin(p*math.pi)
 focal=2700
 def project(x,y,z):return (W/2+(x-camx)*focal/(camz-z),H/2-(y-camy)*focal/(camz-z))
 # A restrained physical stage carries the independent, flat product surfaces.
 for gx in range(-30,36,3):
  a=project(gx,-3,-6);c=project(gx,-3,5)
  d.line([a,c],fill=(39,62,53),width=1)
 for gz in range(-8,7,2):d.line([project(-30,-3,gz),project(36,-3,gz)],fill=(39,62,53),width=1)
 for name,cx,cy,cz,angle in sorted(items,key=lambda v:v[3]):
  angle+=math.sin(p*math.pi)*.035
  co,si=math.cos(angle),math.sin(angle)
  quad=[]
  for lx,ly in [(-3.7,2.3125),(3.7,2.3125),(3.7,-2.3125),(-3.7,-2.3125)]:
   quad.append(project(cx+lx*co,cy+ly,cz-lx*si))
  left=max(0,math.floor(min(a[0] for a in quad)));top=max(0,math.floor(min(a[1] for a in quad)))
  right=min(W,math.ceil(max(a[0] for a in quad)));bottom=min(H,math.ceil(max(a[1] for a in quad)))
  if right<=left or bottom<=top:continue
  # Physical edge and discrete shadow; no displacement or image curvature.
  d.polygon([(a+20,b+28) for a,b in quad],fill=(4,13,11))
  d.line(quad+[quad[0]],fill=(159,181,167),width=3)
  local=[(a-left,b-top) for a,b in quad]
  tex=textures[name];src=[(0,0),(tex.width,0),(tex.width,tex.height),(0,tex.height)]
  tile=tex.transform((right-left,bottom-top),Image.Transform.PERSPECTIVE,coeffs(local,src),Image.Resampling.BICUBIC)
  frame.alpha_composite(tile,(left,top))
 return frame.convert('RGB')
poster=render(.48);poster.save(out/'cefabex-software-poster.webp',quality=92)
for p,name in [(0,'film-web'),(.3,'film-product'),(.65,'film-mobile'),(1,'film-data')]:render(p).save((root/'public/editorial')/(name+'.webp'),quality=92)
print('Poster and four 4K editorial film stills ready',flush=True)
cmd=['ffmpeg','-hide_banner','-loglevel','error','-y','-f','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r','24','-i','-','-an','-c:v','libx264','-preset','fast','-crf','24','-pix_fmt','yuv420p','-g','12','-keyint_min','12','-sc_threshold','0','-movflags','+faststart',str(out/'cefabex-software-4k.mp4')]
p=subprocess.Popen(cmd,stdin=subprocess.PIPE)
for i in range(144):
 p.stdin.write(render(i/143).tobytes())
 if i%24==0:print('Frame',i,'/144',flush=True)
p.stdin.close();assert p.wait()==0
print('Native 4K film complete',flush=True)
