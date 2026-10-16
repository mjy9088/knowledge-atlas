import {transformSync} from 'esbuild';

// Source files use emitted .js specifiers; both servers and the static builder
// share this transform so browsers never execute TypeScript syntax.
export function browserJavaScript(source: string, filename: string): string {
  return transformSync(source, {
    loader: 'ts', format: 'esm', target: 'es2022', sourcefile: filename,
    legalComments: 'inline', charset: 'utf8',
  }).code;
}
