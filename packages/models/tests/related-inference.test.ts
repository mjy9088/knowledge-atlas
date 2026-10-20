import test from 'node:test';
import assert from 'node:assert/strict';
import {parseFormula} from '../propositional.js';
import {deriveFDE,evaluateFDE,deriveSetRelations,deriveCHConnections,parseSetStatement} from '../related-inference.js';
import {createPremiseExperiment} from '../../../apps/web/components/experiment/premise-editor.js';

test('FDE operators agree with the published T/B/N/F truth matrices (Sutcliffe et al., Table 1)',()=>{
  const order=[1,3,0,2],and=[[1,3,0,2],[3,3,2,2],[0,2,0,2],[2,2,2,2]],or=[[1,1,1,1],[1,3,1,3],[1,1,0,0],[1,3,0,2]],not=[2,3,0,1];
  for(let i=0;i<4;i++){
    assert.equal(evaluateFDE(parseFormula('¬P'),{P:order[i]}),not[i]);
    for(let j=0;j<4;j++)for(const [formula,matrix]of [['P ∧ Q',and],['P ∨ Q',or]] as [string,number[][]][])assert.equal(evaluateFDE(parseFormula(formula),{P:order[i],Q:order[j]}),matrix[i][j]);
  }
});
test('FDE supplies an actual countervaluation to explosion, while preserving conjunction elimination and disjunction introduction',()=>{
  const result=deriveFDE({premises:['P','¬P'],goal:'Q'}),witness=result.semantics!.counterexample!;
  assert.equal(result.goalReached,false);assert.ok(witness.premiseValues.every(value=>value&1));assert.equal(witness.goalValue&1,0);
  assert.equal(deriveFDE({premises:['P ∧ Q'],goal:'P'}).goalReached,true);
  assert.equal(deriveFDE({premises:['P'],goal:'P ∨ Q'}).goalReached,true);
  assert.equal(deriveFDE({premises:[],goal:'P ∨ ¬P'}).goalReached,false);
  assert.throws(()=>deriveFDE({premises:['P → Q'],goal:'Q'}));
  assert.throws(()=>deriveFDE({premises:['A','B','C','D','E'],goal:'F'}));
});
test('set relation derivations preserve truth on every assignment of three subsets of a two-element universe',()=>{
  const result=deriveSetRelations({premises:['X ∈ A','A ⊆ B','B ⊆ C','C ⊆ A'],goal:'A = C'});
  assert.equal(result.goalReached,true);
  for(let A=0;A<4;A++)for(let B=0;B<4;B++)for(let C=0;C<4;C++)for(let X=0;X<2;X++){
    const sets: Record<string,number>={A,B,C};
    const truth=(formula: string)=>{const s=parseSetStatement(formula);return s.op==='∈'?Boolean(sets[s.right]&(1<<X)):s.op==='⊆'?(sets[s.left]&~sets[s.right])===0:sets[s.left]===sets[s.right];};
    for(const line of result.lines){
      if(line.rule==='premise')continue;
      const premises=line.dependsOn.map(id=>result.lines.find(other=>other.id===id));
      if(premises.every(row=>truth(row!.formula)))assert.ok(truth(line.formula),line.formula);
    }
  }
  assert.equal(deriveSetRelations({premises:['A ⊆ B'],goal:'B ⊆ A'}).goalReached,false);
  assert.equal(deriveSetRelations({premises:['X ∈ A'],goal:'A = B'}).goalReached,false);
  assert.throws(()=>deriveSetRelations({premises:['P → Q'],goal:'Q'}));
});
test('CH meta-connections require their consistency premises and do not claim to decide CH',()=>{
  const result=deriveCHConnections({premises:['Con(ZFC)'],goal:'Ind(CH,ZFC)'});
  assert.equal(result.goalReached,true);assert.ok(result.registeredTheorems);
  for(const formula of ['Con(ZFC+CH)','Con(ZFC+¬CH)','ZFC ⊬ CH','ZFC ⊬ ¬CH'])assert.ok(result.lines.some(line=>line.formula===formula));
  assert.equal(deriveCHConnections({premises:[],goal:'Ind(CH,ZFC)'}).goalReached,false);
  assert.equal(deriveCHConnections({premises:['Con(ZFC)'],goal:'CH'}).goalReached,false);
  assert.equal(deriveCHConnections({premises:['Con(ZFC+CH)'],goal:'ZFC ⊬ CH'}).goalReached,false);
  assert.equal(deriveCHConnections({premises:['Con(ZFC+CH)'],goal:'ZFC ⊬ ¬CH'}).goalReached,true);
  assert.throws(()=>deriveCHConnections({premises:['anything'],goal:'CH'}));
});
test('shared experiment adapter keeps custom inputs and clears invalid results across distinct rule systems',()=>{
  for(const [derive,suggestion]of [[deriveFDE,{premises:['P','¬P'],goal:'Q'}],[deriveSetRelations,{premises:['X ∈ A','A ⊆ B'],goal:'X ∈ B'}],[deriveCHConnections,{premises:['Con(ZFC)'],goal:'Ind(CH,ZFC)'}]] as const){
    const experiment=createPremiseExperiment({derive,suggestion:{...suggestion,premises:[...suggestion.premises]}}),initial=experiment.inspect();
    experiment.setState({...experiment.getState(),goal:'(',customized:true});assert.equal(experiment.inspect().valid,false);assert.equal(experiment.inspect().proof,null);
    experiment.suggest({...suggestion,premises:[...suggestion.premises]});assert.equal(experiment.getState().goal,'(');
    experiment.reset();assert.deepEqual(experiment.inspect(),initial);
  }
});
