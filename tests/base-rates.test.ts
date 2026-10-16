import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_BASE_RATES,evaluateBaseRates} from '../packages/models/base-rates.js';
const close=(actual:number,expected:number)=>assert.ok(Math.abs(actual-expected)<1e-9,`${actual} differs from ${expected}`);
test('fictional default counts distinguish detector sensitivity from posterior probability',()=>{
  const r=evaluateBaseRates(DEFAULT_BASE_RATES);
  close(r.trueAlerts,90);close(r.falseAlerts,495);close(r.missed,10);close(r.correctRejections,9405);
  close(r.alerts,585);close(r.probability!,90/585);assert.notEqual(r.probability,DEFAULT_BASE_RATES.sensitivity);
  close(r.trueAlerts+r.falseAlerts+r.missed+r.correctRejections,10000);
});
test('the posterior denominator contains all alerts and ignores the count scale',()=>{
  const input={prevalence:0.2,sensitivity:0.8,falseAlarmRate:0.1,population:100};
  const r=evaluateBaseRates(input);close(r.probability!,2/3);close(r.alerts,24);
  close(evaluateBaseRates({...input,population:1000}).probability!,r.probability!);
});
test('zero alerts make the conditional result unavailable, while valid boundary probabilities remain meaningful',()=>{
  for(const input of [{prevalence:0,sensitivity:0.9,falseAlarmRate:0},{prevalence:1,sensitivity:0,falseAlarmRate:0.5},{prevalence:0.5,sensitivity:0,falseAlarmRate:0}]){
    const r=evaluateBaseRates({...input,population:10000});assert.equal(r.alerts,0);assert.equal(r.probability,null);
  }
  assert.equal(evaluateBaseRates({...DEFAULT_BASE_RATES,prevalence:0}).probability,0);
  assert.equal(evaluateBaseRates({...DEFAULT_BASE_RATES,prevalence:1}).probability,1);
  assert.equal(evaluateBaseRates({...DEFAULT_BASE_RATES,falseAlarmRate:0}).probability,1);
});
test('increasing prevalence or sensitivity raises posterior; increasing false alarm rate lowers it',()=>{
  const result=(p:number,s:number,f:number)=>evaluateBaseRates({population:10000,prevalence:p,sensitivity:s,falseAlarmRate:f}).probability!;
  assert.ok(result(.1,.9,.05)>result(.01,.9,.05));
  assert.ok(result(.01,.95,.05)>result(.01,.8,.05));
  assert.ok(result(.01,.9,.1)<result(.01,.9,.01));
  close(result(.27,.4,.4),.27);
});
test('invalid inputs are rejected rather than clipped or treated as a previous result',()=>{
  for(const key of ['prevalence','sensitivity','falseAlarmRate'] as const)for(const value of [-.01,1.01,NaN,Infinity])assert.throws(()=>evaluateBaseRates({...DEFAULT_BASE_RATES,[key]:value}));
  for(const population of [0,1.5,1000001,NaN,Infinity])assert.throws(()=>evaluateBaseRates({...DEFAULT_BASE_RATES,population}));
});
