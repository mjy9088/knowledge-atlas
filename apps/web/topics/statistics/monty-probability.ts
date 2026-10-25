import {MAX_TRIALS, type LabState} from '/packages/models/possibility-lab.js';
import {montyTree, pairedMontySample} from '/content/statistics/monty-hall/scenarios.js';

const fraction = (value: number) => value === 1 ? '1' : value === 1 / 2 ? '1/2' : value === 1 / 3 ? '1/3' : '1/6';

export function renderMontyTree(choice: number, mode: 'informed' | 'blind', filter: 'all' | 'hit' | 'miss' = 'all', markExcluded = false): string {
  const groups = montyTree(choice, mode).filter(group => filter === 'all' || (filter === 'hit' ? group.prize === choice : group.prize !== choice));
  return `<div class="monty-tree" data-branches="${groups.length}" data-mode="${mode}" aria-label="상품 위치에서 공개 문으로 갈라지는 가능성 트리"><p class="monty-tree-root">처음 선택 ${choice}번</p><ol class="monty-tree-level">${groups.map(group => `<li class="monty-tree-branch" data-prize="${group.prize}"><div class="monty-tree-prize"><strong>상품 ${group.prize}번</strong><span>1/3 · ${group.prize === choice ? '처음 맞음' : '처음 틀림'}</span></div><ol class="monty-tree-leaves">${group.paths.map(path => `<li class="monty-tree-path" data-opened="${path.opened}" data-excluded="${markExcluded && !path.accepted}" data-accepted="${path.accepted}" data-win="${path.switchWins}"><span>${path.opened}번 엶 (${fraction(path.chance)})</span><strong class="monty-path-mass">1/3×${fraction(path.chance)}=${fraction(path.mass)}</strong><b>${!path.accepted ? markExcluded ? '× 조건 밖' : '상품 공개' : path.switchWins ? '교환: 상품' : '교환: 꽝'}</b></li>`).join('')}</ol></li>`).join('')}</ol></div>`;
}

export function renderPairedSampling(state: LabState, playing: boolean): string {
  const sample = pairedMontySample(state);
  const active = playing && state.count < MAX_TRIALS;
  const number = (value: number) => value.toLocaleString('ko-KR');
  const width = (value: number) => sample.attempted ? value / sample.attempted * 600 : 0;
  const correctWidth = width(sample.initiallyCorrect), winWidth = width(sample.wrongRetained);
  const card = (mode: 'informed' | 'blind') => {
    const result = sample[mode];
    return `<section class="monty-sample-card" data-host="${mode}"><strong>${mode === 'informed' ? '알고 꽝 공개' : '모르고 무작위'}</strong><dl><div><dt>상품 공개</dt><dd data-stat="excluded">${number(result.attempted - result.accepted)}</dd></div><div><dt>꽝 공개</dt><dd data-stat="accepted">${number(result.accepted)}</dd></div><div><dt>교환 승</dt><dd data-stat="successes">${number(result.successes)}</dd></div></dl><p class="monty-sample-rate">${result.accepted ? `${number(result.successes)} / ${number(result.accepted)} = ${(result.successes / result.accepted * 100).toFixed(1)}%` : '남은 표본 없음'}</p></section>`;
  };
  return `<section class="monty-sampler" aria-label="두 진행자의 반복 뽑기 비교"><div class="monty-sample-controls">${[1, 100, 1000].map(step => `<button type="button" data-sample-step="${step}" ${sample.attempted >= MAX_TRIALS ? 'disabled' : ''}>+${number(step)}회</button>`).join('')}<button type="button" data-sample-action="play" ${sample.attempted >= MAX_TRIALS ? 'disabled' : ''}>${active ? '일시정지' : '반복 뽑기'}</button><button type="button" data-sample-action="clear">횟수 지우기</button><button type="button" data-sample-action="new">새 표본</button></div><p class="monty-sample-total" role="status">같은 상품 배치로 각각 <strong data-stat="attempted">${number(sample.attempted)}</strong>회 · 최대 ${number(MAX_TRIALS)}회</p><div class="monty-sample-cards">${card('informed')}${card('blind')}</div><div class="monty-pool"><strong>모르는 진행자의 전체 뽑기</strong><svg viewBox="0 0 600 18" role="img" aria-label="처음 맞음 ${sample.initiallyCorrect}회, 처음 틀렸지만 꽝 공개 ${sample.wrongRetained}회, 상품 공개로 제외 ${sample.excluded}회"><rect width="600" height="18" class="monty-pool-empty"/><rect width="${correctWidth}" height="18" class="monty-pool-correct"/><rect x="${correctWidth}" width="${winWidth}" height="18" class="monty-pool-win"/><rect x="${correctWidth + winWidth}" width="${width(sample.excluded)}" height="18" class="monty-pool-excluded"/></svg><p><span>처음 맞음 ${number(sample.initiallyCorrect)}</span> · <span>틀렸지만 남음 ${number(sample.wrongRetained)}</span> · <span>상품 공개로 제외 ${number(sample.excluded)}</span></p></div><p class="monty-sample-note">상품을 열어 빠진 것은 처음 틀렸던 게임입니다. 표본 승률은 흔들리며, 정확한 확률과 다릅니다.</p></section>`;
}
