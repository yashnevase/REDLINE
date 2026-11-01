import type {WebGLProgramParametersWithUniforms} from 'three';
export const P5_ENABLED=true;
export function finishShader(shader:WebGLProgramParametersWithUniforms,environment=false){
 shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vFinishView;').replace('#include <project_vertex>','#include <project_vertex>\nvFinishView=-mvPosition.xyz;');
 shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vFinishView;').replace('#include <opaque_fragment>',`${environment?'if(vActorSurface>.5){':''}float lightValue=max(.001,dot(outgoingLight,vec3(.2126,.7152,.0722)));float bands=.18+.28*smoothstep(.12,.29,lightValue)+.42*smoothstep(.40,.72,lightValue);outgoingLight*=mix(1.,bands/lightValue,.22);float rim=pow(1.-abs(dot(normal,normalize(vFinishView))),3.);outgoingLight+=vec3(.025,.04,.065)*rim;${environment?'}':''}\n#include <opaque_fragment>`);
}
