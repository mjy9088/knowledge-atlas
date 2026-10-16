/** Euclidean solid ball, infinitesimally thin horizontal plane; lengths in cm. */
export interface SphereSliceInput { radius:number; height:number }
export type SphereSliceResult = {kind:'disk'|'point';radius:number;area:number;radiusSquared:number}|{kind:'empty';radius:null;area:0;radiusSquared:null};
export function validateSphereSliceInput(input:unknown):asserts input is SphereSliceInput {
  if(!input||typeof input!=='object')throw new TypeError('Expected sphere slice input');
  const value=input as Record<string,unknown>;
  if(typeof value.radius!=='number'||typeof value.height!=='number'||!Number.isFinite(value.radius)||!Number.isFinite(value.height))throw new TypeError('Lengths must be finite numbers');
  if(value.radius<1||value.radius>5||value.height< -6||value.height>6)throw new RangeError('Supported radius: 1–5 cm; plane height: −6–6 cm');
}
export function sphereSlice(input:SphereSliceInput):SphereSliceResult {
  validateSphereSliceInput(input);
  const {radius:R,height:h}=input;
  if(Math.abs(h)>R)return {kind:'empty',radius:null,area:0,radiusSquared:null};
  // Factored form avoids cancellation near the tangent plane.
  const radiusSquared=(R-Math.abs(h))*(R+Math.abs(h));
  return {kind:radiusSquared===0?'point':'disk',radius:Math.sqrt(radiusSquared),area:Math.PI*radiusSquared,radiusSquared};
}
