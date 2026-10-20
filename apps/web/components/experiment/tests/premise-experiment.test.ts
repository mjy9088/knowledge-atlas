import test from 'node:test';
import assert from 'node:assert/strict';
import {createPremiseExperiment,evaluateExperimentInput} from '../premise-editor.js';
import {createExplosionEpisode} from '../../../../../packages/projection/explosion.js';

test('custom inputs survive scene suggestions; explicit reset adopts the current suggestion',()=>{
  const experiment=createPremiseExperiment({suggestion:{premises:['P','¬P'],goal:'Q'}});
  assert.equal(experiment.inspect().proof!.goalReached,true);
  experiment.setState({premises:[{formula:'P',enabled:true},{formula:'¬P',enabled:false}],goal:'R'});
  assert.equal(experiment.inspect().proof!.goalReached,false);
  experiment.suggest({premises:['A','A → B'],goal:'B'});
  assert.equal(experiment.getState().goal,'R');assert.equal(experiment.inspect().proof!.goalReached,false);
  const saved=experiment.getState();experiment.reset();
  assert.equal(experiment.getState().customized,false);assert.equal(experiment.getState().goal,'B');
  assert.equal(experiment.inspect().proof!.goalReached,true);
  experiment.setState(saved);assert.equal(experiment.getState().goal,'R');
  assert.deepEqual(experiment.inspect().premises,['P']);
});
test('invalid drafts clear results and disabled malformed premises do not participate',()=>{
  const experiment=createPremiseExperiment({suggestion:{premises:['P','¬P'],goal:'Q'}});
  experiment.setState({premises:['P'],goal:'P →'});
  assert.equal(experiment.inspect().valid,false);assert.equal(experiment.inspect().proof,null);
  experiment.setState({premises:[{formula:'malformed',enabled:false},{formula:'A',enabled:true},{formula:'A -> B',enabled:true}],goal:'B'});
  assert.equal(experiment.inspect().valid,true);assert.deepEqual(experiment.inspect().premises,['A','A → B']);
  assert.equal(experiment.inspect().proof!.goalReached,true);
  assert.equal(experiment.getState().premises[0].formula,'malformed');
  assert.equal(evaluateExperimentInput({premises:[],goal:'Q'}).proof!.goalReached,false);
});
test('unsupported shapes reject without losing state and inspection copies cannot edit the model',()=>{
  const experiment=createPremiseExperiment({suggestion:{premises:['P'],goal:'P'}}),before=experiment.getState();
  for(const bad of [{premises:['P'],goal:2},{premises:Array(9).fill('P'),goal:'Q'},{premises:[{formula:'P',enabled:'yes'}],goal:'Q'},{premises:['P'],goal:'Q',customized:'yes'}]){
    assert.throws(()=>experiment.setState(bad as never));assert.deepEqual(experiment.getState(),before);
  }
  const detached=experiment.inspect();detached.input.premises[0].enabled=false;detached.proof!.lines.length=0;
  assert.equal(experiment.inspect().proof!.goalReached,true);assert.deepEqual(experiment.getState(),before);
});
test('projected checkbox and target states match every cue model, including the removed premise',()=>{
  for(const cue of createExplosionEpisode().cues){
    const state=cue.presentation!.controlState,result=evaluateExperimentInput(state!);
    assert.deepEqual(result.premises,cue.presentation.snapshot.premises);
    assert.deepEqual(result.proof,cue.presentation.snapshot.proof);
    assert.equal(result.goal,cue.presentation.goal);
  }
});
