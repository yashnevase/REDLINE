// Authored surface colours. No reference bitmap and no additional scene object.
export const ROUND3_FLOOR_ENABLED=true;
export const floorPaintColours={warm:['#b5b0a5','#aba69e','#b6ada0','#b8b1a7'],cool:['#9eaab9','#a4b1b9'],oxide:['#a7836d','#a08770']} as const;
const bandOrder=Array.from({length:576},(_,i)=>i);let paletteSeed=78431;for(let i=575;i>0;i--){paletteSeed=(Math.imul(paletteSeed,1664525)+1013904223)>>>0;const j=paletteSeed%(i+1);[bandOrder[i],bandOrder[j]]=[bandOrder[j],bandOrder[i]];}
export function floorPaintBand(x:number,z:number){const index=((x%24)+24)%24+(((z%24)+24)%24)*24,bucket=bandOrder[index]/576;return bucket<.6?'warm':bucket<.85?'cool':'oxide';}
export function paintWarmPlates(c:CanvasRenderingContext2D,size:number){
 if(!ROUND3_FLOOR_ENABLED)return;
 const unit=size/48;
 for(let z=0;z<24;z++)for(let x=0;x<24;x++){const colours=floorPaintColours[floorPaintBand(x,z)];c.fillStyle=colours[(x*3+z*7)%colours.length];c.fillRect(x*2*unit,z*2*unit,2*unit+.5,2*unit+.5);}
}

export const flatFloorLife={height:0,collidable:false,addedFixtures:0,scarCap:32,scarLifeTicks:1440} as const;
export function paintFloorLife(c:CanvasRenderingContext2D,size:number){
 if(!ROUND3_FLOOR_ENABLED)return;
 const u=size/48,xy=(v:number)=>(v+24)*u;
 c.save();c.lineCap='round';
 // Broken paint arcs and broad lane/stencil shapes; deliberately no text.
 c.strokeStyle='#dbbe8580';c.lineWidth=.085*u;c.setLineDash([1.1*u,.45*u]);
 for(const r of[6.2,11.3]){c.beginPath();c.arc(xy(0),xy(0),r*u,.13,Math.PI*1.91);c.stroke();}
 c.setLineDash([]);c.strokeStyle='#d2b78366';c.lineWidth=.12*u;
 for(const side of[-1,1]){c.beginPath();c.moveTo(xy(side*3),xy(-13));c.lineTo(xy(side*3),xy(-8.3));c.moveTo(xy(-13),xy(side*3));c.lineTo(xy(-8.3),xy(side*3));c.stroke();}
 for(const[x,z,a]of[[-8,1,0],[8,-1,Math.PI],[1,-8,Math.PI/2],[-1,8,-Math.PI/2]]){
  c.save();c.translate(xy(x),xy(z));c.rotate(a);c.fillStyle='#d4b98288';c.beginPath();c.moveTo(-u,-.35*u);c.lineTo(.15*u,-.35*u);c.lineTo(.15*u,-.7*u);c.lineTo(1.1*u,0);c.lineTo(.15*u,.7*u);c.lineTo(.15*u,.35*u);c.lineTo(-u,.35*u);c.closePath();c.fill();c.restore();
 }
 let seed=3919;const rand=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
 // Sparse oil/scorch islands with warm weld highlights, not a full-screen grime layer.
 for(let i=0;i<20;i++){const x=xy(rand()*29-14.5),y=xy(rand()*29-14.5),r=(.3+rand()*1.3)*u;c.save();c.translate(x,y);c.scale(1,.55);const g=c.createRadialGradient(0,0,r*.1,0,0,r);g.addColorStop(0,'#241d1b65');g.addColorStop(.6,'#38291e35');g.addColorStop(1,'#241d1b00');c.fillStyle=g;c.fillRect(-r,-r,r*2,r*2);c.restore();}
 for(let i=0;i<18;i++){const x=xy(rand()*25-12.5),y=xy(rand()*25-12.5);c.strokeStyle='#32292288';c.lineWidth=.025*u;c.beginPath();c.moveTo(x,y);c.lineTo(x+u*(.6+rand()*2),y+u*.05);c.stroke();c.strokeStyle='#e2bc7766';c.lineWidth=.012*u;c.stroke();}
 // Tiny flush metal offcuts are paint on the existing 3D plates, never collision props.
 for(let i=0;i<100;i++){const x=xy(rand()*30-15),y=xy(rand()*30-15);c.save();c.translate(x,y);c.rotate(rand()*6.28);c.fillStyle=i%3?'#d1b99488':'#382d25aa';c.fillRect(0,0,(.05+rand()*.15)*u,.035*u);c.restore();}
 for(const[x,z]of[[-5.5,-3],[5,4],[-3,7.5]]){const px=xy(x),py=xy(z),r=2.4*u,g=c.createRadialGradient(px,py,0,px,py,r);g.addColorStop(0,'#ffd18838');g.addColorStop(1,'#ffb45a00');c.fillStyle=g;c.fillRect(px-r,py-r,r*2,r*2);c.fillStyle='#292620';c.fillRect(px-.7*u,py-.28*u,1.4*u,.56*u);c.fillStyle='#eea55488';c.fillRect(px-.6*u,py-.12*u,1.2*u,.24*u);c.strokeStyle='#9e9078';c.lineWidth=.055*u;for(let j=0;j<8;j++){c.beginPath();c.moveTo(px+(-.6+j*.17)*u,py-.25*u);c.lineTo(px+(-.6+j*.17)*u,py+.25*u);c.stroke();}}
 c.restore();
}
