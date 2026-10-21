import test from 'node:test';
import assert from 'node:assert/strict';
import {articlePath,parseKnowledgePath,scenePath} from '../scene-routing.js';

test('scene routes use one URL-safe segment beneath the article',()=>{
  // Given an article and scene identity that can be represented in a URL.
  // When their canonical paths are created.
  // Then the opening and first-class scene documents have stable trailing-slash URLs.
  assert.equal(articlePath('number-structures'),'/knowledge/number-structures/');
  assert.equal(scenePath('number-structures','rational-proof'),'/knowledge/number-structures/rational-proof/');
});

test('route parsing rejects encoded separators and unsafe identities',()=>{
  // Given requests crossing the static route trust boundary.
  // When valid and invalid routes are parsed.
  // Then only exact URL-safe article and scene segments are accepted.
  assert.deepEqual(parseKnowledgePath('/knowledge/number-structures/rational-proof/'),{slug:'number-structures',sceneId:'rational-proof'});
  assert.deepEqual(parseKnowledgePath('/knowledge/number-structures/'),{slug:'number-structures'});
  assert.equal(parseKnowledgePath('/knowledge/number-structures/rational%2Fproof/'),null);
  assert.throws(()=>scenePath('number-structures','evidence#panel'),RangeError);
});
