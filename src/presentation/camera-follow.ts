// Analytic critically damped follow. Presentation state only, reset on a run/seek.
export function makeCameraFollow(){
 let x=0,z=0,vx=0,vz=0,initialized=false;
 return{reset:()=>{initialized=false;vx=vz=0;},update:(hero:{x:number;z:number;vx:number;vz:number},dt:number,lookAhead:number,damping:number,inset:number,quiet=false)=>{
  const speed=Math.hypot(hero.vx,hero.vz),limit=24-Math.min(23,Math.max(0,inset));
  const clamp=(n:number)=>Math.max(-limit,Math.min(limit,n));
  const targetX=clamp(hero.x+(quiet||speed<.1?0:hero.vx/speed*lookAhead)),targetZ=clamp(hero.z+(quiet||speed<.1?0:hero.vz/speed*lookAhead));
  if(!initialized||quiet){x=targetX;z=targetZ;vx=vz=0;initialized=true;}
  else{const omega=2/Math.max(.01,damping),decay=Math.exp(-omega*dt),dx=x-targetX,dz=z-targetZ,ax=vx+omega*dx,az=vz+omega*dz;x=targetX+(dx+ax*dt)*decay;z=targetZ+(dz+az*dt)*decay;vx=(vx-omega*ax*dt)*decay;vz=(vz-omega*az*dt)*decay;}
  x=clamp(x);z=clamp(z);return{x,z};
 }};
}
