import test from 'node:test';
import assert from 'node:assert/strict';
import {createPresentationStore} from '../presentation-state.js';

test('presentation positions restore atomically and remain detached',()=>{
  // Given two deterministic sequences with independent positions.
  const store=createPresentationStore({opening:900,proof:1200});
  store.seek('opening',450);store.seek('proof',800);
  const saved=store.getState();
  // When the store changes and the saved state is restored.
  store.reset();store.setState(saved);
  // Then every position returns without sharing mutable state.
  assert.deepEqual(store.getState(),{version:1,positions:{opening:450,proof:800}});
});

test('invalid presentation restoration leaves every position unchanged',()=>{
  // Given a valid current presentation snapshot.
  const store=createPresentationStore({opening:900});store.seek('opening',300);
  const before=store.getState();
  // When an unknown sequence or out-of-range time is restored.
  assert.throws(()=>store.setState({version:1,positions:{opening:400,missing:2}}));
  assert.throws(()=>store.setState({version:1,positions:{opening:901}}));
  // Then validation happened before mutation.
  assert.deepEqual(store.getState(),before);
});
