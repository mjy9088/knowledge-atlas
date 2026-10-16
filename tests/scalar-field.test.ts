import test from 'node:test';
import assert from 'node:assert/strict';
import {createScalarGrid,weightedCloud,scalarIsosurface} from '../packages/spatial/scalar-field.js';
const bounds=[[-1,1],[-1,1],[-1,1]];
test('generic constant field integrates its volume and seeded cloud samples are reproducible',()=>{
  const grid=createScalarGrid({evaluate:()=>2,weight:()=>1,bounds,resolution:10});
  // Grid integration uses floating-point cell volumes.
  assert.ok(Math.abs(grid.integral-8)<1e-12);const cloud=weightedCloud(grid,{count:1000,seed:42});
  assert.deepEqual(cloud,weightedCloud(grid,{count:1000,seed:42}));
  assert.notDeepEqual(cloud,weightedCloud(grid,{count:1000,seed:43}));
  for(const item of cloud)assert.ok(item.point.every(v=>v>=-1&&v<=1));
  for(let axis=0;axis<3;axis++)assert.ok(Math.abs(cloud.reduce((s,item)=>s+item.point[axis],0)/cloud.length)<.06);
});
test('tetrahedral isosurface reproduces a linear plane and approximates a spherical level set',()=>{
  const plane=createScalarGrid({evaluate:([x])=>x,weight:value=>value+2,bounds,resolution:8});
  const triangles=scalarIsosurface(plane,2);assert.ok(triangles.length>0);
  for(const triangle of triangles)for(const vertex of triangle)assert.ok(Math.abs(vertex.point[0])<1e-12);
  const sphere=createScalarGrid({evaluate:p=>1-p.reduce((s,v)=>s+v*v,0),weight:v=>Math.max(0,v),bounds,resolution:16});
  const surface=scalarIsosurface(sphere,.5);assert.ok(surface.length>0);
  for(const triangle of surface)for(const vertex of triangle)assert.ok(Math.abs(vertex.point.reduce((s,v)=>s+v*v,0)-.5)<.012);
});
test('empty fields have empty clouds/surfaces and invalid field inputs are rejected',()=>{
  const grid=createScalarGrid({evaluate:()=>0,bounds});assert.deepEqual(weightedCloud(grid),[]);assert.deepEqual(scalarIsosurface(grid,1),[]);
  assert.throws(()=>createScalarGrid({evaluate:()=>NaN,bounds}));assert.throws(()=>createScalarGrid({evaluate:()=>1,weight:()=>-1,bounds}));
  assert.throws(()=>createScalarGrid({evaluate:()=>1,bounds:[[1,-1],[-1,1],[-1,1]]}));assert.throws(()=>scalarIsosurface(grid,0));
});
