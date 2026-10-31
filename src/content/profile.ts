import {z} from 'zod';
export const profileSchema=z.object({version:z.literal(1),bladeUnlocked:z.boolean(),equipped:z.enum(['core','blade']),clears:z.number().int().nonnegative()}).refine(p=>p.equipped!=='blade'||p.bladeUnlocked,'Blade must be unlocked before equipping');
export type Profile=z.infer<typeof profileSchema>;
export const freshProfile=():Profile=>({version:1,bladeUnlocked:false,equipped:'core',clears:0});
export function decodeProfile(text:string|null):Profile {
 if(!text)return freshProfile();try{const parsed=profileSchema.safeParse(JSON.parse(text));return parsed.success?parsed.data:freshProfile();}catch{return freshProfile();}
}
export function awardBlade(profile:Profile):Profile{return{...profile,bladeUnlocked:true,clears:profile.clears+1};}
export function equipProfile(profile:Profile,form:Profile['equipped']):Profile{return form==='blade'&&!profile.bladeUnlocked?profile:{...profile,equipped:form};}
