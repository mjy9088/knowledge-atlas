import {renderDoors, switchingArrow, doorDrawing} from './monty-visuals.js';
import {MAX_TRIALS} from '/packages/models/possibility-lab.js';
import {renderMontyTree, renderPairedSampling} from './monty-probability.js';
import type {Scene} from '/packages/content/types.js';
import {mountPossibilityLab} from './possibility-lab.js';
import {DOORS, otherDoors, informedCase, openingRound, type Door} from '/content/statistics/monty-hall/scenarios.js';

const storyScenes = new Set(['question', 'tie-rule', 'informed-tree', 'sampling', 'reveal', 'case-hit', 'case-miss-a', 'case-miss-b', 'strategy', 'blind-rule', 'blind-paths', 'blind-keep-hit', 'blind-keep-miss', 'compare']);
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
    return renderDoors(choice, opened, prize, selectable, lab.getState().processSelected);
  }


  function render() {
    const focused = story.contains(document.activeElement) && document.activeElement instanceof HTMLElement
      ? {door: document.activeElement.dataset.door, step: document.activeElement.dataset.sampleStep, action: document.activeElement.dataset.sampleAction} : undefined;
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
      content = doors(state.choice, row.opened, row.prize) + switchingArrow(row.choice, row.remaining);
      note = `가정: 상품이 ${row.prize}번에 있다면 · ${row.remaining}번으로 바꾸면 ${row.switchWins ? '상품을 얻습니다' : '꽝입니다'}.`;
    } else if (scene === 'strategy') {
      content = `<div class="monty-summary">${DOORS.map(prize => {
        const row = informedCase(state.choice, prize, state.seed);
        return `<p><strong>상품 ${prize}번</strong><span>${prize === state.choice ? '처음 맞음' : '처음 틀림'}</span><b class="monty-outcome" data-win="${row.switchWins}"><i aria-hidden="true">${row.switchWins ? '✓' : '×'}</i>${row.switchWins ? '바꾸면 상품' : '바꾸면 꽝'}</b></p>`;
      }).join('')}</div>`;
      note = `처음 선택 ${state.choice}번 · 같은 확률의 세 경우 중 두 경우에서 교환 승리: 2/3`;
    } else if (scene === 'tie-rule') {
      content = `<div class="monty-tie"><strong>가정: 고른 ${state.choice}번에 상품</strong><div>${otherDoors(state.choice).map(opened => `<p><span class="monty-tie-door">${doorDrawing(true,false)}</span>${opened}번 꽝 공개 <b>1/2</b></p>`).join('')}</div></div>`;
      note = '열 수 있는 두 꽝 문 사이에서는 선호 없이 고릅니다.';
    } else if (scene === 'informed-tree') {
      content = renderMontyTree(state.choice, 'informed');
      note = '상품 위치 → 공개 문 · 경로의 확률은 가지의 확률을 곱합니다.';
    } else if (scene === 'sampling') {
      content = renderPairedSampling(state, lab.inspect().playing);
    } else if (scene === 'blind-rule') {
      content = `<div class="monty-rule"><strong>처음 선택 ${state.choice}번은 열지 않습니다.</strong><span>${otherDoors(state.choice).join('번 또는 ')}번 중 하나를 각각 1/2의 확률로 엽니다.</span><span>문제의 조건: 꽝이 열린 뒤의 승률을 구합니다.</span></div>`;
    } else {
      content = renderMontyTree(state.choice, 'blind', scene === 'blind-keep-hit' ? 'hit' : scene === 'blind-keep-miss' ? 'miss' : 'all', scene !== 'blind-paths');
      note = scene === 'compare' ? '꽝이 열린 네 경우 중 교환 승리: 2/4 = 1/2' : scene === 'blind-keep-miss' ? '상품 공개는 문제의 ‘꽝이 열렸다’는 조건과 다릅니다.' : '상품 배치와 문 공개를 합친, 같은 확률의 경우입니다.';
    }
    const html = `${scene === 'question' ? '' : `<p class="monty-choice-context">처음 고른 문: ${state.choice}번</p>`}${content}${note ? `<p class="monty-story-note" role="status">${note}</p>` : ''}`;
    if (scene === 'sampling' && story.querySelector('.monty-sampler')) {
      // Playback updates results while keeping touch and keyboard targets mounted.
      const template = document.createElement('template');
      template.innerHTML = html;
      for (const selector of ['.monty-choice-context', '.monty-sample-total', '.monty-sample-cards', '.monty-pool', '.monty-sample-note']) {
        story.querySelector(selector)!.replaceWith(template.content.querySelector(selector)!);
      }
      const nextButtons = [...template.content.querySelectorAll<HTMLButtonElement>('.monty-sample-controls button')];
      story.querySelectorAll<HTMLButtonElement>('.monty-sample-controls button').forEach((button, index) => {
        button.disabled = nextButtons[index].disabled;
        if (button.textContent !== nextButtons[index].textContent) button.textContent = nextButtons[index].textContent;
      });
    } else story.innerHTML = html;
    if (focused) {
      const buttons = [...story.querySelectorAll<HTMLButtonElement>('button')];
      buttons.find(button => focused.door ? button.dataset.door === focused.door : focused.step ? button.dataset.sampleStep === focused.step : focused.action ? button.dataset.sampleAction === focused.action : false)?.focus({preventScroll: true});
    }
  }

  story.addEventListener('click', event => {
    const button = event.target instanceof Element ? event.target.closest<HTMLButtonElement>('button') : null;
    if (!button) return;
    if (scene === 'question' && button.dataset.door) {
      lab.setState({...lab.getState(), choice: Number(button.dataset.door), count: 0, revealed: false, processSelected: true});
    } else if (scene === 'sampling') {
      const state = lab.getState();
      if (button.dataset.sampleStep) {
        const step = Number(button.dataset.sampleStep);
        if (![1, 100, 1000].includes(step)) return;
        lab.setState({...state, count: Math.min(MAX_TRIALS, state.count + step), stage: 3, revealed: true});
      } else if (button.dataset.sampleAction === 'clear') {
        lab.setState({...state, count: 0, revealed: false});
      } else if (button.dataset.sampleAction === 'new') {
        lab.setState({...state, seed: (state.seed + 1) >>> 0, count: 0, revealed: false, processSelected: true});
      } else if (button.dataset.sampleAction === 'play') {
        laboratory.querySelector<HTMLButtonElement>('[data-action="play"]')!.click();
        render();
      }
    }
  });

  document.addEventListener('visibilitychange', () => { if (document.hidden) render(); });

  return {
    getState: lab.getState,
    validateState: lab.validateState,
    setState(value: unknown) { lab.setState(value); render(); },
    reset() { lab.reset(); render(); },
    seek(ms: number) { lab.seek(ms); render(); },
    setActive(value: boolean) { lab.setActive(value && (scene === 'experiment' || scene === 'sampling')); if (!value) render(); },
    suggest(suggestion?: Scene['suggestion']) {
      const next = suggestion && 'example' in suggestion ? suggestion.example : '';
      if (next !== scene) lab.setActive(false);
      scene = next;
      lab.suggest({example: scene === 'experiment' || scene === 'sampling' ? 'strategy' : scene});
      render();
    },
    inspect() {
      const info = lab.inspect();
      return {...info, available: storyScenes.has(scene) || scene === 'experiment', customized: scene === 'experiment' && info.customized};
    },
    describe(current: Scene) { return lab.describe({...current, id: 'strategy'}); },
  };
}
