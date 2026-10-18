import test from 'node:test';
import assert from 'node:assert/strict';
import {paginateCatalog} from '../packages/content/catalog-pagination.js';

test('catalog pagination assigns one hundred entries to bounded pages exactly once',()=>{
  // Given
  const entries=Array.from({length:100},(_,index)=>`article-${index+1}`);

  // When
  const pages=paginateCatalog(entries);

  // Then
  assert.equal(pages.length,9);
  assert.ok(pages.every((page,index)=>page.length===(index===8?4:12)));
  assert.deepEqual(pages.flat(),entries);
  assert.equal(new Set(pages.flat()).size,entries.length);
});

test('catalog pagination preserves a readable empty page for an empty catalog',()=>{
  // Given
  const entries:readonly string[]=[];

  // When
  const pages=paginateCatalog(entries);

  // Then
  assert.deepEqual(pages,[[]]);
});
