/** Bounded illustrative propositional proof search, not a complete theorem prover. */
export const LIMITS = Object.freeze({premises: 8, characters: 512, tokens: 128, depth: 16, nesting: 32, steps: 64});
export const RULES = Object.freeze([
  ['premise', '전제'], ['and-elimination', '∧ 제거'], ['modus-ponens', '→ 제거 (전건 긍정)'],
  ['contradiction', '모순 도출'], ['explosion', '⊥ 제거 (폭발)'],
  ['and-introduction', '∧ 도입 (목표 식)'], ['or-introduction', '∨ 도입 (목표 식)'],
].map(([id, label]) => Object.freeze({id, label})));
export const LIMITATIONS = Object.freeze([
  '유한한 전방 추론 예시입니다. 결과가 없더라도 목표의 거짓이나 일반적인 증명 불가능성을 뜻하지 않습니다.',
  '∧ 제거, → 제거, 모순 도출, ⊥ 제거와 목표 식의 ∧·∨ 도입만 사용합니다. → 도입과 ∨ 경우 나누기는 지원하지 않습니다.',
  '전제는 현실의 진릿값 판정이 아니라 이 추론에 사용하는 가정입니다.',
]);

function checkDepth(depth) {
  if (depth > LIMITS.depth) throw new RangeError(`Formula depth exceeds ${LIMITS.depth}`);
}

export function parseFormula(input) {
  if (typeof input !== 'string') throw new TypeError('Formula must be a string');
  if (input.length > LIMITS.characters) throw new RangeError('Formula is too long');
  const tokens = [];
  let offset = 0;
  while (offset < input.length) {
    if (/\s/.test(input[offset])) { offset++; continue; }
    const rest = input.slice(offset);
    const atom = /^[A-Z][A-Z0-9_]*/.exec(rest);
    if (atom) { tokens.push(atom[0]); offset += atom[0].length; }
    else if (rest.startsWith('->')) { tokens.push('→'); offset += 2; }
    else {
      const symbol = input[offset++];
      const mapped = {'!': '¬', '~': '¬', '&': '∧', '|': '∨'}[symbol] ?? symbol;
      if (!['¬', '∧', '∨', '→', '(', ')', '⊥'].includes(mapped)) {
        throw new SyntaxError(`Unsupported symbol at position ${offset}`);
      }
      tokens.push(mapped);
    }
    if (tokens.length > LIMITS.tokens) throw new RangeError('Formula has too many tokens');
  }
  let cursor = 0;
  const binary = (type, left, right) => ({type, left, right});
  const checkNesting = depth => {
    if (depth > LIMITS.nesting) throw new RangeError('Formula syntax nesting is too deep');
  };
  function primary(depth) {
    checkNesting(depth);
    const token = tokens[cursor++];
    if (token === '¬') return {type: 'not', operand: primary(depth + 1)};
    if (token === '(') {
      const node = implication(depth + 1);
      if (tokens[cursor++] !== ')') throw new SyntaxError('Expected closing parenthesis');
      return node;
    }
    if (token === '⊥') return {type: 'bottom'};
    if (token && /^[A-Z][A-Z0-9_]*$/.test(token)) return {type: 'atom', name: token};
    throw new SyntaxError('Expected an uppercase atom, negation or parenthesized formula');
  }
  function conjunction(depth) {
    let node = primary(depth);
    while (tokens[cursor] === '∧') { cursor++; node = binary('and', node, primary(depth)); }
    return node;
  }
  function disjunction(depth) {
    let node = conjunction(depth);
    while (tokens[cursor] === '∨') { cursor++; node = binary('or', node, conjunction(depth)); }
    return node;
  }
  function implication(depth) {
    const left = disjunction(depth);
    if (tokens[cursor] !== '→') return left;
    cursor++;
    checkNesting(depth + 1);
    return binary('implies', left, implication(depth + 1));
  }
  const ast = implication(1);
  if (cursor !== tokens.length) throw new SyntaxError('Unexpected token after formula');
  formatFormula(ast); // Also bound the depth of left-associated operator chains.
  return ast;
}

export function formatFormula(ast) {
  function format(node, depth) {
    checkDepth(depth);
    if (!node || typeof node !== 'object') throw new TypeError('Invalid formula AST');
    if (node.type === 'atom' && typeof node.name === 'string' && /^[A-Z][A-Z0-9_]*$/.test(node.name)) return node.name;
    if (node.type === 'bottom') return '⊥';
    if (node.type === 'not') return `¬${format(node.operand, depth + 1)}`;
    const operators = {and: '∧', or: '∨', implies: '→'};
    if (!Object.hasOwn(operators, node.type)) throw new TypeError('Unsupported formula AST');
    const symbol = operators[node.type];
    return `(${format(node.left, depth + 1)} ${symbol} ${format(node.right, depth + 1)})`;
  }
  return format(ast, 1);
}

export function deriveProof({premises, goal, maxSteps = LIMITS.steps} = {}) {
  if (!Array.isArray(premises)) throw new TypeError('Premises must be an array');
  if (premises.length > LIMITS.premises) throw new RangeError(`At most ${LIMITS.premises} premises are supported`);
  if (!Number.isInteger(maxSteps) || maxSteps < 1 || maxSteps > LIMITS.steps) throw new RangeError('Invalid proof step limit');
  // Parse everything before producing any proof; untrusted text is never executed.
  const parsed = premises.map(parseFormula);
  const target = parseFormula(goal);
  const goalFormula = formatFormula(target);
  const lines = [];
  const known = new Map();
  let limitReached = false;
  function add(ast, rule, dependencies = []) {
    const formula = formatFormula(ast);
    if (known.has(formula)) return known.get(formula);
    if (lines.length >= maxSteps) { limitReached = true; return null; }
    const entry = {ast, id: `line-${lines.length + 1}`, formula, rule, dependsOn: dependencies.map(line => line.id)};
    known.set(formula, entry);
    lines.push(entry);
    return entry;
  }
  parsed.forEach(ast => add(ast, 'premise'));
  function introduceGoal(ast) {
    const existing = known.get(formatFormula(ast));
    if (existing) return existing;
    if (ast.type === 'and') {
      const left = introduceGoal(ast.left);
      const right = introduceGoal(ast.right);
      if (left && right) return add(ast, 'and-introduction', [left, right]);
    } else if (ast.type === 'or') {
      const side = introduceGoal(ast.left) ?? introduceGoal(ast.right);
      if (side) return add(ast, 'or-introduction', [side]);
    }
    return null;
  }
  let changed = true;
  while (changed && !limitReached && !known.has(goalFormula)) {
    const count = lines.length;
    for (const line of [...lines]) {
      const ast = line.ast;
      if (ast.type === 'and') {
        add(ast.left, 'and-elimination', [line]);
        add(ast.right, 'and-elimination', [line]);
      }
      if (ast.type === 'implies') {
        const antecedent = known.get(formatFormula(ast.left));
        if (antecedent) add(ast.right, 'modus-ponens', [line, antecedent]);
      }
      if (ast.type === 'not') {
        const positive = known.get(formatFormula(ast.operand));
        if (positive) add({type: 'bottom'}, 'contradiction', [positive, line]);
      }
    }
    const bottom = known.get('⊥');
    if (bottom) add(target, 'explosion', [bottom]);
    introduceGoal(target);
    changed = count !== lines.length;
  }
  const goalReached = known.has(goalFormula);
  return {
    lines: lines.map(({ast, ...line}) => line), goal: goalFormula, goalReached,
    exhausted: !goalReached && !limitReached, limitReached,
    limitations: [...LIMITATIONS],
  };
}
