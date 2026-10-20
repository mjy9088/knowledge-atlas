import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {validateDocumentation} from '../documentation.js';

function fixture(run:(root:string,write:(name:string,text:string)=>void)=>void){
  const root=mkdtempSync(path.join(os.tmpdir(),'atlas-docs-'));
  const write=(name:string,text:string)=>{mkdirSync(path.dirname(path.join(root,name)),{recursive:true});writeFileSync(path.join(root,name),text);};
  try{run(root,write);}finally{rmSync(root,{recursive:true,force:true});}
}
const adr=(id:string)=>`# ADR ${id} — Example\n\n`+['Context','Project impact','Alternatives','Decision','Consequences'].map(title=>`## ${title}\n\nA meaningful statement.\n`).join('\n');

test('documentation links resolve from their owner, including encoded paths and repeated heading anchors',()=>fixture((root,write)=>{
  write('README.md','[Topic](content/a/README.md#example-1) [Space](<docs/with%20space.md>) [API](content/a/README.md#an-api) [External](https://example.invalid/no-fetch)');
  write('content/a/README.md','# Example\n\n# Example\n\n## An `API`\n\n[Home](../../README.md)');write('docs/with space.md','# Space');
  write('docs/adr/0001-example.md',adr('0001'));assert.deepEqual(validateDocumentation(root),[]);
  write('content/a/README.md','[Broken](missing.md) [Wrong anchor](../../README.md#absent)');
  const errors=validateDocumentation(root);assert.equal(errors.length,4);assert.ok(errors.some(e=>e.includes('missing local link target')));assert.ok(errors.some(e=>e.includes('missing Markdown anchor')));
}));

test('ADR validation rejects empty rationale, mismatched identity and reserved-number reuse',()=>fixture((root,write)=>{
  write('docs/adr/README.md','# Decisions\n\n| 0003 | historical identity |');
  write('docs/adr/0003-example.md',adr('0004').replace('## Alternatives\n\nA meaningful statement.','## Alternatives\n'));
  const errors=validateDocumentation(root);assert.equal(errors.length,3);assert.ok(errors.some(e=>e.includes('reused ADR identity')));assert.ok(errors.some(e=>e.includes('heading must match')));assert.ok(errors.some(e=>e.includes('section Alternatives')));
}));

test('documentation validation ignores fenced examples and rejects path escapes or malformed links',()=>fixture((root,write)=>{
  write('README.md','```md\n[Example](missing.md)\n```\n\n`[Inline](missing.md)`\n\n[Escape](../outside.md) [Encoding](%zz.md)');
  const errors=validateDocumentation(root);assert.equal(errors.length,2);assert.ok(errors.some(e=>e.includes('escapes repository')));assert.ok(errors.some(e=>e.includes('invalid link encoding')));
}));
