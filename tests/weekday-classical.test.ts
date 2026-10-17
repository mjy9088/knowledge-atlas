import {test} from 'node:test';
import assert from 'node:assert/strict';
import {weekdayClassicalProof} from '../packages/models/weekday-classical.js';
import {PRESET_CONTEXTS,type WeekdayInterpretation} from '../packages/models/weekday-worlds.js';
import {readerSkip,createRelatedReader} from '../apps/web/components/reader/state.js';
import page from '../content/formal-logic/weekday-worlds/page.js';

test('ordinary weekday derivations retain Friday and Monday fixtures in both reference directions',()=>{
  for(const [target,forward,reversed]of [[4,6,2],[0,2,5]])for(const [rule,answer]of [['actual-yesterday',forward],['imagined-yesterday',reversed]] as const){
    const result=weekdayClassicalProof({actual:0,target,contexts:PRESET_CONTEXTS[rule]});
    assert.equal(result.supported,true);assert.equal(result.answer,answer);assert.ok(result.equation);assert.ok(result.substituted?.includes(String(target)));
  }
});
test('the scoped t/h derivation does not fabricate steps for incompatible or unconstrained references',()=>{
  const input:WeekdayInterpretation={actual:6,target:4,contexts:PRESET_CONTEXTS['same-context']};
  const impossible=weekdayClassicalProof(input);assert.equal(impossible.supported,false);assert.equal(impossible.answer,null);assert.equal(impossible.equation,null);
  const unknown=weekdayClassicalProof({...input,contexts:{...PRESET_CONTEXTS['actual-yesterday'],question:2},worlds:[{id:0,today:6},{id:1,today:4},{id:2,today:0}]});assert.equal(unknown.supported,false);assert.equal(unknown.answer,null);
});
test('authored review skip bypasses only the review and leaves the applied derivation on the path',()=>{
  const skip=readerSkip(page,'notation');assert.equal(skip?.to,'nonmodal-proof');assert.match(skip!.scope,/조건문/);assert.match(skip!.scope,/후건 부정/);
  const reader=createRelatedReader(page);reader.setState({sceneId:skip!.to});reader.next();assert.equal(reader.getState().sceneId,'contexts');assert.equal(readerSkip(page,'inference'),null);
  for(const to of ['notation','inference','missing'])assert.throws(()=>readerSkip({...page,scenes:page.scenes.map(scene=>scene.id==='notation'?{...scene,skip:{to,label:'복습'}}:scene)},'notation'));
});
