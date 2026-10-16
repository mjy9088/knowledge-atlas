import test from 'node:test';
import assert from 'node:assert/strict';
import {deriveExplosion,assertState} from '../packages/models/explosion.js';

test('both premises produce contradiction and any allowed conclusion by this route',()=>{
 for(const conclusion of ['Q','R','S']){
  const r=deriveExplosion({hasP:true,hasNotP:true,conclusion});
  assert.equal(r.contradiction,true);
  assert.equal(r.thisProofPathExists,true);
  assert.deepEqual(r.steps.map(s=>s.symbol),['P','¬P','⊥',conclusion]);
 }
});

test('missing premise does not establish semantic falsity or general unprovability',()=>{
 for(const state of [
  {hasP:true,hasNotP:false,conclusion:'Q'},
  {hasP:false,hasNotP:true,conclusion:'R'},
  {hasP:false,hasNotP:false,conclusion:'S'}
 ]){
  const r=deriveExplosion(state);
  assert.equal(r.thisProofPathExists,false);
  assert.equal(r.epistemicMeaning,'this-path-not-derivable');
  assert.equal(r.steps.some(s=>s.semanticId==='derived-conclusion'),false);
 }
});

test('strict input contract rejects malformed states',()=>{
 assert.throws(()=>deriveExplosion({hasP:1 as never,hasNotP:true,conclusion:'Q'}),/boolean/);
 assert.throws(()=>deriveExplosion({hasP:true,hasNotP:true,conclusion:'TRUE'}),/Conclusion/);
 assert.throws(()=>assertState(null as never),/object/);
});

test('pure deterministic evaluation',()=>{
 const s={hasP:true,hasNotP:true,conclusion:'R'};
 assert.deepEqual(deriveExplosion(s),deriveExplosion(s));
 assert.deepEqual(s,{hasP:true,hasNotP:true,conclusion:'R'});
});
