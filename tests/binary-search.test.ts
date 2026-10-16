import {test} from 'node:test';
import assert from 'node:assert/strict';
import {analyzeBinarySearch,worstCaseProbes} from '../packages/models/binary-search.js';

test('search finds every present target and rejects every missing integer in small arrays',()=>{
  for(let size=1;size<=64;size++)for(let target=1;target<=2*size+1;target++){
    const result=analyzeBinarySearch({size:String(size),target:String(target)});assert.ok(result.valid);
    const last=result.frames.at(-1)!;
    assert.equal(last.status,target%2===0?'found':'absent');
    if(last.status==='found')assert.equal(result.values[last.probe!],target);
    else assert.equal(last.remaining,0);
    assert.ok(last.comparisons<=worstCaseProbes(size));
    for(let i=1;i<result.frames.length;i++){
      const previous=result.frames[i-1],frame=result.frames[i];
      assert.ok(frame.probe!>=previous.low&&frame.probe!<=previous.high);
      if(frame.status!=='found')assert.ok(frame.remaining<=Math.floor(previous.remaining/2));
      if(target%2===0&&frame.status==='searching')assert.ok(frame.low<=target/2-1&&frame.high>=target/2-1);
    }
  }
});

test('large endpoint fixtures and exact worst case are independent of visual sampling',()=>{
  for(const [size,target,count]of [[1000,2000,10],[1000,2001,10],[1024,2048,11],[1,2,1],[1,1,1]]){
    const result=analyzeBinarySearch({size:String(size),target:String(target)});assert.ok(result.valid);
    assert.equal(result.values.length,size);assert.equal(result.frames.at(-1)!.comparisons,count);
  }
  assert.equal(worstCaseProbes(1000),10);assert.equal(worstCaseProbes(1024),11);
});

test('invalid and unsupported inputs provide no stale trace',()=>{
  for(const input of [{size:'',target:'2'},{size:'1.5',target:'2'},{size:'1025',target:'2'},{size:'0',target:'1'},{size:'10',target:'22'},{size:'10',target:'0'},{size:'10',target:'NaN'},{size:'1e2',target:'2'}]){
    const result=analyzeBinarySearch(input);assert.equal(result.valid,false);assert.deepEqual(result.frames,[]);
  }
  assert.throws(()=>worstCaseProbes(0));
});
