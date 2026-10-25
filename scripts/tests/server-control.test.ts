import test from 'node:test';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {mkdtemp, mkdir, copyFile, writeFile, readFile, rm, symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import net from 'node:net';

const execute = promisify(execFile);
const root = fileURLToPath(new URL('../../', import.meta.url));
const loader = fileURLToPath(import.meta.resolve('tsx'));

test('managed host changes, legacy state, persistence and invalid restart preserve process ownership', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'atlas-server-control-'));
  await mkdir(path.join(directory, 'scripts'));
  await writeFile(path.join(directory, 'package.json'), '{"type":"module"}');
  await symlink(path.join(root, 'node_modules'), path.join(directory, 'node_modules'));
  for (const name of ['server-control.ts', 'server-address.ts']) await copyFile(path.join(root, 'scripts', name), path.join(directory, 'scripts', name));
  // Minimal HTTP fixture isolates controller lifecycle from the article builder.
  await writeFile(path.join(directory, 'scripts/dev-server.ts'), `import http from 'node:http';
const host=process.env.HOST,port=Number(process.env.PORT);
http.createServer((req,res)=>res.end(host)).listen(port,host,()=>console.log('http://'+host+':'+port));
`);
  const reservation = net.createServer();
  await new Promise<void>(resolve => reservation.listen(0, '127.0.0.1', resolve));
  const address = reservation.address();
  if (!address || typeof address === 'string') throw new Error('Expected fixture port');
  const port = address.port;
  await new Promise<void>((resolve, reject) => reservation.close(error => error ? reject(error) : resolve()));
  const run = (action: string, host = '') => execute(process.execPath, ['--import', loader, path.join(directory, 'scripts/server-control.ts'), action, 'dev'], {env: {...process.env, HOST: host, PORT: String(port)}, timeout: 20_000});
  const stateFile = path.join(directory, '.local/servers/dev.json');
  try {
    assert.match((await run('start')).stdout, /http:\/\/127\.0\.0\.1:/);
    const legacy = JSON.parse(await readFile(stateFile, 'utf8')) as Record<string, unknown>;
    delete legacy.host;
    await writeFile(stateFile, JSON.stringify(legacy));
    assert.match((await run('status')).stdout, /http:\/\/127\.0\.0\.1:/);
    assert.match((await run('restart', '127.0.0.2')).stdout, /http:\/\/127\.0\.0\.2:/);
    assert.equal(await (await fetch(`http://127.0.0.2:${port}`)).text(), '127.0.0.2');
    const before = await readFile(stateFile, 'utf8');
    await assert.rejects(run('restart', 'not-an-ip'), /Host must be/);
    assert.equal(await readFile(stateFile, 'utf8'), before);
    assert.equal(await (await fetch(`http://127.0.0.2:${port}`)).text(), '127.0.0.2');
    assert.match((await run('start', '127.0.0.1')).stdout, /already running.*127\.0\.0\.2:/);
    assert.match((await run('restart')).stdout, /http:\/\/127\.0\.0\.2:/);
    assert.match((await run('status', '127.0.0.1')).stdout, /http:\/\/127\.0\.0\.2:/);
    assert.match((await run('stop', 'invalid-is-ignored-for-stop')).stdout, /stopped/);
    assert.match((await run('status')).stdout, /stopped/);
  } finally {
    await run('stop').finally(() => rm(directory, {recursive: true, force: true}));
  }
});
