import {P1_ENABLED} from './p1-core-polish.ts';
import * as T from 'three';
import {CL4_ENABLED} from '../content/items/cl-clarity.ts';
import { palettes, random } from '../content/scene.mjs';

// Original painted blue-violet chrome matcap, approved in Sprint 2.
export function makeCoreMatcap(sheen: number) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = 512;
  const ctx = canvas.getContext('2d')!; const pixels = ctx.createImageData(512, 512);
  for (let y = 0; y < 512; y++) for (let x = 0; x < 512; x++) {
    const nx = (x - 255.5) / 256, ny = -(y - 255.5) / 256;
    const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
    const diffuse = Math.max(0, -nx * .42 + ny * .64 + nz * .55);
    const soft = Math.exp(-(((nx + .34) / .6) ** 2 + ((ny - .45) / .55) ** 2));
    const spec=Math.exp(-(((nx+.32)/.2)**2+((ny-.5)/.17)**2))*135*sheen;
    const rim = (1 - nz) ** 3;
    const shade = 83 + diffuse * 101 + soft * 65 * Math.min(1, sheen) + rim * 10;
    const i = (y * 512 + x) * 4;
    pixels.data[i] = Math.min(255, shade*.66+soft*55*sheen+spec); pixels.data[i + 1] = Math.min(255, shade*.7+soft*60*sheen+spec);
    pixels.data[i + 2] = Math.min(255, shade*1.22+soft*30*sheen+spec); pixels.data[i + 3] = 255;
  }
  ctx.putImageData(pixels, 0, 0); const map = new T.CanvasTexture(canvas); map.colorSpace = T.SRGBColorSpace; return map;
}
export function makeMaterials(sheen = .18) {
  const chrome = new T.MeshMatcapMaterial({ matcap: makeCoreMatcap(sheen) });
  const rustPaint=makeRustPaint();const rust = new T.MeshLambertMaterial({ color: '#865747', map:rustPaint, flatShading: true });
  const steel = new T.MeshLambertMaterial({ color: palettes.steel, flatShading: true });
  const stone = new T.MeshLambertMaterial({ color: palettes.stone, flatShading: true });
  const glow = new T.MeshBasicMaterial({ color: palettes.glow, toneMapped: false });
  const variant = <M extends T.Material & { color: T.Color }>(preset: M, color: string) => { const m = preset.clone(); m.color.set(color); return m; };
  return { chrome, rust, rustPaint, rustActor:new T.MeshMatcapMaterial({matcap:makeRustMatcap(),map:rustPaint,flatShading:false,toneMapped:false}), steel, stone, glow,
    orange: variant(glow, '#f95116'), hot: variant(glow, '#ffb342'),
    red: variant(glow, CL4_ENABLED?'#ff6859':'#ff3c53'), white: variant(glow, '#fff9f1'),
    dark: variant(steel, '#32343c'), lightSteel: variant(steel, '#a2a8aa'),
    violetRim: variant(glow, CL4_ENABLED?'#b1a1cf':'#8664a8'), rustLight: variant(rust, '#aa8064'), floor: variant(stone, '#ffffff')
  };
}
export type Materials = ReturnType<typeof makeMaterials>;

// Painted reference-study matcap; shared by live scenes and the reference studio.
export function makeMatchedMatcap(heat=0,rimStrength=1){
 const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d')!,pixels=ctx.createImageData(512,512);
 for(let y=0;y<512;y++)for(let x=0;x<512;x++){
  const nx=(x-255.5)/256,ny=-(y-255.5)/256,nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny));
  const horizon=ny+.21-.13*nx*nx;
  const rawRamp=Math.max(0,Math.min(1,horizon/(P1_ENABLED?.42:.24))),ramp=rawRamp*rawRamp*(3-2*rawRamp);
  const sheen=Math.exp(-(((nx-.12)/.67)**2+((ny-.12)/.40)**2))*30;
  const lowLight=Math.exp(-(((ny+.32)/.2)**2))*(1-Math.abs(nx)*.45);
  const u=-(nx+.43)*.515+(ny-.58)*.857,v=(nx+.43)*.857+(ny-.58)*.515;
  const warm=Math.exp(-(((u/(P1_ENABLED?.075:.115))**2+(v/(P1_ENABLED?.17:.24))**2)**4));
  const fleck=Math.exp(-(((nx+.09)/.052)**2+((ny-.73)/.024)**2));
  const pin=Math.exp(-(((nx+.72)/.024)**2+((ny-.34)/.029)**2));
  const bounce=Math.exp(-(((ny+.82)/.14)**2))*54;
  const magenta=Math.exp(-(((nx-.43)/.35)**2+((ny+.69)/.22)**2))*18;
  const edge=Math.max(0,(Math.abs(nx)-.65)/.35),right=Math.max(0,nx),blueReflect=Math.exp(-((ny/.25)**2))*12;
  const rim=Math.exp(-(((nz-.25)/.04)**2))*38*rimStrength;
  const window=Math.exp(-(((Math.abs(nx)-.87)/.024)**2))*Math.exp(-((ny/.65)**4))*23;
  const values=[Math.max(58,(57+ramp*(90+ny*40)-right*(P1_ENABLED?35:55)+sheen+lowLight*18)*(1-edge*.70))+warm*(P1_ENABLED?105:120)+fleck*100+pin*100+bounce+rim+window+magenta,
   Math.max(55,(50+ramp*(104+ny*23)-right*25+sheen+lowLight*35)*(1-edge*.70))+warm*103+fleck*100+pin*100+bounce*.88+rim*.7+window*1.1,
   Math.max(115,(117+ramp*(98+ny*16)+sheen+lowLight*30+blueReflect)*(1-edge*.65))+warm*15+fleck*90+pin*75+bounce*.95+rim+window*1.6+magenta*1.2];
  // Broad, asymmetric painted reflections give the shell a metal/glass read.
  const coolWindow=Math.exp(-(((nx-.13)/.53)**4+((ny-.25)/.36)**4));
  const darkWindow=Math.exp(-(((nx+.16)/.74)**2+((ny+.35)/.18)**2));
  values[0]+=coolWindow*8-darkWindow*6;values[1]+=coolWindow*12-darkWindow*8;values[2]+=coolWindow*19-darkWindow*10;
  if(P1_ENABLED&&heat){const orangeRim=Math.max(0,1-nz/.32)*(heat===2?.65:.22);values[0]+=orangeRim*90;values[1]+=orangeRim*25;values[2]-=orangeRim*12;}
  else if(heat){const brightness=(values[0]+values[1]+values[2])/3;if(heat===1){values[0]=150+brightness*.55;values[1]=60+brightness*.7;values[2]=35+brightness*.45;}else{values[0]=205+brightness*.25;values[1]=195+brightness*.28;values[2]=205+brightness*.25;}}
  const i=(y*512+x)*4;for(let k=0;k<3;k++)pixels.data[i+k]=Math.min(255,values[k]);pixels.data[i+3]=255;
 }ctx.putImageData(pixels,0,0);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;return texture;
}

export function makeBladeMaterials(){
 const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d')!,pixels=ctx.createImageData(256,256);
 for(let y=0;y<256;y++)for(let x=0;x<256;x++){
  const nx=(x-127.5)/128,ny=-(y-127.5)/128,nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny));
  const light=Math.max(0,-nx*.4+ny*.6+nz*.4),band=Math.exp(-(((ny-.35)/.16)**2))*65;
  const shade=62+light*115+band+(1-nz)**4*25,i=(y*256+x)*4;pixels.data[i]=shade;pixels.data[i+1]=shade+6;pixels.data[i+2]=shade+16;pixels.data[i+3]=255;
 }ctx.putImageData(pixels,0,0);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;
 const metal=new T.MeshMatcapMaterial({matcap:texture,toneMapped:false});const edge=metal.clone();edge.color.set('#dce5ff');
 const dark=metal.clone();dark.color.set('#787c9e');
 const link=new T.MeshBasicMaterial({color:'#8950ff',transparent:true,opacity:.14,depthWrite:false,toneMapped:false,blending:T.AdditiveBlending});
 const beamCanvas=document.createElement('canvas');beamCanvas.width=128;beamCanvas.height=32;const beamContext=beamCanvas.getContext('2d')!,beamPixels=beamContext.createImageData(128,32);for(let y=0;y<32;y++)for(let x=0;x<128;x++){const u=x/127,v=(y-15.5)/16,alpha=Math.sin(u*Math.PI)**.6*Math.exp(-((v/.23)**2))*.8,i=(y*128+x)*4;beamPixels.data[i]=beamPixels.data[i+1]=beamPixels.data[i+2]=255;beamPixels.data[i+3]=alpha*255;}beamContext.putImageData(beamPixels,0,0);link.map=new T.CanvasTexture(beamCanvas);link.map.colorSpace=T.SRGBColorSpace;
 const faceCanvas=document.createElement('canvas');faceCanvas.width=faceCanvas.height=256;const faceContext=faceCanvas.getContext('2d')!,facePixels=faceContext.createImageData(256,256);
 for(let y=0;y<256;y++)for(let x=0;x<256;x++){const nx=(x-127.5)/128,ny=(y-127.5)/128,r=Math.hypot(nx,ny),a=Math.atan2(ny,nx);const shade=130+Math.cos(a*2-.7)*(42-r*10)+Math.exp(-(((r-.9)/.025)**2))*44+Math.sin(r*700+a*5)*2;const i=(y*256+x)*4;facePixels.data[i]=shade;facePixels.data[i+1]=shade+8;facePixels.data[i+2]=shade+17;facePixels.data[i+3]=255;}faceContext.putImageData(facePixels,0,0);const faceMap=new T.CanvasTexture(faceCanvas);faceMap.colorSpace=T.SRGBColorSpace;const face=new T.MeshBasicMaterial({map:faceMap,toneMapped:false});
 return{metal,edge,dark,link,face};
}

export type BladeMaterials=ReturnType<typeof makeBladeMaterials>;

// Painted matte rust for actors: warm metal, muted scrapes, violet bounce, no PBR map.
function makeRustMatcap(){const c=document.createElement('canvas');c.width=c.height=256;const ctx=c.getContext('2d')!,p=ctx.createImageData(256,256);let noise=4107;for(let y=0;y<256;y++)for(let x=0;x<256;x++){const nx=(x-127.5)/128,ny=-(y-127.5)/128,nz=Math.sqrt(Math.max(0,1-nx*nx-ny*ny)),l=Math.max(0,-nx*.35+ny*.65+nz*.35),spec=Math.exp(-(((nx+.4)/.20)**2+((ny-.58)/.14)**2))*65,rim=(1-nz)**3*Math.max(0,nx)*65;noise=(Math.imul(noise,1664525)+1013904223)>>>0;const grain=(noise/4294967296-.5)*9;const i=(y*256+x)*4;p.data[i]=69+l*116+spec+grain+rim*.8;p.data[i+1]=48+l*100+spec+grain+rim*.4;p.data[i+2]=43+l*88+spec*.7+grain+rim*1.8;p.data[i+3]=255;}ctx.putImageData(p,0,0);const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;return texture;}

// Hand-painted style UV wear, authored with seeded brush marks; not a PBR/noise normal map.
function makeRustPaint(){const c=document.createElement('canvas');c.width=512;c.height=256;const ctx=c.getContext('2d')!,rng=random(8164);ctx.fillStyle='#fff8ef';ctx.fillRect(0,0,512,256);
 for(let i=0;i<130;i++){const x=rng()*512,y=rng()*256,r=3+rng()*26,g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,i%4===0?'#74413075':'#71696345');g.addColorStop(.65,'#8c685522');g.addColorStop(1,'#8c685500');ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,r,r*(.4+rng()*.6),rng()*Math.PI,0,Math.PI*2);ctx.fill();}
 for(let i=0;i<650;i++){const x=rng()*512,y=rng()*256,r=.3+rng()*1.5;ctx.fillStyle=i%3===0?'#58332977':'#c1957040';ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();}
 for(let i=0;i<45;i++){const x=rng()*512,y=rng()*256;ctx.strokeStyle=i%3===0?'#fff7dcb0':'#66595885';ctx.lineWidth=.4+rng();ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+2+rng()*13,y+1+rng()*3);ctx.stroke();}
 const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;return texture;}
