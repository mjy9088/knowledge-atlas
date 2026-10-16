# ADR 0016: TypeScript source with static JavaScript delivery

Status: accepted implementation decision, 2026-10-16.

## Decision

Use TypeScript for application components, scientific models, projections, content presentation metadata, Node scripts, local media tools, and tests. Keep canonical prose, claims and evidence in JSON. Enable strict project-wide checking; do not turn migration errors into unchecked modules or replace domain contracts with blanket `any` types.

Source imports use emitted `.js` specifiers. TypeScript resolves them to source `.ts` files; tsx executes the Node entry points, and the development server/static builder share esbuild's TypeScript transform for browser modules. The deployed site contains JavaScript, HTML, CSS and JSON and has no npm runtime dependencies. TypeScript, tsx, esbuild and Node declarations are development dependencies.

## Migration and verification

Create typed counterparts while retaining the JavaScript originals for comparison. Compare representative scientific model, geometry and timeline outputs, run unchanged scientific expectations through the TypeScript test runner, and test the actual generated browser modules. Retire original executable files only after these checks pass. Keep user changes outside the migration untouched.

Use explicit discriminated unions for syntax and evaluation results, shared content/state contracts, and concrete DOM types. Retain runtime checks at external input and saved-state boundaries: TypeScript does not validate JSON, URLs or user input at runtime and does not establish scientific correctness.

`pnpm typecheck` runs the strict check, and `pnpm check` and `pnpm build` include it. CI runs the same check before validation/model/browser tests. Existing routes, IDs, scientific assumptions and expected results are preserved.
