import {familyObservation, montyObservation} from '/packages/models/finite-observations.js';
import type {LabState} from '/packages/models/possibility-lab.js';

type ProbabilityTopic = 'monty-hall' | 'two-children';
type LedgerRow = {
  readonly id: string;
  readonly label: string;
  readonly target: boolean;
  readonly prior: number;
  readonly likelihood: number;
  readonly mass: number;
  readonly posterior: number;
};
type LedgerView = {
  readonly title: string;
  readonly context: string;
  readonly event: string;
  readonly target: string;
  readonly caseHeading: string;
  readonly rows: readonly LedgerRow[];
  readonly numerator: number;
  readonly denominator: number;
  readonly posterior: number;
};

const FRACTIONS = [
  [0, '0'], [1 / 8, '1/8'], [1 / 6, '1/6'], [1 / 4, '1/4'],
  [1 / 3, '1/3'], [1 / 2, '1/2'], [2 / 3, '2/3'], [3 / 4, '3/4'], [1, '1'],
] as const;

function fraction(value: number): string {
  return FRACTIONS.find(([candidate]) => Math.abs(candidate - value) < Number.EPSILON * 4)?.[1]
    ?? value.toLocaleString('ko-KR', {maximumFractionDigits: 4});
}

export function probabilityEquation(view: LedgerView): string {
  return `${fraction(view.numerator)} ÷ ${fraction(view.denominator)} = ${fraction(view.posterior)}`;
}

function familyMode(state: LabState): 'filter' | 'child' {
  switch (state.mode) {
    case 'filter': return 'filter';
    case 'child': return 'child';
    case 'informed':
    case 'blind': throw new TypeError('Family ledger requires a family observation mode');
  }
}

function montyMode(state: LabState): 'informed' | 'blind' {
  switch (state.mode) {
    case 'informed': return 'informed';
    case 'blind': return 'blind';
    case 'filter':
    case 'child': throw new TypeError('Monty ledger requires a host observation mode');
  }
}

export function probabilityLedgerView(topic: ProbabilityTopic, state: LabState): LedgerView {
  if (topic === 'two-children') {
    const rows = familyObservation(familyMode(state)).map(row => ({
      id: row.family,
      label: row.family,
      target: row.family === 'BB',
      prior: row.prior,
      likelihood: row.likelihood,
      mass: row.mass,
      posterior: row.posterior,
    }));
    const denominator = rows.reduce((total, row) => total + row.mass, 0);
    const numerator = rows.filter(row => row.target).reduce((total, row) => total + row.mass, 0);
    return {
      title: state.mode === 'filter' ? '가족에게 질문하는 경우' : '아이 한 명을 골라 관측하는 경우',
      context: '행 표기 순서: 첫째 아이, 둘째 아이 · B 아들 / G 딸',
      event: state.mode === 'filter' ? '보고 사건: 적어도 한 명이 아들' : '보고 사건: 균등하게 고른 아이가 아들',
      target: '목표: 두 아이가 모두 아들(BB)', caseHeading: '가족 구성', rows, numerator, denominator,
      posterior: numerator / denominator,
    };
  }

  const model = montyObservation(montyMode(state));
  const otherDoors = [1, 2, 3].filter(door => door !== state.choice);
  const prior = 1 / 3;
  const rows = ([1, 2, 3] as const).map(canonicalPrize => {
    const actualDoor = canonicalPrize === 1 ? state.choice : otherDoors[canonicalPrize - 2];
    if (actualDoor === undefined) throw new TypeError('Initial choice must leave two doors');
    const mass = model.rows.filter(row => row.prize === canonicalPrize).reduce((total, row) => total + row.mass, 0);
    return {
      id: `door-${actualDoor}`,
      label: `${actualDoor}번 문에 상품`,
      target: canonicalPrize !== 1,
      prior,
      likelihood: mass / prior,
      mass,
      posterior: mass / model.denominator,
    };
  }).sort((left, right) => left.label.localeCompare(right.label, 'ko-KR'));
  const numerator = rows.filter(row => row.target).reduce((total, row) => total + row.mass, 0);
  return {
    title: `처음 고른 문 ${state.choice}번 · ${state.mode === 'informed' ? '정답을 아는 진행자' : '정답을 모르는 진행자'}`,
    context: '공개할 수 있는 문이 둘이면 각각 1/2로 균등하게 고름',
    event: '관측 사건: 선택하지 않은 문 중 염소 문 하나가 열림 (문 번호는 조건이 아님)',
    target: '목표: 바꾸어서 상품을 얻음', caseHeading: '상품 위치', rows, numerator, denominator: model.denominator,
    posterior: model.switchProbability ?? 0,
  };
}

export function renderProbabilityLedger(container: HTMLElement, view: LedgerView, stage: number): void {
  const pending = '<span class="lab-pending" aria-label="아직 펼치지 않음">—</span>';
  const cell = (className: string, label: string, content: string) =>
    `<td class="${className}" data-label="${label}">${content}</td>`;
  container.dataset.stage = String(stage);
  container.innerHTML = `<header class="lab-ledger-head"><div><strong>${view.title}</strong><p>${view.context}</p><p class="lab-event">${view.event}</p></div><p>${view.target}</p></header>
    <div class="lab-ledger-guide"><strong>사전확률 × 보고 우도 = 남은 질량</strong><span>보고 우도: 이 경우가 참일 때 위 보고를 받을 확률 · 또 하나의 사전확률이 아님</span><span>남은 질량의 합 = 관측 뒤 분모</span></div>
    <table><caption>고정된 경우마다 관측 뒤 남는 확률 질량</caption><thead><tr><th scope="col">${view.caseHeading}</th><th scope="col">사전확률</th><th scope="col">보고 우도</th><th scope="col">남은 질량</th><th scope="col">정규화 무게</th></tr></thead>
    <tbody>${view.rows.map(row => `<tr data-case="${row.id}" data-target="${row.target}" data-retained="${row.mass > 0}"><th scope="row">${row.label}${row.target ? '<span>목표</span>' : ''}</th>${cell('lab-prior', '사전확률', stage >= 1 ? fraction(row.prior) : pending)}${cell('lab-likelihood', '보고 우도', stage >= 2 ? fraction(row.likelihood) : pending)}${cell('lab-mass', '남은 질량', stage >= 2 ? fraction(row.mass) : pending)}${cell('lab-posterior', '정규화 무게', stage >= 3 ? fraction(row.posterior) : pending)}</tr>`).join('')}</tbody></table>
    <footer class="lab-normalization" ${stage < 3 ? 'data-pending="true"' : ''}><span>남은 질량의 합 · 분모 <strong>${stage >= 3 ? fraction(view.denominator) : '—'}</strong></span><span>목표의 남은 질량 · 분자 <strong>${stage >= 3 ? fraction(view.numerator) : '—'}</strong></span><strong class="lab-equation">${stage >= 3 ? `정규화: ${probabilityEquation(view)}` : '마지막 단계에서 목표 질량을 분모로 나눕니다.'}</strong></footer>`;
}
