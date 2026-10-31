import * as T from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {FullScreenQuad} from 'three/addons/postprocessing/Pass.js';
// Half-resolution emissive-only high tier; never runs for Standard/Low or reduced flashes.
export function makeSelectiveGlow(renderer:T.WebGLRenderer,scene:T.Scene,camera:T.Camera){
 const composer=new EffectComposer(renderer,new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType}));composer.renderToScreen=false;composer.addPass(new RenderPass(scene,camera));const bloom=new UnrealBloomPass(new T.Vector2(1,1),.45,.5,.18);composer.addPass(bloom);
 const black=new T.MeshBasicMaterial({color:0,toneMapped:false});const saved=new Map<T.Mesh,T.Material|T.Material[]>();
 const composite=new T.ShaderMaterial({uniforms:{glow:{value:null}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',fragmentShader:'uniform sampler2D glow;varying vec2 vUv;void main(){gl_FragColor=vec4(texture2D(glow,vUv).rgb*.42,1.);\n#include <colorspace_fragment>\n}',transparent:true,blending:T.AdditiveBlending,depthTest:false,depthWrite:false,toneMapped:false});const quad=new FullScreenQuad(composite);
 let width=0,height=0;
 return{draw:()=>{const reset=renderer.info.autoReset,clear=renderer.autoClear,target=renderer.getRenderTarget();renderer.info.autoReset=false;renderer.info.reset();try{const size=renderer.getDrawingBufferSize(new T.Vector2()),w=Math.max(1,Math.floor(size.x/2)),h=Math.max(1,Math.floor(size.y/2));if(w!==width||h!==height){composer.setPixelRatio(1);composer.setSize(w,h);width=w;height=h;}
  const hidden:T.Object3D[]=[];const background=scene.background;scene.background=new T.Color(0);scene.traverse(o=>{if((o instanceof T.Points||o instanceof T.Sprite)&&o.visible){hidden.push(o);o.visible=false;}if(!(o instanceof T.Mesh))return;const mat=o.material,emissive=(m:T.Material)=>m instanceof T.MeshBasicMaterial&&!m.transparent&&(m.color.b>m.color.g*1.15||m.color.r>m.color.g*1.6);saved.set(o,mat);o.material=Array.isArray(mat)?mat.map(m=>emissive(m)?m:black):emissive(mat)?mat:black;});
  try{composer.render();}finally{scene.background=background;for(const o of hidden)o.visible=true;for(const [mesh,mat] of saved)mesh.material=mat;saved.clear();}
  renderer.setRenderTarget(null);renderer.render(scene,camera);renderer.autoClear=false;composite.uniforms.glow.value=composer.readBuffer.texture;quad.render(renderer);
 }finally{renderer.info.autoReset=reset;renderer.autoClear=clear;renderer.setRenderTarget(target);}},dispose:()=>{composer.dispose();bloom.dispose();quad.dispose();black.dispose();}};
}
