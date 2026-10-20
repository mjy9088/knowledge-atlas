import {test} from 'node:test';
import assert from 'node:assert/strict';
import {type LambdaInput,analyzeLambda,parseType,parseTerm,formatType,formatTerm} from '../typed-lambda.js';

function validAnalysis(input: LambdaInput){const result=analyzeLambda(input);assert.ok(result.valid, !result.valid?result.message:'Expected valid lambda expression');return result;}

test('lambda typing checks identity, implication elimination, composition and products',()=>{
  const fixtures=[
    [{term:'λx:A. x'},'A → A'],
    [{context:'f:A→B, a:A',term:'f a'},'B'],
    [{term:'λf:B→C. λg:A→B. λx:A. f (g x)'},'(B → C) → (A → B) → A → C'],
    [{context:'a:A, b:B',term:'<a,b>'},'A × B'],
    [{term:'λp:A*B. fst p'},'A × B → A'],
  ] as const;
  for(const [input,type]of fixtures){const result=validAnalysis(input);assert.equal(result.valid,true);assert.equal(result.type,type);}
  const goal=analyzeLambda({term:'λx:A. x',goal:'A→B'});assert.equal(goal.valid,true);assert.equal(goal.matches,false);
});
test('lambda evaluation substitutes, respects shadowing and avoids capture of open variables',()=>{
  const fixtures=[
    [{context:'a:A',term:'(λx:A. x) a'},'a'],
    [{context:'a:A, b:B',term:'fst <a,b>'},'a'],
    [{context:'y:A',term:'(λx:A. λy:B. x) y'},'λy_1:B. y'],
    [{context:'a:A',term:'(λx:A. λx:B. x) a'},'λx:B. x'],
  ] as const;
  for(const [input,last]of fixtures){const result=validAnalysis(input);assert.equal(result.valid,true);assert.equal(result.trace.at(-1)!.term,last);assert.equal(validAnalysis({...input,term:last}).type,result.type);}
});
test('lambda traces preserve type in every step and stop at normal form',()=>{
  const input={context:'a:A',term:'(λf:A→A. λx:A. f (f x)) (λz:A. z) a'};
  const result=validAnalysis(input);assert.equal(result.type,'A');assert.equal(result.trace.at(-1)!.term,'a');assert.equal(result.truncated,false);
  for(const row of result.trace)assert.equal(validAnalysis({...input,term:row.term}).type,'A');
  const underBinder=validAnalysis({term:'λa:A. (λx:A. x) a'});assert.equal(underBinder.trace.at(-1)!.term,'λa:A. a');
});
test('lambda parser has right-associative arrows, product precedence and printing round trips',()=>{
  assert.deepEqual(parseType('A→B→C'),{kind:'arrow',from:{kind:'atom',name:'A'},to:{kind:'arrow',from:{kind:'atom',name:'B'},to:{kind:'atom',name:'C'}}});
  for(const source of ['(A→B)*C','A*(B*C)','(A*B)*C','(A→B)→C','A*(B→C)'])assert.deepEqual(parseType(formatType(parseType(source))),parseType(source));
  for(const source of ['λx:A. x','(λx:A. x) (f a)','fst <a,b>','f (g a)'])assert.deepEqual(parseTerm(formatTerm(parseTerm(source))),parseTerm(source));
});
test('lambda rejects malformed input, unsupported terms and type errors without stale traces',()=>{
  for(const input of [{term:'λx:A. x x'},{context:'f:A→B, b:B',term:'f b'},{term:'unknown'},{term:'λx:A.'},{term:'fst (λx:A. x)'},{context:'a:A,a:B',term:'a'},{context:'a:A,',term:'a'},{term:'eval("secret")'},{term:'a'.repeat(513)}]){
    const result=analyzeLambda(input);assert.equal(result.valid,false,JSON.stringify(input));assert.deepEqual(result.rows,[]);assert.deepEqual(result.trace,[]);
  }
});
