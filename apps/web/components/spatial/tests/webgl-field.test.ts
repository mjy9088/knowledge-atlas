import assert from 'node:assert/strict';
import test from 'node:test';
import {createFieldFrame,normalizedCameraDepth,projectFieldPoint,sortCloudBackToFront} from '../field-camera.js';
import {packCloudVertices,packSurfaceVertices} from '../webgl-data.js';

test('WebGL cloud packing preserves positions and caller field signs',()=>{
  // Given
  const samples=[{point:[1,2,3] as [number,number,number],value:-.5},{point:[-1,0,4] as [number,number,number],value:.25}];
  // When
  const vertices=packCloudVertices(samples);
  // Then
  assert.deepEqual([...vertices],[1,2,3,-.5,-1,0,4,.25]);
});

test('WebGL surface packing assigns one flat unit normal and the Canvas face-sum phase to each triangle',()=>{
  // Given
  const triangles=[[{point:[0,0,0] as [number,number,number],value:1},{point:[1,0,0] as [number,number,number],value:1},{point:[0,1,0] as [number,number,number],value:-1}]];
  // When
  const vertices=packSurfaceVertices(triangles);
  // Then
  assert.equal(vertices.length,21);
  for(let offset=0;offset<vertices.length;offset+=7)assert.deepEqual([...vertices.slice(offset+4,offset+7)],[0,0,1]);
  assert.deepEqual([vertices[3],vertices[10],vertices[17]],[1,1,1]);
});

test('camera framing keeps every rotated box corner within normalized depth',()=>{
  // Given
  const frame=createFieldFrame([[10,138],[-96,32],[50,178]]),view={yaw:.83,pitch:-.61,zoom:1.65,mode:'cloud' as const,plane:'xz' as const,slice:0,iso:.035};
  const corners=[] as [number,number,number][];
  for(const x of [10,138])for(const y of [-96,32])for(const z of [50,178])corners.push([x,y,z]);
  // When
  const depths=corners.map(point=>normalizedCameraDepth(point,frame,view));
  // Then
  assert.equal(depths.length,8);assert.ok(depths.every(depth=>Math.abs(depth)<=1));
});

test('camera projection is invariant across unit, scaled, and translated equivalent fields',()=>{
  // Given
  const view={yaw:-.65,pitch:.45,zoom:1.65,mode:'cloud' as const,plane:'xz' as const,slice:0,iso:.035};
  const fixtures=[{bounds:[[-1,1],[-1,1],[-1,1]] as [[number,number],[number,number],[number,number]],point:[.25,-.5,.75] as [number,number,number]},{bounds:[[-64,64],[-64,64],[-64,64]] as [[number,number],[number,number],[number,number]],point:[16,-32,48] as [number,number,number]},{bounds:[[10,12],[-7,-5],[20,22]] as [[number,number],[number,number],[number,number]],point:[11.25,-6.5,21.75] as [number,number,number]}];
  // When
  const projections=fixtures.map(({bounds,point})=>projectFieldPoint(point,{frame:createFieldFrame(bounds),view,width:320,height:240}));
  // Then
  for(const projection of projections.slice(1))projection.forEach((value,index)=>assert.ok(Math.abs(value-(projections[0]?.[index]??0))<1e-10));
});

test('transparent GPU cloud points are packed back to front for the current camera',()=>{
  // Given
  const samples=[{point:[0,0,1],value:1},{point:[0,0,-1],value:-1}],frame=createFieldFrame([[-1,1],[-1,1],[-1,1]]),view={yaw:0,pitch:0};
  // When
  const sorted=sortCloudBackToFront(samples,frame,view);
  // Then
  assert.deepEqual(sorted.map(sample=>sample.point[2]),[-1,1]);
});
