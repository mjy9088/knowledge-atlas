import assert from 'node:assert/strict';
import test from 'node:test';
import {physicsHistorySuggestion} from '../physics-history-suggestion.js';
import {CONTENT_PAGES} from '../../../../../content/catalog.js';
import {createHydrogenicField,validateOrbitalState} from '../../../../../packages/models/hydrogenic.js';

test('physics history resolves only its two orbital detour examples',()=>{
  assert.deepEqual(physicsHistorySuggestion({example:'orbital-density'}),{n:2,basis:'px',Z:1,mode:'cloud'});
  assert.deepEqual(physicsHistorySuggestion({example:'orbital-phase'}),{n:2,basis:'px',Z:1,mode:'slice'});
  assert.equal(physicsHistorySuggestion({example:'unrelated'}),undefined);
});

test('every registered physics-history example crosses the hydrogenic model boundary',()=>{
  // Given every example registered on the public physics-history page.
  const page=CONTENT_PAGES.find(candidate=>candidate.interactive==='physics-history');
  assert.ok(page);
  const suggestions=page.scenes.flatMap(scene=>scene.suggestion&&!('n' in scene.suggestion)?[scene.suggestion]:[]);
  assert.ok(suggestions.length>0);
  // When each adapter mapping is validated and used to construct its actual field.
  const fields=suggestions.map(suggestion=>{
    const resolved=physicsHistorySuggestion(suggestion);
    assert.ok(resolved&&'n' in resolved);
    const state=validateOrbitalState(resolved);
    return createHydrogenicField(state);
  });
  // Then all mapped examples expose validated model state rather than adapter-only literals.
  assert.deepEqual(fields.map(field=>field.state),suggestions.map(()=>({n:2,basis:'px',Z:1})));
});
