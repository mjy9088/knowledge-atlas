import {timingSafeEqual} from 'node:crypto';
import {readFileSync} from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {browserJavaScript} from '../../scripts/typescript.js';
import {QuestionStore} from './store.js';

type Tokens = {
  readonly admin: string;
  readonly answer: string;
};

const MAX_BODY_BYTES = 16_384;
const TOKEN_PATTERN = /^[A-Za-z0-9_-]{24,200}$/;
const HOST_PATTERN = /^(?:[A-Za-z0-9.-]+|\[[A-Fa-f0-9:]+\])(?::\d{1,5})?$/;

function secureEqual(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function validateTokens(tokens: Tokens): void {
  if (!TOKEN_PATTERN.test(tokens.admin) || !TOKEN_PATTERN.test(tokens.answer) || secureEqual(tokens.admin, tokens.answer)) {
    throw new TypeError('Distinct admin and answer tokens of at least 24 URL-safe characters are required');
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

async function readJson(req: http.IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    size += buffer.length;
    if (size > MAX_BODY_BYTES) throw new RangeError('Payload too large');
    chunks.push(buffer);
  }
  const value: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'));
  if (!isRecord(value)) throw new TypeError('Expected a JSON object');
  return value;
}

function requestOrigin(req: http.IncomingMessage, host: string): string {
  const forwarded = req.headers['x-forwarded-proto'];
  const scheme = typeof forwarded === 'string' && forwarded.split(',')[0]?.trim() === 'https' ? 'https' : 'http';
  return `${scheme}://${host}`;
}

export function createFeedbackServer(store: QuestionStore, tokens: Tokens): http.Server {
  validateTokens(tokens);
  return http.createServer(async (req, res) => {
    const json = (value: unknown, status = 200): void => {
      res.writeHead(status, {'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'});
      res.end(JSON.stringify(value));
    };
    try {
      const host = req.headers.host;
      if (!host || !HOST_PATTERN.test(host)) { json({error: 'Invalid host'}, 400); return; }
      const url = new URL(req.url ?? '/', `http://${host}`);
      const answerCapability = typeof req.headers['x-feedback-capability'] === 'string' && secureEqual(req.headers['x-feedback-capability'], tokens.answer);
      const adminCapability = req.headers.authorization === `Bearer ${tokens.admin}`;

      if (req.method === 'GET' && url.pathname === '/health') { json({ok: true}); return; }
      if (req.method === 'GET' && url.pathname === '/') {
        res.writeHead(200, {'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff'});
        res.end('Private question inbox\n\n질문/답변 페이지는 비공개 전체 링크로 열어 주세요.\n.local/README.md의 Answer URL에서 /a/ 뒤의 경로까지 포함해야 합니다.\n도메인 주소만으로는 질문을 읽거나 답변할 수 없습니다.\n\nOpen the complete private Answer URL in .local/README.md, including its /a/ path. This public entry does not grant access to questions.\n');
        return;
      }
      if (req.method === 'GET' && url.pathname === '/api/questions') {
        if (!adminCapability) { json({error: 'Unauthorized'}, 401); return; }
        json({questions: store.list()}); return;
      }
      if (req.method === 'GET' && url.pathname === '/api/public/questions') {
        if (!answerCapability) { json({error: 'Unauthorized'}, 401); return; }
        json({questions: store.list()}); return;
      }
      if (req.method === 'POST') {
        if (!req.headers['content-type']?.startsWith('application/json')) { json({error: 'JSON required'}, 415); return; }
        if (url.pathname === '/api/questions') {
          if (!adminCapability) { json({error: 'Unauthorized'}, 401); return; }
          const body = await readJson(req);
          if (typeof body.text !== 'string' || typeof body.optional !== 'boolean') throw new TypeError('Question text and optional flag are required');
          json(store.add({text: body.text, optional: body.optional}), 201); return;
        }
        if (url.pathname === '/api/public/answer') {
          if (!answerCapability) { json({error: 'Unauthorized'}, 401); return; }
          if (req.headers.origin !== requestOrigin(req, host)) { json({error: 'Cross-origin request rejected'}, 403); return; }
          const body = await readJson(req);
          if (typeof body.id !== 'string' || typeof body.answer !== 'string') throw new TypeError('Question ID and answer are required');
          json(store.answer(body.id, body.answer)); return;
        }
      }

      const staticAsset = url.pathname === '/style.css' ? ['style.css', 'text/css; charset=utf-8'] : url.pathname === '/app.js' ? ['app.ts', 'text/javascript; charset=utf-8'] : null;
      const pageCapability = url.pathname.startsWith('/a/') ? decodeURIComponent(url.pathname.slice(3)) : '';
      if (req.method === 'GET' && (staticAsset || secureEqual(pageCapability, tokens.answer))) {
        const asset = staticAsset ?? ['index.html', 'text/html; charset=utf-8'];
        const source = readFileSync(fileURLToPath(new URL(asset[0], import.meta.url)), 'utf8');
        const headers: Record<string, string> = {
          'Content-Type': asset[1],
          'Cache-Control': 'no-store',
          'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'",
          'Referrer-Policy': 'no-referrer',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
        };
        if (asset[0] === 'app.ts') headers['X-Content-Source'] = 'app.ts';
        res.writeHead(200, headers);
        res.end(asset[0] === 'app.ts' ? browserJavaScript(source, fileURLToPath(new URL(asset[0], import.meta.url))) : source); return;
      }
      json({error: 'Not found'}, 404);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid request';
      json({error: message}, error instanceof RangeError && message === 'Payload too large' ? 413 : 400);
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const directory = path.resolve(process.env.FEEDBACK_DATA_DIR ?? path.join(root, '.local/feedback'));
  const admin = process.env.FEEDBACK_ADMIN_TOKEN ?? '';
  const answer = process.env.FEEDBACK_ANSWER_TOKEN ?? '';
  const store = new QuestionStore(directory);
  if (store.list().length === 0) {
    store.add({text: 'Optional: Which emphasis would you prefer next: physics, numbers, or a balanced progression? If you skip this, work continues with a balanced progression.', optional: true});
  }
  const server = createFeedbackServer(store, {admin, answer});
  const port = Number(process.env.FEEDBACK_PORT ?? 4182);
  server.listen(port, '127.0.0.1', () => console.log(`Async questions: http://127.0.0.1:${port}/a/${answer}`));
  for (const signal of ['SIGTERM', 'SIGINT'] as const) process.on(signal, () => server.close(() => process.exit(0)));
}
