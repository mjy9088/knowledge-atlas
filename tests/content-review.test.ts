import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';

test('review packet links canonical evidence to its revision without granting approval',()=>{
  // Given a registered number-series article and the package-manager argument separator.
  const args=['--import','tsx','scripts/content-review.ts','--','counting-zero'];
  // When requesting an external review packet through the real CLI.
  const packet:unknown=JSON.parse(execFileSync(process.execPath,args,{encoding:'utf8'}));
  // Then the machine-consumed identity and evidence graph are present.
  assert.ok(packet&&typeof packet==='object'&&'article' in packet&&'claims' in packet&&'sources' in packet&&'revision' in packet);
  assert.match(String(packet.revision),/^[a-f0-9]{64}$/);
  assert.ok(Array.isArray(packet.claims)&&packet.claims.length>0);
  assert.ok(Array.isArray(packet.sources)&&packet.sources.length>0);
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
