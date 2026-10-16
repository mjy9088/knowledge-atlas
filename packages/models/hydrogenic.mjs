// Fixed-nucleus, nonrelativistic Coulomb bound states. Length a0, energy Hartree.
// Radial normalization: NIST DLMF 18.39.35/37; real angular basis: MIT 8.04 20–21 §3.
export const ORBITAL_BASES=Object.freeze([
  {id:'s',label:'s',l:0},{id:'px',label:'pₓ',l:1},{id:'py',label:'pᵧ',l:1},{id:'pz',label:'p_z',l:1},
  {id:'dxy',label:'d_xy',l:2},{id:'dxz',label:'d_xz',l:2},{id:'dyz',label:'d_yz',l:2},
  {id:'dx2-y2',label:'d_(x²−y²)',l:2},{id:'dz2',label:'d_z²',l:2},
].map(Object.freeze));
export const DEFAULT_ORBITAL=Object.freeze({n:2,basis:'pz',Z:1});
export function validateOrbitalState(state){
  const basis=ORBITAL_BASES.find(item=>item.id===state?.basis);
  if(!basis||!Number.isInteger(state?.n)||state.n<1||state.n>4||basis.l>=state.n||!Number.isInteger(state?.Z)||state.Z<1||state.Z>3)throw new RangeError('지원 범위: n=1–4, l<n인 s/p/d, Z=1–3');
  return {n:state.n,basis:basis.id,Z:state.Z};
}
const factorial=n=>{let value=1;for(let i=2;i<=n;i++)value*=i;return value;};
function laguerre(k,a,x){
  if(k===0)return 1;let before=1,current=1+a-x;
  for(let i=2;i<=k;i++){const next=((2*i-1+a-x)*current-(i-1+a)*before)/i;before=current;current=next;}
  return current;
}
export function radialWavefunction(n,l,Z,r){
  if(!Number.isInteger(n)||n<1||n>4||!Number.isInteger(l)||l<0||l>2||l>=n||!Number.isInteger(Z)||Z<1||Z>3||!Number.isFinite(r)||r<0)throw new RangeError('Unsupported radial input');
  return radial(n,l,Z,r);
}
function radial(n,l,Z,r){
  const rho=2*Z*r/n;
  return 2/(n*n)*Math.sqrt(Z**3*factorial(n-l-1)/factorial(n+l))*Math.exp(-rho/2)*rho**l*laguerre(n-l-1,2*l+1,rho);
}
export function realAngular(basis,point){
  if(!ORBITAL_BASES.some(item=>item.id===basis)||!Array.isArray(point)||point.length!==3||point.some(v=>!Number.isFinite(v)))throw new TypeError('Expected a supported basis and three finite coordinates');
  return angular(basis,point);
}
function angular(basis,[x,y,z]){
  const r=Math.hypot(x,y,z);if(basis==='s')return 1/Math.sqrt(4*Math.PI);if(r===0)return 0;
  const p=Math.sqrt(3/(4*Math.PI))/r,d=Math.sqrt(15/(4*Math.PI))/(r*r);
  switch(basis){
    case 'px':return p*x;case 'py':return p*y;case 'pz':return p*z;
    case 'dxy':return d*x*y;case 'dxz':return d*x*z;case 'dyz':return d*y*z;
    case 'dx2-y2':return d*(x*x-y*y)/2;
    case 'dz2':return Math.sqrt(5/(16*Math.PI))*(3*z*z/(r*r)-1);
    default:throw new RangeError('Unknown real angular basis');
  }
}
export function createHydrogenicField(input=DEFAULT_ORBITAL){
  const state=validateOrbitalState(input),l=ORBITAL_BASES.find(b=>b.id===state.basis).l;
  return {
    id:'model:quantum.hydrogenic.real',state:{...state},l,radialNodes:state.n-l-1,angularNodes:l,
    energyHartree:-(state.Z**2)/(2*state.n**2),extent:4*state.n**2/state.Z,
    evaluate(point){
      if(!Array.isArray(point)||point.length!==3||point.some(v=>!Number.isFinite(v)))throw new TypeError('Expected three finite coordinates');
      return radial(state.n,l,state.Z,Math.hypot(...point))*angular(state.basis,point);
    },
  };
}
