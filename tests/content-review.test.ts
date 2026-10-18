import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

test('review packet links canonical evidence to its revision without granting approval',()=>{
  // Given a registered number-series article and the package-manager argument separator.
  const args=['--import','tsx','scripts/content-review.ts','--','counting-zero'];
  // When requesting an external review packet through the real CLI.
  const packet:unknown=JSON.parse(execFileSync(process.execPath,args,{encoding:'utf8'}));
  // Then the machine-consumed identity and evidence graph are present.
  assert.ok(packet&&typeof packet==='object'&&'article' in packet&&'claims' in packet&&'sources' in packet&&'revision' in packet&&'resultContract' in packet);
  assert.match(String(packet.revision),/^[a-f0-9]{64}$/);
  assert.ok(Array.isArray(packet.claims)&&packet.claims.length>0);
  assert.ok(Array.isArray(packet.sources)&&packet.sources.length>0);
  assert.ok(packet.resultContract&&typeof packet.resultContract==='object'&&'revision' in packet.resultContract);
  assert.equal(packet.resultContract.revision,packet.revision);
});

test('review CLI rejects an unregistered topic rather than exporting a misleading empty packet',()=>{
  // Given an unknown route identifier.
  const slug='not-a-registered-topic';
  // When using the command surface.
  const result=spawnSync(process.execPath,['--import','tsx','scripts/content-review.ts',slug],{encoding:'utf8'});
  // Then it fails without writing a candidate packet.
  assert.equal(result.status,1);
  assert.equal(result.stdout,'');
});

test('review evidence includes the actual owned diagram bytes rather than only its unchanged URL',()=>{
  const expected=createHash('sha256').update(readFileSync(new URL('../content/number-systems/complex-numbers/figure-i-rotation.svg',import.meta.url))).digest('hex');
  const packet:unknown=JSON.parse(execFileSync(process.execPath,['--import','tsx','scripts/content-review.ts','complex-numbers'],{encoding:'utf8'}));
  assert.ok(packet&&typeof packet==='object'&&'representations'in packet&&Array.isArray(packet.representations));
  assert.ok(packet.representations.some((asset:unknown)=>asset&&typeof asset==='object'&&'src'in asset&&'sha256'in asset&&asset.src==='/content/number-systems/complex-numbers/figure-i-rotation.svg'&&asset.sha256===expected));
});
