import type {Scene} from '/packages/content/types.js';
import {
  NUCLEAR_EVIDENCE_DURATION_MS,
  NUCLEAR_EVIDENCE_STEPS,
  createNuclearEvidenceCursor,
  nuclearEvidenceAvailability,
  nuclearEvidenceFrameAt,
  type NuclearEvidenceFrame,
} from '/packages/projection/nuclear-evidence.js';
import {createNuclearEvidenceDiagrams} from './nuclear-evidence-diagrams.js';

type NuclearEvidenceOptions = Readonly<{onChange?: () => void}>;

export function mountNuclearEvidence(container: HTMLElement, options: NuclearEvidenceOptions = {}) {
  const doc = container.ownerDocument;
  const make = <K extends keyof HTMLElementTagNameMap>(tag: K, text = '', className = '') => {
    const element = doc.createElement(tag);
    element.textContent = text;
    element.className = className;
    return element;
  };
  container.className = 'nuclear-evidence';
  const heading = make('div', '', 'nuclear-evidence-heading');
  heading.append(make('strong', 'α 조사에서 수소핵 방출까지'), make('span', '원본 장치 재현이 아닌 증거 구조 개념도'));
  const diagrams = createNuclearEvidenceDiagrams(doc);

  const status = make('p', '', 'nuclear-evidence-status'); status.setAttribute('role', 'status'); status.setAttribute('aria-live', 'polite');
  const stages = make('ol', '', 'nuclear-evidence-stages');
  for (const text of ['설정', '반응 영역', '관찰', '잠정 해석']) stages.append(make('li', text));
  const controls = make('nav', '', 'nuclear-evidence-controls'); controls.setAttribute('aria-label', '양성자 증거 과정 재생');
  const previous = make('button', '← 이전 단계'); previous.type = 'button';
  const play = make('button', '재생'); play.type = 'button';
  const next = make('button', '다음 단계 →'); next.type = 'button';
  const replay = make('button', '처음부터'); replay.type = 'button';
  const scrubLabel = make('label', '과정 위치', 'nuclear-evidence-scrub');
  const scrub = make('input'); scrub.type = 'range'; scrub.min = '0'; scrub.max = String(NUCLEAR_EVIDENCE_DURATION_MS); scrub.step = '100'; scrub.setAttribute('aria-label', '양성자 증거 과정 위치'); scrubLabel.append(scrub);
  controls.append(previous, play, next, replay, scrubLabel);
  const scope = make('p', '개념도 · 궤적·장치·축척 재현 아님 · 반응 세부는 1919년에 미해결', 'nuclear-evidence-scope');
  const history = make('p', '후대 Blackett의 증거가 반응 과정의 미해결 부분을 다뤘습니다.', 'nuclear-evidence-history');
  container.replaceChildren(heading, ...diagrams.map(diagram => diagram.root), stages, status, controls, scope, history);

  const cursor = createNuclearEvidenceCursor();
  const view = doc.defaultView;
  const reducedMotion = view?.matchMedia('(prefers-reduced-motion: reduce)').matches ?? false;
  let available = false;
  let active = true;
  let playing = false;
  let request = 0;
  let origin: number | null = null;

  const render = (frame: NuclearEvidenceFrame) => {
    container.dataset.stage = frame.stage;
    for (const diagram of diagrams) {
      diagram.alpha.style.setProperty('--nuclear-progress', String(frame.alphaProgress));
      diagram.hydrogen.style.setProperty('--nuclear-progress', String(frame.hydrogenProgress));
      diagram.description.textContent = `${frame.label}. ${frame.observation} 반응 세부는 확정하지 않은 개념도입니다.`;
    }
    scrub.value = String(frame.timeMs);
    status.textContent = `${frame.label} · ${frame.observation}`;
    [...stages.children].forEach((item, index) => item.setAttribute('aria-current', index === frame.stageIndex ? 'step' : 'false'));
    previous.disabled = frame.stageIndex === 0;
    next.disabled = frame.stageIndex === NUCLEAR_EVIDENCE_STEPS.length - 1;
    play.disabled = reducedMotion;
    play.textContent = reducedMotion ? '자동 재생 꺼짐' : playing ? '일시정지' : '재생';
  };
  const pause = () => {
    playing = false;
    origin = null;
    view?.cancelAnimationFrame(request);
    render(nuclearEvidenceFrameAt(cursor.getState().timeMs));
  };
  const tick = (now: number) => {
    if (!playing || !active || doc.hidden) { pause(); return; }
    origin ??= now - cursor.getState().timeMs;
    const frame = cursor.seek(now - origin);
    render(frame);
    if (frame.timeMs === NUCLEAR_EVIDENCE_DURATION_MS) pause();
    else request = view?.requestAnimationFrame(tick) ?? 0;
  };
  const notify = () => options.onChange?.();
  const seek = (timeMs: number) => { pause(); render(cursor.seek(timeMs)); notify(); };
  const step = (direction: -1 | 1) => {
    const index = nuclearEvidenceFrameAt(cursor.getState().timeMs).stageIndex;
    seek(NUCLEAR_EVIDENCE_STEPS[Math.max(0, Math.min(NUCLEAR_EVIDENCE_STEPS.length - 1, index + direction))] ?? 0);
  };
  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  play.addEventListener('click', () => {
    if (playing) { pause(); notify(); return; }
    if (cursor.getState().timeMs === NUCLEAR_EVIDENCE_DURATION_MS) cursor.reset();
    playing = true;
    render(nuclearEvidenceFrameAt(cursor.getState().timeMs));
    request = view?.requestAnimationFrame(tick) ?? 0;
    notify();
  });
  replay.addEventListener('click', () => {
    pause();
    const frame = cursor.reset();
    if (!reducedMotion) playing = true;
    render(frame);
    if (playing) request = view?.requestAnimationFrame(tick) ?? 0;
    notify();
  });
  scrub.addEventListener('input', () => seek(Number(scrub.value)));
  doc.addEventListener('visibilitychange', () => { if (doc.hidden) pause(); });
  render(cursor.reset());

  return {
    getState: cursor.getState,
    validateState(value: unknown) { createNuclearEvidenceCursor().setState(value); },
    setState(value: unknown) { const frame = cursor.setState(value); pause(); render(frame); notify(); },
    setActive(value: boolean) { active = value; if (!active) pause(); },
    suggest(suggestion?: Scene['suggestion']) { available = nuclearEvidenceAvailability(suggestion); if (!available) pause(); },
    reset() { pause(); render(cursor.reset()); notify(); },
    seek,
    inspect() { return {customized: false, available, playing, reducedMotion, frame: nuclearEvidenceFrameAt(cursor.getState().timeMs)}; },
    describe() { return {status: 'example', text: ''}; },
  };
}
