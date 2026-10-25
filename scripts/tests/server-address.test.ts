import test from 'node:test';
import assert from 'node:assert/strict';
import {bindHost, serverURL} from '../server-address.js';

test('bind addresses accept explicit interfaces and produce usable IPv6 URLs', () => {
  assert.equal(bindHost('localhost'), '127.0.0.1');
  assert.equal(bindHost('100.66.142.4'), '100.66.142.4');
  assert.equal(bindHost('0.0.0.0'), '0.0.0.0');
  assert.equal(bindHost('::1'), '::1');
  assert.equal(serverURL('::1', 4173), 'http://[::1]:4173');
  assert.equal(serverURL('100.66.142.4', 4173), 'http://100.66.142.4:4173');
});

test('invalid bind addresses fail before being used in a listener or saved record', () => {
  for (const value of ['', 'https://100.66.142.4', '127.0.0.1:4173', 'example.com', '100.999.1.1', ' 127.0.0.1', '127.0.0.1\n']) {
    assert.throws(() => bindHost(value), /Host must be/);
  }
});
