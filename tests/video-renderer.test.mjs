import test from 'node:test';
import assert from 'node:assert/strict';
import {renderPlan,frameTime} from '../tools/media/renderer.mjs';
import {ebmlSize,muxWebM} from '../tools/media/webm-muxer.mjs';
test('render clock covers all frames without gaps and rejects unsupported settings',()=>{
  for(const fps of [24,30]){const plan=renderPlan({durationMs:180000},{fps});assert.equal(plan.frameCount,180*fps);let end=0;for(let i=0;i<plan.frameCount;i++){const clock=frameTime(i,plan);assert.equal(clock.timestamp,end);end+=clock.duration;}assert.equal(end,180e6);assert.throws(()=>frameTime(plan.frameCount,plan));}
  assert.throws(()=>renderPlan({durationMs:180000},{fps:60}));assert.throws(()=>renderPlan({durationMs:180000},{width:13}));assert.throws(()=>renderPlan({durationMs:180000},{durationMs:0}));assert.throws(()=>renderPlan({durationMs:180000},{durationMs:180001}));
});
test('EBML sizes reserve the all-ones sentinel and muxed WebM includes geometry and cue index',()=>{
  assert.deepEqual([...ebmlSize(0)],[0x80]);assert.deepEqual([...ebmlSize(126)],[0xfe]);assert.deepEqual([...ebmlSize(127)],[0x40,0x7f]);assert.throws(()=>ebmlSize(-1));
  const packets=[{timestamp:0,key:true,data:new Uint8Array([1,2])},{timestamp:33333,key:false,data:new Uint8Array([3])},{timestamp:2000000,key:true,data:new Uint8Array([4])}];
  const bytes=muxWebM({packets,width:1080,height:1440,fps:30,durationMs:2100});assert.deepEqual([...bytes.slice(0,4)],[0x1a,0x45,0xdf,0xa3]);assert.ok(new TextDecoder().decode(bytes).includes('V_VP8'));
  const contains=needle=>bytes.some((_,i)=>needle.every((v,j)=>bytes[i+j]===v));assert.ok(contains([0x1c,0x53,0xbb,0x6b]));assert.ok(contains([0xb0,0x82,0x04,0x38]));assert.ok(contains([0xba,0x82,0x05,0xa0]));
  assert.throws(()=>muxWebM({packets:[],width:1080,height:1440,fps:30,durationMs:100}));assert.throws(()=>muxWebM({packets:[packets[1]],width:1080,height:1440,fps:30,durationMs:100}));assert.throws(()=>muxWebM({packets:[packets[2],packets[0]],width:1080,height:1440,fps:30,durationMs:100}));
});
