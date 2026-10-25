import test from 'node:test';
import assert from 'node:assert/strict';
import {renderRelatedPage, validateRelatedPages} from '../related-site.js';
import type {Article, ContentCollection, ContentPage} from '../../content/types.js';

const article: Article = {
  id: 'article:placement', title: 'Placement fixture', conceptId: 'concept:placement',
  reviewStatus: 'needs-content-review', relatedConcepts: [],
  blocks: [{id: 'block:placement', text: 'Worked explanation.', claimRefs: []}],
};
const collection: ContentCollection = {id: 'collection:placement', reviewStatus: 'needs-content-review', sourceSnapshotVerified: false, articles: [article]};
const page: ContentPage = {
  slug: 'placement', articleId: article.id, label: article.title, category: 'fixture',
  interactive: 'monty-hall',
  navigation: {chapters: [{kind: 'mainline', id: 'argument', title: 'Argument', sceneIds: ['question']}], relatedArticleIds: []},
  scenes: [{id: 'question', title: 'Question', block: 0, from: 0, cards: [], known: 'Worked reasoning'}],
};

test('authored experiment placement changes actual reading order while retaining one state-owning workbench', () => {
  for (const placement of [undefined, 'after-explanation'] as const) {
    const html = renderRelatedPage({...page, workbenchPlacement: placement}, collection, [], []);
    const explanation = html.indexOf('id="reader-scenes"');
    const workbench = html.indexOf('id="reader-workbench"');
    assert.equal(explanation < workbench, placement === 'after-explanation');
    assert.equal(html.match(/id="reader-workbench"/g)?.length, 1);
    assert.ok(html.includes('Worked explanation.'));
    assert.ok(html.indexOf('id="reader-controls"') > Math.max(explanation, workbench));
  }
});

test('explanation-first placement requires a chaptered interactive page', () => {
  const placed = {...page, workbenchPlacement: 'after-explanation' as const};
  assert.deepEqual(validateRelatedPages(collection, [], [placed]), []);
  for (const invalid of [{...placed, navigation: undefined}, {...placed, interactive: undefined}]) {
    assert.ok(validateRelatedPages(collection, [], [invalid]).some(error => error.includes('Workbench placement requires')));
  }
});
