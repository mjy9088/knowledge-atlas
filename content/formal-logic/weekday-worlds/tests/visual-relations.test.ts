import test from 'node:test';
import assert from 'node:assert/strict';
import {RELATION_EXAMPLES} from '../../../../apps/web/topics/formal-reasoning/weekday-relation-patterns.js';
import {modalFrameSystems} from '../../../../packages/models/modal-frame-systems.js';

test('each illustrated relation satisfies its named condition without equating B and S5 or requiring universal access',()=>{
  for(const [name,example]of Object.entries(RELATION_EXAMPLES)){
    const value=modalFrameSystems(example.ids,{evaluationWorld:0,access:example.edges});
    assert.equal(value.systems[name as keyof typeof value.systems],true,name);
  }
  const b=RELATION_EXAMPLES.B,s5=RELATION_EXAMPLES.S5;
  assert.equal(modalFrameSystems(b.ids,{evaluationWorld:0,access:b.edges}).transitive,false);
  assert.equal(modalFrameSystems(s5.ids,{evaluationWorld:0,access:s5.edges}).systems.S5,true);
  assert.ok(!s5.edges.some(([from,to])=>from===0&&to===2));
});
