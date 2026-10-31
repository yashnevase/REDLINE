import {decodeProfile,profileSchema,type Profile} from '../content/profile.ts';
const key='redline.profile.v1';
export function loadProfile():Profile {try{return decodeProfile(localStorage.getItem(key));}catch{return decodeProfile(null);}}
export function saveProfile(profile:Profile):boolean {const parsed=profileSchema.safeParse(profile);if(!parsed.success)return false;try{localStorage.setItem(key,JSON.stringify(parsed.data));return true;}catch{return false;}}
