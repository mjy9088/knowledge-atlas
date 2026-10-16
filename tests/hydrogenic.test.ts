import test from 'node:test';
import assert from 'node:assert/strict';
import {createHydrogenicField,radialWavefunction,realAngular,ORBITAL_BASES} from '../packages/models/hydrogenic.js';

const near=(a: number,b: number,tolerance=1e-10)=>assert.ok(Math.abs(a-b)<tolerance,`${a} vs ${b}`);
test('hydrogen 1s, 2s and Cartesian 2p agree with independent closed forms',()=>{
  for(const point of [[0,0,0],[1,2,3],[-.3,.7,1.4]]){
    const r=Math.hypot(...point);
    near(createHydrogenicField({n:1,basis:'s',Z:1}).evaluate(point),Math.exp(-r)/Math.sqrt(Math.PI));
    near(createHydrogenicField({n:2,basis:'s',Z:1}).evaluate(point),(2-r)*Math.exp(-r/2)/(4*Math.sqrt(2*Math.PI)));
    for(const [i,basis]of ['px','py','pz'].entries())near(createHydrogenicField({n:2,basis,Z:1}).evaluate(point),point[i]*Math.exp(-r/2)/(4*Math.sqrt(2*Math.PI)));
  }
});
test('every supported radial function is normalized with the radial volume measure',()=>{
  for(let n=1;n<=4;n++)for(let l=0;l<=Math.min(2,n-1);l++){
    const step=.025,end=200,count=end/step;let sum=0;
    for(let i=0;i<=count;i++){const r=i*step,R=radialWavefunction(n,l,1,r);sum+=(i===0||i===count?1:i%2?4:2)*R*R*r*r;}
    near(sum*step/3,1,2e-7);
  }
});
function angularIntegral(a: string,b: string){
  let sum=0;const uCount=200,phiCount=96;
  for(let i=0;i<uCount;i++)for(let j=0;j<phiCount;j++){
    const u=-1+(i+.5)*2/uCount,phi=(j+.5)*2*Math.PI/phiCount,p=[Math.sqrt(1-u*u)*Math.cos(phi),Math.sqrt(1-u*u)*Math.sin(phi),u];
    sum+=realAngular(a,p)*realAngular(b,p);
  }
  return sum*4*Math.PI/(uCount*phiCount);
}
test('real s/p/d angular basis has unit norm and distinct members are orthogonal',()=>{
  for(const a of ORBITAL_BASES)for(const b of ORBITAL_BASES)near(angularIntegral(a.id,b.id),a===b?1:0,1.5e-4);
});
test('nodal surfaces, sign changes and charge scaling match hydrogenic structure',()=>{
  const twoS=createHydrogenicField({n:2,basis:'s',Z:1});near(twoS.evaluate([2,0,0]),0);assert.ok(twoS.evaluate([1,0,0])*twoS.evaluate([3,0,0])<0);
  near(createHydrogenicField({n:2,basis:'pz',Z:1}).evaluate([1,2,0]),0);
  near(createHydrogenicField({n:3,basis:'dxy',Z:1}).evaluate([0,1,2]),0);
  for(const basis of ORBITAL_BASES){const n=Math.max(3,basis.l+1),one=createHydrogenicField({n,basis:basis.id,Z:1}),three=createHydrogenicField({n,basis:basis.id,Z:3}),p=[.7,1.2,2.1];near(three.evaluate(p),3**1.5*one.evaluate(p.map(v=>v*3)));}
  near(createHydrogenicField({n:2,basis:'pz',Z:3}).energyHartree,-9/8);
});
test('all supported orbitals satisfy an independently differenced Coulomb Schrödinger equation',()=>{
  const point=[.7,1.1,1.9],h=.0003,r=Math.hypot(...point);
  for(let n=1;n<=4;n++)for(const basis of ORBITAL_BASES.filter(b=>b.l<n)){
    const field=createHydrogenicField({n,basis:basis.id,Z:1}),psi=field.evaluate(point);
    let laplacian=0;for(let axis=0;axis<3;axis++){const a=[...point],b=[...point];a[axis]+=h;b[axis]-=h;laplacian+=(field.evaluate(a)-2*psi+field.evaluate(b))/(h*h);}
    near(-laplacian/2-psi/r,-psi/(2*n*n),2e-8);
  }
});
test('unsupported states reject and returned model metadata cannot mutate its evaluation',()=>{
  for(const state of [{n:1,basis:'pz',Z:1},{n:5,basis:'s',Z:1},{n:3,basis:'f',Z:1},{n:2,basis:'s',Z:0}])assert.throws(()=>createHydrogenicField(state));
  const field=createHydrogenicField(),before=field.evaluate([1,2,3]);field.state.n=4;near(field.evaluate([1,2,3]),before);
  assert.throws(()=>field.evaluate([NaN,0,0]));assert.throws(()=>radialWavefunction(2,1,1,-1));
});
