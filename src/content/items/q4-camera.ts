import {Q4_ENABLED} from './switches.ts';
export const cameraPresets={close:.85,default:1.0,wide:1.5,far:1.9} as const;
export const cameraOrder=['close','default','wide','far'] as const;
export function cameraDistance(preset:keyof typeof cameraPresets,compact=false,enabled=Q4_ENABLED){return enabled?(preset==='default'&&compact?1:cameraPresets[preset]):preset==='close'?.85:preset==='default'?1:1.3;}
