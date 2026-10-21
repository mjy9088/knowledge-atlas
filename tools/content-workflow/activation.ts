export {};
const address = new URL(process.env['OPENCODE_WORKFLOW_URL'] ?? 'http://127.0.0.1:4096');
if (!['127.0.0.1', 'localhost', '[::1]'].includes(address.hostname)) {
  throw new TypeError('Workflow activation checks require a loopback OpenCode server');
}
const password = process.env['OPENCODE_SERVER_PASSWORD'];
const username = process.env['OPENCODE_SERVER_USERNAME'] ?? 'opencode';
const headers = new Headers();
if (password) headers.set('Authorization', `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`);
async function names(endpoint: string): Promise<readonly string[]> {
  const url = new URL(endpoint, address);
  url.searchParams.set('directory', process.cwd());
  const response = await fetch(url, {headers, signal: AbortSignal.timeout(10000)});
  if (!response.ok) throw new TypeError(`OpenCode registry check failed: HTTP ${response.status}`);
  const value: unknown = await response.json();
  if (!Array.isArray(value)) throw new TypeError('Invalid OpenCode registry response');
  return value.flatMap((item: unknown) => typeof item === 'object' && item !== null && 'name' in item && typeof item.name === 'string' ? [item.name] : []);
}
const commands = await names('/command');
const agents = await names('/agent');
const skills = await names('/skill');
const required = ['atlas-improve', 'atlas-review', 'atlas-resume'];
const ready = required.every(name => commands.includes(name)) && agents.includes('atlas-reviewer') && skills.includes('atlas-workflow');
console.log(JSON.stringify({ready, directory: process.cwd(), commands: required.filter(name => commands.includes(name)), reviewer: agents.includes('atlas-reviewer'), skill:skills.includes('atlas-workflow')}, null, 2));
if (!ready) process.exitCode = 1;
