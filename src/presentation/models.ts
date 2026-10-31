import * as T from 'three';
import type {Materials,BladeMaterials} from './materials.ts';

function part(parent: T.Object3D, g: T.BufferGeometry, material: T.Material, x = 0, y = 0, z = 0) {
  const m = new T.Mesh(g, material); m.position.set(x, y, z); parent.add(m); return m;
}
// Project subdivided graphic patches onto the sphere: flush, flat-color eyes/crown.
export function shellPatch(parent: T.Object3D, points: number[][], material: T.Material, lift = .008, subdivisions=3, radial=false) {
  const s = new T.Shape(); points.forEach(([x,y], i) => i ? s.lineTo(x,y) : s.moveTo(x,y)); s.closePath();
  const shape = new T.ShapeGeometry(s); const g = shape.index ? shape.toNonIndexed() : shape;
  const attr = g.getAttribute('position'); const vertices: number[] = [];
  function triangle(a: T.Vector2, b: T.Vector2, c: T.Vector2, depth: number) {
    if (depth) { const ab = a.clone().add(b).multiplyScalar(.5), bc = b.clone().add(c).multiplyScalar(.5), ca = c.clone().add(a).multiplyScalar(.5); triangle(a,ab,ca,depth-1); triangle(ab,b,bc,depth-1); triangle(ca,bc,c,depth-1); triangle(ab,bc,ca,depth-1); }
    else for (const p of [a,b,c]){const z=Math.sqrt(Math.max(.001,1-p.x*p.x-p.y*p.y));if(radial)vertices.push(p.x*(1+lift),p.y*(1+lift),z*(1+lift));else vertices.push(p.x,p.y,z+lift);}
  }
  for (let i=0;i<attr.count;i+=3) triangle(new T.Vector2(attr.getX(i),attr.getY(i)),new T.Vector2(attr.getX(i+1),attr.getY(i+1)),new T.Vector2(attr.getX(i+2),attr.getY(i+2)),subdivisions);
  const curved = new T.BufferGeometry(); curved.setAttribute('position',new T.Float32BufferAttribute(vertices,3)); const normals:number[]=[];for(let i=0;i<vertices.length;i+=3){const length=Math.hypot(vertices[i],vertices[i+1],vertices[i+2]);normals.push(vertices[i]/length,vertices[i+1]/length,vertices[i+2]/length);}curved.setAttribute('normal',new T.Float32BufferAttribute(normals,3));const uv:number[]=[];for(let i=0;i<normals.length;i+=3)uv.push(.5+Math.atan2(normals[i],normals[i+2])/(Math.PI*2),.5+Math.asin(Math.max(-1,Math.min(1,normals[i+1])))/Math.PI);curved.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
  shape.dispose(); if(g !== shape) g.dispose(); return part(parent,curved,material);
}
export function makeCore(materials: Materials, matched=false, bladeMaterials?:BladeMaterials, highDetail=true) {
  const patch=(parent:T.Object3D,points:number[][],material:T.Material,lift=.008)=>shellPatch(parent,points,material,matched?Math.max(.02,lift):lift,matched?(highDetail?4:1):3);
  const root = new T.Group(), body = new T.Group(), eyes = new T.Group(); root.add(body); body.add(eyes);eyes.name='core-eyes';
  part(body, new T.SphereGeometry(1,highDetail?64:24,highDetail?40:16), materials.chrome);
  const expressions:T.Group[]=[];
  if(!matched){
  patch(eyes,[[-.61,.27],[-.17,.16],[-.18,-.15],[-.42,-.17],[-.55,-.04]],materials.white);
  patch(eyes,[[.17,.16],[.61,.27],[.55,-.04],[.42,-.17],[.18,-.15]],materials.white);
  }else{
    const circle=(x:number,y:number,r:number)=>Array.from({length:40},(_,i)=>[x+Math.cos(i*Math.PI/20)*r,y+Math.sin(i*Math.PI/20)*r]);
    const shapes=[
      [circle(-.35,.04,.205),circle(.35,.04,.205)],
      [[[-.61,.22],[-.18,.03],[-.26,-.15],[-.47,-.15]],[[.61,.22],[.18,.03],[.26,-.15],[.47,-.15]]],
      [[[-.62,-.02],[-.18,.16],[-.23,-.16],[-.5,-.2]],[[.62,-.02],[.18,.16],[.23,-.16],[.5,-.2]]],
      [circle(-.35,.02,.2).filter(p=>p[1]>=.02).concat([[-.15,.02],[-.55,.02]]),circle(.35,.02,.2).filter(p=>p[1]>=.02).concat([[.55,.02],[.15,.02]])],
      [[[-.55,.01],[-.16,.01],[-.21,-.15],[-.49,-.15]],[[.16,.01],[.55,.01],[.49,-.15],[.21,-.15]]],
      [circle(-.35,.04,.245),circle(.35,.04,.245)]
    ];
    const surround=materials.chrome.clone();surround.color.set('#7776a2');
    for(const pair of shapes){const expression=new T.Group();eyes.add(expression);for(const points of pair){const x=points.reduce((s,p)=>s+p[0],0)/points.length,y=points.reduce((s,p)=>s+p[1],0)/points.length;patch(expression,points.map(p=>[x+(p[0]-x)*1.08,y+(p[1]-y)*1.08]),surround,.032);patch(expression,points,materials.white,.044);}expression.visible=expressions.length===0;expressions.push(expression);}
  }
  const crownMaterial=materials.red.clone();let crownGlowMaterial:T.MeshBasicMaterial|undefined;
  if(matched){
    crownMaterial.color.set('#a64159');crownMaterial.toneMapped=false;crownGlowMaterial=materials.white.clone();crownGlowMaterial.transparent=true;crownGlowMaterial.opacity=0;crownGlowMaterial.depthWrite=false;
    const glint=crownMaterial.clone();glint.color.set('#dc8b9a');glint.transparent=true;glint.opacity=.36;glint.depthWrite=false;
    const paint=(points:number[][],material:T.Material,lift:number)=>shellPatch(body,points,material,lift,highDetail?5:1,true);
    for(const x of [-.35,.25]){
      paint([[x-.008,.67],[x+.019,.936],[x+.086,.936],[x+.064,.67]],crownGlowMaterial,.003);
      paint([[x,.70],[x+.02,.915],[x+.045,.938],[x+.066,.932],[x+.08,.918],[x+.058,.702],[x+.04,.682],[x+.018,.683]],crownMaterial,.006);
      paint([[x+.018,.715],[x+.034,.912],[x+.047,.927],[x+.046,.714]],glint,.009);
    }
  }
  else for (const x of [-.28,.12]) patch(body,[[x,.66],[x+.08,.91],[x+.18,.91],[x+.1,.65]],crownMaterial);
  if(matched){
    // A soft lower hull reflection, without an opaque face insert or dark drawn contour.
    const edge=materials.chrome.clone();edge.color.setRGB(1.20,1.13,1.40);edge.vertexColors=true;edge.transparent=true;edge.opacity=.75;edge.depthWrite=false;
    const line=Array.from({length:49},(_,i)=>{const x=-.80+i*1.60/48;return[x,-.86+.48*x*x];});
    const points=line.map(([x,y])=>[x,y+.035]).concat([...line].reverse().map(([x,y])=>[x,y-.035]));
    const reflection=patch(body,points,edge,.025),positions=reflection.geometry.attributes.position,colours:number[]=[];
    for(let i=0;i<positions.count;i++){const x=positions.getX(i),y=positions.getY(i),d=(y-(-.86+.48*x*x))/.035;const alpha=Math.max(0,1-d*d)**2*Math.min(1,Math.max(0,(.8-Math.abs(x))/.15));colours.push(1,1,1,alpha);}
    reflection.geometry.setAttribute('color',new T.Float32BufferAttribute(colours,4));
    // Recessed side socket geometry is attached by the studio asset loader.
  }else{
  for (const side of [-1,1]) {
    const plate = part(body,new T.CylinderGeometry(matched?.31:.22,matched?.31:.22,.026,32),materials.steel,side*(matched?.94:.978),0,matched?.2:0); plate.rotation.z=Math.PI/2;if(matched)plate.rotation.y=-side*.55;
    const inset = part(body,new T.CylinderGeometry(.125,.125,.028,16),materials.dark,side*(matched?.95:.993),0,matched?.215:0); inset.rotation.z=Math.PI/2;if(matched)inset.rotation.y=-side*.55;
    for (let i=0;i<3;i++) { const a=i*Math.PI*2/3; const rivet=part(body,new T.SphereGeometry(.026,6,4),materials.lightSteel,side*1.003,Math.sin(a)*.171,Math.cos(a)*.171); rivet.scale.x=.25; }
  }
  }
  const attachment=new T.Group();root.add(attachment);attachment.position.set(matched?-1.18:-1.03,.65,.05);attachment.visible=false;
  const rotor=new T.Group();attachment.add(rotor);
  if(matched){
    const blade=bladeMaterials??{metal:materials.steel,edge:materials.lightSteel,dark:materials.dark,link:materials.glow.clone(),face:materials.lightSteel},shape=new T.Shape();
    for(let i=0;i<16;i++)for(const [radius,offset] of [[.245,-.16],[.292,.03],[.285,.10],[.257,.085],[.245,.18]]){const a=i*Math.PI/8+offset,x=Math.cos(a)*radius,y=Math.sin(a)*radius;if(i===0&&offset===-.16)shape.moveTo(x,y);else shape.lineTo(x,y);}shape.closePath();
    const geometry=new T.ExtrudeGeometry(shape,{depth:.025,steps:1,bevelEnabled:true,bevelSegments:1,bevelSize:.005,bevelThickness:.005});geometry.translate(0,0,-.0125);
    rotor.add(new T.Mesh(geometry,[blade.metal,blade.edge]));part(rotor,new T.CircleGeometry(.238,64),blade.face,0,0,.019);
    const hub=part(rotor,new T.CylinderGeometry(.115,.125,.035,32),blade.edge,0,0,.022);hub.rotation.x=Math.PI/2;
    const cap=part(rotor,new T.CylinderGeometry(.075,.075,.04,32),blade.dark,0,0,.043);cap.rotation.x=Math.PI/2;
    part(rotor,new T.SphereGeometry(.038,16,10),materials.red,0,0,.067);
    for(let i=0;i<3;i++){const a=i*Math.PI*2/3;part(rotor,new T.SphereGeometry(.012,8,6),blade.dark,Math.cos(a)*.09,Math.sin(a)*.09,.049);}
    part(attachment,new T.PlaneGeometry(.48,.10),blade.link,.46,0,.05);
  }else{
    const disc=part(rotor,new T.CylinderGeometry(.43,.43,.09,16),materials.steel);disc.rotation.x=Math.PI/2;
    for(let i=0;i<12;i++){const a=i*Math.PI/6;const tooth=part(rotor,new T.ConeGeometry(.07,.17,3),materials.lightSteel,Math.sin(a)*.48,Math.cos(a)*.48,0);tooth.rotation.z=-a;}
    part(attachment,new T.SphereGeometry(.12,8,6),materials.red,0,0,.09);const link=part(attachment,new T.CylinderGeometry(.025,.025,.5,6),materials.glow,.36,0,0);link.rotation.z=Math.PI/2;
  }
  return {root,body,eyes,crownMaterial,crownGlowMaterial,attachment,rotor,expressions};
}
export function makeSawlet(m: Materials) {
  const root=new T.Group(),body=new T.Group(),blade=new T.Group();root.add(body);body.position.y=.67;body.add(blade);
  const seam = Math.acos(.12 / .67);
  part(body,new T.SphereGeometry(.67,12,6,0,Math.PI*2,seam,Math.PI-seam),m.rust);
  // Distinct faceted upper cap and a horizontal toothed disc, matching REDLINE's identity sheet.
  part(body,new T.SphereGeometry(.67,12,5,0,Math.PI*2,0,seam),m.rustLight);
  blade.position.y=.12;
  part(blade,new T.CylinderGeometry(.81,.81,.075,24),m.steel);
  for(let i=0;i<16;i++) {
    const a=i/16*Math.PI*2;
    const tooth=part(blade,new T.ConeGeometry(.13,.3,3),m.lightSteel,Math.sin(a)*.86,0,Math.cos(a)*.86);
    tooth.rotation.set(Math.PI/2,0,-a+.32);
  }
  const face=new T.Group();face.scale.setScalar(.67);body.add(face);
  shellPatch(face,[[-.59,-.05],[-.11,-.17],[-.27,-.43],[-.53,-.32]],m.red);
  shellPatch(face,[[.11,-.17],[.59,-.05],[.53,-.32],[.27,-.43]],m.red);
  shellPatch(face,[[-.5,-.12],[-.18,-.2],[-.29,-.3]],m.white,.017);
  shellPatch(face,[[.18,-.2],[.5,-.12],[.29,-.3]],m.white,.017);
  for(const side of [-1,1]) { const hub=part(body,new T.CylinderGeometry(.18,.18,.03,8),m.dark,side*.651,-.15,0);hub.rotation.z=Math.PI/2; }
  return {root,body,blade};
}
