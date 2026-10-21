import assert from 'node:assert/strict';
import test from 'node:test';
import {activationStatus,type ActivationRegistry} from '../activation-status.js';

const fixture:ActivationRegistry={
  commands:['atlas-improve','atlas-review','atlas-resume'],
  agents:[{name:'build',mode:'primary'},{name:'atlas-reviewer',mode:'subagent'}],
  skills:['atlas-workflow'],defaultAgent:'build',
};
test('registered commands are not ready when the configured default agent is missing',()=>{
  const status=activationStatus({...fixture,defaultAgent:'Sisyphus - ultraworker'});
  assert.equal(status.registered,true);assert.equal(status.ready,false);
});
test('a read-only reviewer cannot serve as the default author agent',()=>{
  const status=activationStatus({...fixture,defaultAgent:'atlas-reviewer'});
  assert.equal(status.ready,false);
});
test('a registered workflow with an available primary default satisfies runtime prerequisites',()=>{
  assert.equal(activationStatus(fixture).ready,true);
});
test('plugin-provided primary agents work without a stock build agent',()=>{
  const status=activationStatus({...fixture,defaultAgent:'Sisyphus - ultraworker',agents:[{name:'Sisyphus - ultraworker',mode:'primary'},{name:'atlas-reviewer',mode:'subagent'}]});
  assert.equal(status.ready,true);
});
