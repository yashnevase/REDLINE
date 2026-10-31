import {z} from 'zod';
export const preferencesSchema=z.object({version:z.literal(1),reducedMotion:z.boolean(),reducedFlashes:z.boolean(),quality:z.enum(['standard','low','high'])});
export type Preferences=z.infer<typeof preferencesSchema>;
export function defaultPreferences(reducedMotion=false):Preferences{return{version:1,reducedMotion,reducedFlashes:false,quality:'standard'};}
export function decodePreferences(raw:string|null,reducedMotion=false):Preferences {try{const result=preferencesSchema.safeParse(raw?JSON.parse(raw):null);return result.success?result.data:defaultPreferences(reducedMotion);}catch{return defaultPreferences(reducedMotion);}}
