import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
import {DISCOVERY_ENTRIES,DISCOVERY_PAGES} from '../catalog.js';
import {validateRelatedPages} from '../../../packages/site/related-site.js';
import {loadSiteContent} from '../../../scripts/build-site.js';

const contentRoot = new URL('../', import.meta.url);
const workspaceRoot = new URL('../../../', import.meta.url);

async function readJson(path: string): Promise<unknown> {
  return JSON.parse(await readFile(new URL(path, contentRoot), 'utf8'));
}

async function readJsonArray(path: string): Promise<readonly unknown[]> {
  const value = await readJson(path);
  assert.ok(Array.isArray(value));
  return value;
}

test('physics discovery entries provide bounded narration plans for every scene', async () => {
  // Given the registered discovery entries, when each quality record is checked against its page identity.
  const qualityRecords = await Promise.all(DISCOVERY_ENTRIES.map(async entry => ({
    entry,
    quality: await readJson(`${entry.directory.split('/').at(-1)}/quality.json`),
  })));

  // Then every scene is timed exactly once within the short-format ceiling.
  for (const {entry, quality} of qualityRecords) {
    assert.ok(typeof quality === 'object' && quality !== null);
    const page=DISCOVERY_PAGES.find(item=>item.articleId===entry.articleId);assert.ok(page);
    assert.ok('articleId' in quality && quality.articleId === entry.articleId);
    assert.ok('seriesId' in quality && quality.seriesId === 'series:physics-discovery');
    assert.ok('narration' in quality && typeof quality.narration === 'object' && quality.narration !== null);
    assert.ok('status' in quality.narration && quality.narration.status === 'planned');
    assert.ok('seconds' in quality.narration && typeof quality.narration.seconds === 'number' && quality.narration.seconds <= 180);
    assert.ok('segments' in quality.narration && Array.isArray(quality.narration.segments));
    assert.ok('review' in quality && typeof quality.review === 'object' && quality.review !== null && 'status' in quality.review && quality.review.status === 'review-required');
    let plannedSeconds = 0;
    const sceneIds = quality.narration.segments.map(segment => {
      assert.ok(typeof segment === 'object' && segment !== null && 'sceneId' in segment && 'seconds' in segment && typeof segment.seconds === 'number');
      plannedSeconds += segment.seconds;
      return segment.sceneId;
    });
    assert.deepEqual(sceneIds, page.scenes.map(scene => scene.id));
    assert.equal(plannedSeconds, quality.narration.seconds);
  }
});

test('physics discovery claims resolve only to supplied local source records', async () => {
  // Given the canonical source registry and every registered topic claim set.
  const sources: unknown = JSON.parse(await readFile(new URL('sources/registry.json', workspaceRoot), 'utf8'));
  assert.ok(Array.isArray(sources));
  const sourceIds = new Set(sources.map(source => {
    assert.ok(typeof source === 'object' && source !== null && 'id' in source);
    return source.id;
  }));

  // When collecting every claim-level source reference.
  const claims = (await Promise.all(DISCOVERY_ENTRIES.map(entry =>
    readJsonArray(`${entry.directory.split('/').at(-1)}/${entry.claims}`)
  ))).flat();
  assert.ok(claims.every(claim => typeof claim === 'object' && claim !== null && 'sourceRefs' in claim));

  // Then no reference depends on an unprovided registry record.
  for (const claim of claims) {
    if (typeof claim !== 'object' || claim === null || !('sourceRefs' in claim) || !Array.isArray(claim.sourceRefs)) continue;
    for (const reference of claim.sourceRefs) {
      assert.ok(typeof reference === 'object' && reference !== null && 'sourceId' in reference);
      assert.ok(sourceIds.has(reference.sourceId));
    }
  }
});

test('physics discovery pages cover topic prose and claim ownership without dangling references', async () => {
  // Given the actual content collection and claims consumed by the site.
  const site = await loadSiteContent();
  assert.deepEqual(validateRelatedPages(site.collection, site.claims), []);

  // When each discovery page is checked with its topic-owned article and claims.
  for (const entry of DISCOVERY_ENTRIES) {
    const topic = entry.directory.split('/').at(-1);
    assert.ok(topic);
    const article = await readJson(`${topic}/${entry.article}`);
    const claims = await readJsonArray(`${topic}/${entry.claims}`);
    const page=DISCOVERY_PAGES.find(item=>item.articleId===entry.articleId);assert.ok(page);
    assert.ok(typeof article === 'object' && article !== null && 'id' in article && article.id === entry.articleId);
    assert.ok('blocks' in article && Array.isArray(article.blocks));
    const claimIds = new Set(claims.map(claim => {
      assert.ok(typeof claim === 'object' && claim !== null && 'id' in claim);
      return claim.id;
    }));

    // When checking page and block references against topic ownership.
    for (const claimId of page.claimRefs ?? []) assert.ok(claimIds.has(claimId));
    for (const block of article.blocks) {
      assert.ok(typeof block === 'object' && block !== null && 'claimRefs' in block && Array.isArray(block.claimRefs));
      for (const claimId of block.claimRefs) assert.ok(claimIds.has(claimId));
    }

  }
});
