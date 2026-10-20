import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sphereSlice} from '../sphere-slices.js';

test('sphere plane section recovers independent 3–4–5 triangle and central disk',()=>{
  assert.deepEqual(sphereSlice({radius:5,height:3}),{kind:'disk',radius:4,area:16*Math.PI,radiusSquared:16});
  assert.deepEqual(sphereSlice({radius:2,height:0}),{kind:'disk',radius:2,area:4*Math.PI,radiusSquared:4});
});
test('tangent point and outside empty set stay distinct',()=>{
  for(const height of [-5,5])assert.deepEqual(sphereSlice({radius:5,height}),{kind:'point',radius:0,area:0,radiusSquared:0});
  for(const height of [-6,6])assert.deepEqual(sphereSlice({radius:5,height}),{kind:'empty',radius:null,area:0,radiusSquared:null});
  assert.equal(sphereSlice({radius:1,height:1+Number.EPSILON}).kind,'empty');
  assert.equal(sphereSlice({radius:1,height:1-Number.EPSILON}).kind,'disk');
});
test('reflection preserves section and larger distance shrinks it',()=>{
  let previous=Infinity;
  for(const height of [0,1,2,3,4,5]){
    const result=sphereSlice({radius:5,height});
    assert.deepEqual(result,sphereSlice({radius:5,height:-height}));
    assert.ok(result.area<previous);previous=result.area;
  }
  assert.equal(sphereSlice({radius:1,height:0}).radius,1);
});
test('uniform scaling doubles section radius and quadruples area',()=>{
  const small=sphereSlice({radius:2,height:1}),large=sphereSlice({radius:4,height:2});
  assert.equal(large.area,small.area*4);
  assert.ok(small.radius!==null&&large.radius!==null);
  assert.equal(large.radius,small.radius*2);
});
test('a section alone does not identify the original sphere',()=>{
  assert.deepEqual(sphereSlice({radius:5,height:3}),sphereSlice({radius:4,height:0}));
});
test('unsupported or nonfinite input is rejected rather than clamped',()=>{
  for(const input of [{radius:0,height:0},{radius:6,height:0},{radius:2,height:7},{radius:NaN,height:0},{radius:2,height:Infinity},{radius:'2',height:0},null])assert.throws(()=>sphereSlice(input as Parameters<typeof sphereSlice>[0]));
});
