import {isIP} from 'node:net';

export function bindHost(value: string): string {
  if (value === 'localhost') return '127.0.0.1';
  if (!isIP(value)) throw new TypeError('Host must be an IPv4 or IPv6 address, or localhost.');
  return value;
}

export function serverURL(host: string, port: number): string {
  return `http://${isIP(host) === 6 ? `[${host}]` : host}:${port}`;
}
