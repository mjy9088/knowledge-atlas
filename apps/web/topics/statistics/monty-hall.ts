import type {Scene} from '/packages/content/types.js';
import {mountPossibilityLab} from './possibility-lab.js';
import {DOORS, otherDoors, informedCase, openingRound, blindCases, type Door} from '/content/statistics/monty-hall/scenarios.js';

const storyScenes = new Set(['question', 'reveal', 'case-hit', 'case-miss-a', 'case-miss-b', 'strategy', 'blind-rule', 'blind-paths', 'blind-keep-hit', 'blind-keep-miss', 'compare']);
export function mountMontyHall(container: HTMLElement, options: {onChange?: () => void} = {}) {
  container.className = 'monty-reader';
  const story = document.createElement('section');
  story.className = 'monty-story';
  story.setAttribute('aria-label', '문 선택과 경우 비교');
  const laboratory = document.createElement('div');
  container.append(story, laboratory);
  let scene = '';
  const lab = mountPossibilityLab('monty-hall', laboratory, {onChange() { render(); options.onChange?.(); }});

  function doors(choice: number, opened?: Door, prize?: Door, selectable = false) {
    const state = lab.getState();
    return `<div class="monty-doors">${DOORS.map(value => {
      const chosen = value === choice && (!selectable || state.processSelected);
      const label = value === opened ? prize === opened ? '상품 공개' : '꽝 공개' : value === prize ? '상품' : '닫힌 문';
      const content = `<strong>${value}번</strong><span class="monty-door-face">${label}</span><span class="monty-door-tag">${chosen ? '내 선택' : value === opened ? '진행자가 엶' : ' '}</span>`;
      return selectable
        ? `<button type="button" class="monty-door" data-door="${value}" aria-label="${value}번 문 선택" aria-pressed="${chosen}">${content}</button>`
        : `<div class="monty-door" data-door="${value}" data-chosen="${chosen}" data-open="${value === opened}" data-prize="${value === prize}">${content}</div>`;
    }).join('')}</div>`;
  }

  function paths(filter: 'all' | 'hit' | 'miss', excluded: boolean) {
    const choice = lab.getState().choice;
    const rows = blindCases(choice).filter(row => filter === 'all' || (filter === 'hit' ? row.prize === choice : row.prize !== choice));
    return `<div class="monty-paths" aria-label="같은 확률의 공개 경우" >${rows.map(row => {
      const removed = excluded && !row.accepted;
      return `<article class="monty-path" data-prize="${row.prize}" data-opened="${row.opened}" data-excluded="${removed}"><strong>상품 ${row.prize}번</strong><span>${row.opened}번 문을 엶 → ${row.accepted ? '꽝' : '상품'}</span>${excluded ? `<b>${removed ? '× 상품 공개로 제외' : row.switchWins ? '✓ 남김 · 바꾸면 상품' : '✓ 남김 · 바꾸면 꽝'}</b>` : ''}</article>`;
    }).join('')}</div>`;
  }

  function render() {
    const focused = story.contains(document.activeElement) && document.activeElement instanceof HTMLElement ? document.activeElement.dataset.door : undefined;
    const state = lab.getState();
    story.hidden = !storyScenes.has(scene);
    laboratory.hidden = scene !== 'experiment';
    container.dataset.scene = scene;
    if (story.hidden) return;
    let content = '', note = '';
    if (scene === 'question') {
      content = doors(state.choice, undefined, undefined, true);
      note = state.processSelected ? `${state.choice}번 문을 골랐습니다. 다음으로 가 보세요.` : '고르지 않고 넘어가면 1번 문을 예시로 사용합니다.';
    } else if (scene === 'reveal') {
      const round = openingRound(state.choice, state.seed);
      content = doors(state.choice, round.opened);
      note = `${state.choice}번은 내 선택 · ${round.opened}번은 꽝 · 남은 문은 ${round.remaining}번입니다. ${state.processSelected ? '' : '1번을 고른 예시로 진행합니다.'}`;
    } else if (scene.startsWith('case-')) {
      const others = otherDoors(state.choice);
      const prize = scene === 'case-hit' ? state.choice : others[scene === 'case-miss-a' ? 0 : 1];
      const row = informedCase(state.choice, prize, state.seed);
      content = doors(state.choice, row.opened, row.prize);
      note = `가정: 상품이 ${row.prize}번에 있다면 · ${row.remaining}번으로 바꾸면 ${row.switchWins ? '상품을 얻습니다' : '꽝입니다'}.`;
    } else if (scene === 'strategy') {
      content = `<div class="monty-summary">${DOORS.map(prize => {
        const row = informedCase(state.choice, prize, state.seed);
        return `<p><strong>상품 ${prize}번</strong><span>${prize === state.choice ? '처음 맞음' : '처음 틀림'}</span><b>${row.switchWins ? '바꾸면 상품' : '바꾸면 꽝'}</b></p>`;
      }).join('')}</div>`;
      note = `처음 선택 ${state.choice}번 · 같은 확률의 세 경우 중 두 경우에서 교환 승리: 2/3`;
    } else if (scene === 'blind-rule') {
      content = `<div class="monty-rule"><strong>처음 선택 ${state.choice}번은 열지 않습니다.</strong><span>${otherDoors(state.choice).join('번 또는 ')}번 중 하나를 각각 1/2의 확률로 엽니다.</span><span>상품을 열 수도 있습니다.</span></div>`;
    } else {
      content = paths(scene === 'blind-keep-hit' ? 'hit' : scene === 'blind-keep-miss' ? 'miss' : 'all', scene !== 'blind-paths');
      note = scene === 'compare' ? '남은 네 경우 중 두 경우에서 교환 승리: 2/4 = 1/2' : '상품 배치와 문 공개를 합친, 같은 확률의 경우입니다.';
    }
    story.innerHTML = `${scene === 'question' ? '' : `<p class="monty-choice-context">처음 고른 문: ${state.choice}번</p>`}${content}<p class="monty-story-note" role="status">${note}</p>`;
    if (focused) story.querySelector<HTMLButtonElement>(`button[data-door="${focused}"]`)?.focus({preventScroll: true});
  }

  story.addEventListener('click', event => {
    const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('button[data-door]') : null;
    if (!button || scene !== 'question') return;
    lab.setState({...lab.getState(), choice: Number(button.dataset.door), count: 0, revealed: false, processSelected: true});
  });

  return {
    getState: lab.getState,
    validateState: lab.validateState,
    setState(value: unknown) { lab.setState(value); render(); },
    reset() { lab.reset(); render(); },
    seek(ms: number) { lab.seek(ms); render(); },
    setActive(value: boolean) { lab.setActive(value && scene === 'experiment'); },
    suggest(suggestion?: Scene['suggestion']) {
      scene = suggestion && 'example' in suggestion ? suggestion.example : '';
      lab.suggest({example: scene === 'experiment' ? 'strategy' : scene});
      render();
    },
    inspect() {
      const info = lab.inspect();
      return {...info, available: storyScenes.has(scene) || scene === 'experiment', customized: scene === 'experiment' && info.customized};
    },
    describe(current: Scene) { return lab.describe({...current, id: 'strategy'}); },
  };
}
