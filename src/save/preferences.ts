import {decodePreferences,preferencesSchema,type Preferences} from '../content/preferences.ts';
const key='redline.preferences.v1';
export function loadPreferences():Preferences {const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;try{return decodePreferences(localStorage.getItem(key),reduced);}catch{return decodePreferences(null,reduced);}}
export function savePreferences(value:Preferences):boolean {const result=preferencesSchema.safeParse(value);if(!result.success)return false;try{localStorage.setItem(key,JSON.stringify(result.data));return true;}catch{return false;}}
