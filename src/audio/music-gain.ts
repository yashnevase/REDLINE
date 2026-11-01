// Prefader calibration. Saved music/master sliders apply afterwards.
export function musicGain(track?:{lufs?:number;truePeak?:number}){
 if(track?.lufs===undefined||!Number.isFinite(track.lufs))return .5;
 const target=-18-track.lufs,peak=track.truePeak===undefined||!Number.isFinite(track.truePeak)?target:-2-track.truePeak;
 return Math.max(.0001,Math.min(2,10**(Math.min(target,peak)/20)));
}
