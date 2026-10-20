import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync, rmSync,renameSync,writeFileSync} from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {createFeedbackServer} from '../server.js';
import {QuestionStore} from '../store.js';

const TOKENS = {admin: 'admin-test-token-with-enough-entropy', answer: 'answer-test-token-with-enough-entropy'} as const;

async function listen(server: http.Server): Promise<string> {
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  return `http://127.0.0.1:${address.port}`;
}

async function close(server: http.Server): Promise<void> {
  await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
}

test('QuestionStore persists IDs, status, answers, and timestamps across restart', () => {
  // Given
  const directory = mkdtempSync(path.join(os.tmpdir(), 'atlas-feedback-store-'));
  try {
    const store = new QuestionStore(directory, () => '2026-10-18T12:00:00.000Z', () => 'q_persisted');

    // When
    store.add({text: 'Which direction should we prioritize?', optional: false});
    store.answer('q_persisted', 'Prioritize the numerical intuition first.');
    const restored = new QuestionStore(directory);

    // Then
    assert.deepEqual(restored.list(), [{
      id: 'q_persisted',
      text: 'Which direction should we prioritize?',
      optional: false,
      status: 'answered',
      answer: 'Prioritize the numerical intuition first.',
      createdAt: '2026-10-18T12:00:00.000Z',
      updatedAt: '2026-10-18T12:00:00.000Z',
      answeredAt: '2026-10-18T12:00:00.000Z',
    }]);
    assert.match(readFileSync(path.join(directory, 'questions.json'), 'utf8'), /q_persisted/);
  } finally {
    rmSync(directory, {recursive: true, force: true});
  }
});

test('HTTP API separates authenticated lead access from answer-only capability access', async () => {
  // Given
  const directory = mkdtempSync(path.join(os.tmpdir(), 'atlas-feedback-http-'));
  const store = new QuestionStore(directory, () => '2026-10-18T12:00:00.000Z', () => 'q_http');
  const server = createFeedbackServer(store, TOKENS);
  const url = await listen(server);
  try {
    // When
    const unauthorized = await fetch(`${url}/api/questions`);
    const answerAsAdmin = await fetch(`${url}/api/questions`,{headers:{Authorization:`Bearer ${TOKENS.answer}`}});
    const answerCreatesQuestion = await fetch(`${url}/api/questions`,{method:'POST',headers:{Authorization:`Bearer ${TOKENS.answer}`,'Content-Type':'application/json'},body:JSON.stringify({text:'Not allowed',optional:true})});
    const created = await fetch(`${url}/api/questions`, {
      method: 'POST',
      headers: {'Authorization': `Bearer ${TOKENS.admin}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({text: '<b>Choose depth</b>', optional: true}),
    });
    const publicList = await fetch(`${url}/api/public/questions`, {headers: {'X-Feedback-Capability': TOKENS.answer}});
    const answered = await fetch(`${url}/api/public/answer`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Origin': url, 'X-Feedback-Capability': TOKENS.answer},
      body: JSON.stringify({id: 'q_http', answer: '<script>balanced</script>'}),
    });

    // Then
    assert.equal(unauthorized.status, 401);
    assert.equal(answerAsAdmin.status,401);
    assert.equal(answerCreatesQuestion.status,401);
    assert.equal(created.status, 201);
    assert.equal(publicList.status, 200);
    assert.equal(answered.status, 200);
    assert.equal(store.list()[0]?.answer, '<script>balanced</script>');
    const page = await (await fetch(`${url}/a/${TOKENS.answer}`)).text();
    assert.doesNotMatch(page, /<b>Choose depth<\/b>/);
    assert.doesNotMatch(page, /<script>balanced<\/script>/);
  } finally {
    await close(server);
    rmSync(directory, {recursive: true, force: true});
  }
});

test('failed persistence cannot change the live answer or add a volatile question',()=>{
  const directory=mkdtempSync(path.join(os.tmpdir(),'atlas-feedback-failure-'));
  let nextId=0;
  const store=new QuestionStore(directory,()=>new Date(0).toISOString(),()=>`q_${++nextId}`);
  store.add({text:'Keep this answer durable',optional:true});
  const previous=store.list();
  renameSync(directory,directory+'-saved');writeFileSync(directory,'not a directory');
  try{
    assert.throws(()=>store.answer('q_1','Cannot persist'));
    assert.throws(()=>store.add({text:'Cannot persist',optional:true}));
    assert.deepEqual(store.list(),previous);
  }finally{
    rmSync(directory);renameSync(directory+'-saved',directory);
    rmSync(directory,{recursive:true,force:true});
  }
});

test('answer endpoint rejects cross-origin and oversized writes without changing persisted state', async () => {
  // Given
  const directory = mkdtempSync(path.join(os.tmpdir(), 'atlas-feedback-bounds-'));
  const store = new QuestionStore(directory, () => '2026-10-18T12:00:00.000Z', () => 'q_bounds');
  store.add({text: 'A bounded question', optional: false});
  const server = createFeedbackServer(store, TOKENS);
  const url = await listen(server);
  try {
    // When
    const send = (origin: string, answer: string) => fetch(`${url}/api/public/answer`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'Origin': origin, 'X-Feedback-Capability': TOKENS.answer},
      body: JSON.stringify({id: 'q_bounds', answer}),
    });
    const foreign = await send('https://foreign.invalid', 'foreign');
    const oversized = await send(url, 'x'.repeat(4_001));

    // Then
    assert.equal(foreign.status, 403);
    assert.equal(oversized.status, 400);
    assert.equal(store.list()[0]?.status, 'pending');
  } finally {
    await close(server);
    rmSync(directory, {recursive: true, force: true});
  }
});

test('browser application is compiled from TypeScript source before serving', async () => {
  // Given
  const directory = mkdtempSync(path.join(os.tmpdir(), 'atlas-feedback-browser-source-'));
  const server = createFeedbackServer(new QuestionStore(directory), TOKENS);
  const url = await listen(server);
  try {
    // When
    const response = await fetch(`${url}/app.js`);
    const source = await response.text();

    // Then
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('x-content-source'), 'app.ts');
    assert.doesNotMatch(source, /type Question =/);
  } finally {
    await close(server);
    rmSync(directory, {recursive: true, force: true});
  }
});

test('service root explains private access without exposing a capability or questions', async () => {
  // Given an inbox with a private question.
  const directory=mkdtempSync(path.join(os.tmpdir(),'atlas-feedback-entry-'));
  const store=new QuestionStore(directory);
  store.add({text:'Private editorial question',optional:true});
  const server=createFeedbackServer(store,TOKENS);
  const url=await listen(server);
  try{
    // When a respondent opens only the host or an invalid private path.
    const response=await fetch(url);
    const text=await response.text();
    const invalid=await fetch(`${url}/a/invalid-capability`);
    // Then the public entry is readable, without granting private access.
    assert.equal(response.status,200);
    assert.match(response.headers.get('content-type')??'',/^text\/plain/);
    assert.equal(response.headers.get('cache-control'),'no-store');
    assert.equal(response.headers.get('location'),null);
    for(const secret of [TOKENS.admin,TOKENS.answer,store.list()[0].text])assert.ok(!text.includes(secret));
    assert.equal(invalid.status,404);
  }finally{
    await close(server);
    rmSync(directory,{recursive:true,force:true});
  }
});
