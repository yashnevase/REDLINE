export const CL1_ENABLED=true,CL2_ENABLED=true,CL3_ENABLED=true,CL4_ENABLED=true,CL5_ENABLED=true;
export const EXPANDED_DECK_ENABLED=true,EXTRA_PRESSURE_ENABLED=true;
export const deckHalfWidth=EXPANDED_DECK_ENABLED?21:17;
// The frame is decorative; the actual edge and machinery still protect the player.
export const deckCornerKeepouts=[{x:20,z:20,hx:2,hz:2},{x:-20,z:20,hx:2,hz:2},{x:20,z:-20,hx:2,hz:2},{x:-20,z:-20,hx:2,hz:2}] as const;
