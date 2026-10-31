import * as T from 'three';
import {CL3_ENABLED} from '../content/items/cl-clarity.ts';
// Fresnel edge on the existing shell: no silhouette mesh, no extra draw submission.
export function applyReadableCore(material:T.MeshMatcapMaterial){if(!CL3_ENABLED)return;const previous=material.onBeforeCompile,previousKey=material.customProgramCacheKey;material.onBeforeCompile=(s,r)=>{previous.call(material,s,r);s.fragmentShader=s.fragmentShader.replace('#include <opaque_fragment>','float clarityRim=pow(1.-abs(dot(normal,normalize(vViewPosition))),3.);outgoingLight+=vec3(.35,.30,.60)*clarityRim*.65;\n#include <opaque_fragment>');};material.customProgramCacheKey=()=> 'CL3-core-edge-v1-'+previousKey.call(material);}
