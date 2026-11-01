import {bindingsSchema} from './items/f2-bindings.ts';
import {z} from 'zod';
export const preferencesSchema=z.object({version:z.literal(1),qualityMode:z.enum(['auto','manual']).optional(),resolution:z.number().min(.5).max(1.5).optional(),deadzone:z.number().min(.05).max(.4).optional(),rumble:z.boolean().optional(),ssao:z.boolean().optional(),bindings:bindingsSchema.optional(),reducedMotion:z.boolean(),reducedFlashes:z.boolean(),quality:z.enum(['standard','low','high']),zoom:z.enum(['close','default','wide','far']).default('default')});
export type Preferences=z.infer<typeof preferencesSchema>;
export function defaultPreferences(reducedMotion=false):Preferences{return{version:1,reducedMotion,reducedFlashes:false,quality:'high',zoom:'default'};}
export function decodePreferences(raw:string|null,reducedMotion=false):Preferences {try{const result=preferencesSchema.safeParse(raw?JSON.parse(raw):null);return result.success?result.data:defaultPreferences(reducedMotion);}catch{return defaultPreferences(reducedMotion);}}

export {cameraPresets as zoomPresets,cameraOrder as zoomOrder} from './items/q4-camera.ts';
