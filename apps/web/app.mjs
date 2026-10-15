import {createProofScene, PROOF_DURATION_MS} from './proof-scene.mjs';
import {mountSlideDeck} from './slide-deck.mjs';
import {displayFormula, bindFormulaInput} from './formula-display.mjs';
const $ = id => document.getElementById(id);
let timelineTime = null;
let scene;
function render(snapshot) {
  const {state, result} = snapshot;
  $('has-p').checked = state.hasP;
  $('has-not-p').checked = state.hasNotP;
  $('conclusion').value = state.conclusion;
  for (const [node, active] of [['p', state.hasP], ['not-p', state.hasNotP]]) {
    $(`node-${node}`).classList.toggle('unavailable', !active);
    $(`node-${node}-state`).textContent = active ? '전제 포함' : '전제에서 제외';
  }
  $('node-contradiction').classList.toggle('unavailable', !result.contradiction);
  $('node-conclusion').classList.toggle('unavailable', !result.contradiction);
  $('proof-diagram').classList.toggle('broken', !result.contradiction);
  $('diagram-conclusion').textContent = result.conclusion;
  $('contradiction-caption').textContent = result.contradiction ? '두 전제가 함께 있음' : '이 경로에서 도출 안 됨';
  $('conclusion-caption').textContent = result.contradiction ? '이 경로로 도출됨' : '이 경로에서 도출 안 됨';
  $('proof-diagram').setAttribute('aria-label', result.contradiction
    ? `전제 P와 ¬P에서 모순 ⊥을 얻고, ⊥ 제거로 ${result.conclusion}를 도출합니다.`
    : `전제 P ${state.hasP ? '포함' : '제외'}, 전제 ¬P ${state.hasNotP ? '포함' : '제외'}. 이 증명 경로는 구성되지 않습니다.`);
  const list = $('proof-steps');
  list.replaceChildren(...result.steps.map((step, index) => {
    const item = document.createElement('li');
    item.className = 'proof-step';
    item.dataset.semanticId = step.semanticId;
    for (const [className, value] of [['step-num', index + 1], ['step-symbol', step.symbol], ['step-rule', step.rule]]) {
      const span = document.createElement('span'); span.className = className; span.textContent = value; item.append(span);
    }
    return item;
  }));
  $('empty-proof').hidden = result.steps.length !== 0;
  $('proof-message').classList.toggle('active', result.contradiction);
  $('proof-message').textContent = result.contradiction
    ? `${result.conclusion}가 이 추론 규칙 아래에서 도출됩니다. ${result.conclusion}의 현실적 참을 판정한 것은 아닙니다.`
    : '이 모순 폭발 증명 경로는 구성되지 않습니다. 결론이 거짓이거나 다른 모든 증명도 불가능하다는 뜻은 아닙니다.';
  $('scene-time').value = timelineTime ?? 6000;
  const phase = timelineTime === null ? `직접 조작 · ${result.contradiction ? result.conclusion + ' 도출' : '이 경로 미구성'}` : `${timelineTime / 1000}초 · ${timelineTime < 6000 ? '전제 없이 시작' : timelineTime < 12000 ? '두 전제로 Q 도출' : timelineTime < 18000 ? '결론을 R로 변경' : timelineTime < 24000 ? '¬P 전제 제거' : 'P 전제 제거'}`;
  $('timeline-label').textContent = phase;
  $('scene-time').setAttribute('aria-valuetext', phase);
  window.__atlasInspection = snapshot;
}
scene = createProofScene({onChange: render});
for (const [id, key] of [['has-p', 'hasP'], ['has-not-p', 'hasNotP'], ['conclusion', 'conclusion']]) {
  $(id).addEventListener('change', () => {
    timelineTime = null;
    scene.setState({...scene.getState(), [key]: key === 'conclusion' ? $(id).value : $(id).checked});
  });
}
$('reset').addEventListener('click', () => {timelineTime = null; scene.reset();});
$('scene-time').max = PROOF_DURATION_MS;
$('scene-time').addEventListener('input', event => {timelineTime = Number(event.target.value); scene.seek(timelineTime);});
window.__atlasScenes = {proof: {...scene, setState(next) { timelineTime = null; scene.setState(next); }, reset() { timelineTime = null; scene.reset(); }, dispatch(action) { timelineTime = null; scene.dispatch(action); }, seek(timeMs) { const previous = timelineTime; timelineTime = Math.min(timeMs, PROOF_DURATION_MS); try { scene.seek(timeMs); } catch (error) { timelineTime = previous; throw error; } }}};
render(scene.getInspectionSnapshot());

function appendMetadata(parent, pairs) {
  for (const [label, value] of pairs) {
    const dt = document.createElement('dt'); dt.textContent = label;
    const dd = document.createElement('dd'); dd.textContent = value ?? '미기록'; parent.append(dt, dd);
  }
}
async function readJson(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`콘텐츠 응답 오류: ${response.status}`);
  return response.json();
}
async function populate() {
  try {
    const [data, concepts, relations, sources, originalClaims, inferenceClaims] = await Promise.all([
      readJson('/content/formal-logic/explosion/content.json'), readJson('/knowledge/concepts.json'),
      readJson('/knowledge/relations.json'), readJson('/sources/registry.json'), readJson('/content/formal-logic/explosion/claims.json'), readJson('/content/formal-logic/explosion/inference-claims.json')
    ]);
    const claims = [...originalClaims, ...inferenceClaims];
    $('article-title').textContent = data.title;
    $('article-summary').textContent = data.summary;
    $('intro-body').textContent = data.blocks.find(block => block.id === 'block:intro')?.text ?? '';
    $('limits-body').textContent = data.blocks.find(block => block.id === 'block:limits')?.text ?? '';
    const nav = $('concepts-nav'); nav.replaceChildren();
    const available = new Set([...data.conceptRefs, ...relations.filter(relation => relation.from === 'concept:logic.explosion').map(relation => relation.to)]);
    const selectConcept = concept => {
      $('concept-title').textContent = concept.title;
      $('concept-summary').textContent = concept.summary;
      for (const button of nav.children) button.setAttribute('aria-expanded', String(button.dataset.conceptId === concept.id));
    };
    for (const concept of concepts.filter(concept => available.has(concept.id))) {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'concept-link';
      button.textContent = concept.title; button.dataset.conceptId = concept.id;
      button.setAttribute('aria-controls', 'concept-summary'); button.setAttribute('aria-expanded', 'false');
      button.addEventListener('click', () => selectConcept(concept)); nav.append(button);
    }
    selectConcept(concepts.find(concept => concept.id === 'concept:logic.explosion'));
    $('source-list').replaceChildren(...sources.filter(source => data.sourceRefs.includes(source.id)).map(source => {
      const item = document.createElement('li'); item.dataset.sourceId = source.id;
      const link = document.createElement('a'); link.href = source.canonicalUrl; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = `${source.title} ↗`;
      const meta = document.createElement('dl'); meta.className = 'metadata';
      appendMetadata(meta, [['저자', source.author], ['기록된 판본 · 정밀 대조 대기', source.providerRevision], ['등록된 참조일', source.retrievedAt], ['원문 해시', source.contentHash ?? '미확보 · 정확한 스냅샷 대기'], ['등록된 라이선스 · 권리 검토 대기', source.license], ['권리 검토', source.rightsReview], ['자료 ID', source.id]]);
      item.append(link, meta); return item;
    }));
    $('claim-list').replaceChildren(...claims.map(claim => {
      const item = document.createElement('li'); item.dataset.claimId = claim.id;
      const statement = document.createElement('p'); statement.textContent = claim.statement;
      const meta = document.createElement('dl'); meta.className = 'metadata';
      appendMetadata(meta, [['주장 ID', claim.id], ['조건', claim.assumptions.join(' / ')], ['범위', claim.scope], ['근거 위치', claim.sourceRefs.map(ref => `${ref.sourceId} · ${ref.locator}`).join('; ')], ['검토 상태', claim.reviewStatus]]);
      item.append(statement, meta); return item;
    }));
    appendMetadata($('version-info'), [['콘텐츠 ID', data.id], ['콘텐츠 상태', `${data.status} · 공개 승인 대기`], ['장면 ID', data.sceneRefs.join(', ')], ['판본', '작업 중인 로컬 초안 · 공개 판본 미발행'], ['마지막 내용 검토', '완료된 검토 기록 없음'], ['원자료 동기화', '자동 동기화 미구현 · 참조일은 출처별 표시']]);
  } catch (error) {
    $('intro-body').textContent = '콘텐츠 자료를 읽지 못했습니다. 페이지를 새로고침해 주세요.';
    console.error(error);
  }
}
populate();
window.__atlasDeck = mountSlideDeck();
window.__atlasScenes.deck = window.__atlasDeck;


// The inference lab is a separate, bounded model; it does not alter Scene 1.
async function mountInferenceLab() {
  const [{deriveProof}, {mountInferenceVideo}, {mountInferenceVisual}] = await Promise.all([
    import('/packages/models/propositional.mjs'), import('./inference-video.mjs'), import('./inference-visual.mjs')
  ]);
  const video = mountInferenceVideo($('inference-video'));
  const visual = mountInferenceVisual($('inference-visual'));
  document.addEventListener('atlas:slidechange', event => {if (event.detail.slideId !== 'slide-video') video.pause();});
  const presets = {
    chain: {premises:['P', 'P -> Q', 'Q -> R'], goal:'R'},
    and: {premises:['P & Q'], goal:'Q'},
    explosion: {premises:['P', '!P'], goal:'R'},
    missing: {premises:['P -> Q'], goal:'Q'},
    andIntro: {premises:['P', 'Q'], goal:'P & Q'},
    orIntro: {premises:['P'], goal:'P | Q'}
  };
  const labels = {'premise':'전제', 'and-elimination':'∧ 제거', 'modus-ponens':'조건문 적용 (→ 제거)', 'contradiction':'모순 도출', 'explosion':'모순 제거 (폭발)', 'and-introduction':'∧ 도입', 'or-introduction':'∨ 도입'};
  let rowNumber = 0;
  let lastProof = null;
  let lastPremises = [];
  let inferenceStale = true;
  let activeStep = 0;
  let lastGoal = '';
  let autoAdvance = true;
  let stepTimer;
  function stopStepTimer() { clearTimeout(stepTimer); }
  function scheduleStep() {
    stopStepTimer();
    const finished = activeStep >= (lastProof?.lines.length ?? 0) - 1;
    $('inference-auto').textContent = finished ? '↺ 다시 보기' : autoAdvance ? 'Ⅱ 일시정지' : '▶ 이어 보기';
    if (!autoAdvance || inferenceStale || finished || $('slide-lab').hidden || document.hidden) return;
    stepTimer = setTimeout(() => {focusStep(activeStep + 1); scheduleStep();}, 2400);
  }
  function selectStep(index) { autoAdvance = false; stopStepTimer(); focusStep(index, true); scheduleStep(); }
  document.addEventListener('atlas:slidechange', scheduleStep);
  document.addEventListener('visibilitychange', scheduleStep);
  const editor = $('premise-editor');
  function refreshInput(event) {
    if (event?.isComposing) {
      invalidateInput('수식 입력 중입니다. 입력이 끝나면 자동으로 갱신됩니다.');
      return;
    }
    for (const button of $('inference-presets').children) button.setAttribute('aria-pressed', 'false');
    runInference();
  }
  function invalidateInput(message) {
    stopStepTimer();
    inferenceStale = true;
    video.invalidate(message);
    visual.invalidate(message);
    if (window.__atlasInference) window.__atlasInference = {...window.__atlasInference, stale: true};
    $('inference-status').textContent = message;
    $('inference-status').className = 'inference-status pending';
    $('inference-result').hidden = true;
  }
  function updateRowLimit() { $('add-premise').disabled = editor.children.length >= 8; }
  function addRow(value = '') {
    if (editor.children.length >= 8) return;
    const number = ++rowNumber;
    const row = document.createElement('div'); row.className = 'premise-row';
    const checkLabel = document.createElement('label'); checkLabel.className = 'premise-enabled';
    const check = document.createElement('input'); check.type = 'checkbox'; check.checked = true;
    check.setAttribute('aria-label', `전제 ${number} 포함`);
    const marker = document.createElement('span'); marker.textContent = '전제';
    checkLabel.append(check, marker);
    const input = document.createElement('input'); input.type = 'text'; input.value = displayFormula(value);
    input.autocomplete = 'off'; input.spellcheck = false; input.maxLength = 256;
    input.placeholder = '예: P → Q'; input.setAttribute('aria-label', `전제 ${number} 명제식`);
    input.setAttribute('aria-describedby', 'inference-syntax');
    const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'remove-premise';
    remove.textContent = '×'; remove.setAttribute('aria-label', `전제 ${number} 삭제`);
    remove.addEventListener('click', () => {row.remove(); updateRowLimit(); refreshInput(); $('add-premise').focus();});
    check.addEventListener('change', () => {row.classList.toggle('excluded', !check.checked); input.disabled = !check.checked; refreshInput();});
    bindFormulaInput(input); input.addEventListener('input', refreshInput); input.addEventListener('compositionend', refreshInput); row.append(checkLabel, input, remove); editor.append(row);
    updateRowLimit(); return input;
  }
  function focusStep(index, reveal = false) {
    if (!lastProof?.lines.length) return;
    activeStep = Math.max(0, Math.min(lastProof.lines.length - 1, index));
    const line = lastProof.lines[activeStep];
    visual.update({premises:lastPremises,goal:lastGoal,proof:lastProof,step:activeStep});
    for (const [position, row] of [...$('inference-lines').children].entries()) {
      row.classList.toggle('current-line', position === activeStep);
      row.classList.toggle('future-line', position > activeStep);
      row.classList.toggle('dependency-line', line.dependsOn.includes(lastProof.lines[position].id));
      row.firstElementChild.setAttribute('aria-current', position === activeStep ? 'step' : 'false');
    }
    const list = $('inference-lines');
    const selected = list.children[activeStep];
    const listBox = list.getBoundingClientRect(), selectedBox = selected.getBoundingClientRect();
    if (selectedBox.bottom > listBox.bottom) list.scrollTop += selectedBox.bottom - listBox.bottom;
    else if (selectedBox.top < listBox.top) list.scrollTop -= listBox.top - selectedBox.top;
    $('inference-prev').disabled = activeStep === 0;
    $('inference-next').disabled = activeStep === lastProof.lines.length - 1;
    $('inference-active-label').textContent = `${activeStep + 1} / ${lastProof.lines.length} 단계`;
    const refs = line.dependsOn.map(id => lastProof.lines.findIndex(candidate => candidate.id === id) + 1);
    $('inference-step-detail').textContent = refs.length
      ? `${activeStep + 1}행: ${refs.join('행, ')}행을 근거로 ${labels[line.rule] ?? line.rule} 규칙을 적용해 ${line.formula}를 얻습니다.`
      : `${activeStep + 1}행: ${line.formula}는 사용자가 포함한 전제입니다.`;
    if (reveal) {
      $('inference-result').scrollTop = 0;
      if (window.matchMedia('(min-width:721px)').matches) {
        $('inference-lab').scrollTop = 0;
        $('slide-lab').scrollTop = 0;
      } else $('inference-result').scrollIntoView({block:'start'});
    }
  }
  function renderProof(proof) {
    activeStep = 0;
    const list = $('inference-lines'); list.replaceChildren();
    proof.lines.forEach((line, index) => {
      const item = document.createElement('li'); item.dataset.lineId = line.id;
      const button = document.createElement('button'); button.type = 'button'; button.className = 'inference-line';
      const number = document.createElement('span'); number.className = 'inference-line-number'; number.textContent = index + 1;
      const formula = document.createElement('span'); formula.className = 'math inference-formula'; formula.textContent = line.formula;
      const rule = document.createElement('span'); rule.className = 'inference-rule';
      const deps = line.dependsOn.map(id => proof.lines.findIndex(candidate => candidate.id === id) + 1);
      rule.textContent = `${labels[line.rule] ?? line.rule}${deps.length ? ` · ${deps.join(', ')}행에서` : ''}`;
      button.append(number, formula, rule); button.addEventListener('click', () => selectStep(index));
      item.append(button); list.append(item);
    });
    $('inference-step-count').textContent = `${proof.lines.length}개 행 · 목표 ${lastGoal}`;
    $('inference-result').hidden = proof.lines.length === 0;
    $('inference-status').className = `inference-status ${proof.goalReached ? 'success' : 'pending'}`;
    $('inference-status').textContent = proof.goalReached
      ? `목표 ${proof.goal ?? lastGoal}에 도달했습니다. 아래 번호를 선택해 규칙과 근거를 살펴보세요. 현실의 진릿값을 판정한 결과는 아닙니다.`
      : `목표 ${proof.goal ?? lastGoal}의 증명을 이 탐색 범위에서 찾지 못했습니다. 목표가 거짓이거나 다른 증명도 불가능하다는 뜻은 아닙니다.${proof.limitReached ? ' 탐색 한도에 도달했습니다.' : ''}`;
    $('inference-limitations').textContent = Array.isArray(proof.limitations) ? proof.limitations.join(' ') : '';
    focusStep(0);
  }
  function runInference() {
    const premises = [...editor.children].filter(row => row.querySelector('input[type=checkbox]').checked).map(row => row.querySelector('input[type=text]').value.trim());
    const goal = $('inference-goal').value.trim();
    try {
      if (premises.some(premise => !premise)) throw new SyntaxError('포함된 전제에 명제식을 입력하거나 해당 전제를 제외해 주세요.');
      if (!goal) throw new SyntaxError('목표 명제식을 입력해 주세요.');
      const proof = deriveProof({premises, goal}); lastProof = proof; lastPremises = [...premises]; lastGoal = proof.goal ?? goal;
      renderProof(proof); video.update({premises, goal: lastGoal, proof});
      inferenceStale = false;
      window.__atlasInference = structuredClone({premises, goal: lastGoal, proof, stale: false});
      scheduleStep();
    } catch (error) {
      invalidateInput(`수식을 완성하면 자동으로 갱신됩니다. ${displayFormula(error.message)}`);
    }
  }
  function loadPreset(name) {
    const preset = presets[name]; if (!preset) return;
    editor.replaceChildren(); rowNumber = 0; preset.premises.forEach(value => addRow(value)); $('inference-goal').value = displayFormula(preset.goal);
    for (const button of $('inference-presets').children) button.setAttribute('aria-pressed', String(button.dataset.preset === name));
    runInference();
  }
  $('add-premise').addEventListener('click', () => {const input = addRow(); refreshInput(); input?.focus();});
  bindFormulaInput($('inference-goal')); $('inference-goal').addEventListener('input', refreshInput);
  $('inference-goal').addEventListener('compositionend', refreshInput);
  $('inference-form').addEventListener('submit', event => event.preventDefault());
  $('inference-prev').addEventListener('click', () => selectStep(activeStep - 1));
  $('inference-next').addEventListener('click', () => selectStep(activeStep + 1));
  $('inference-auto').addEventListener('click', () => {
    if (activeStep >= lastProof.lines.length - 1) {focusStep(0); autoAdvance = true;}
    else autoAdvance = !autoAdvance;
    scheduleStep();
  });
  for (const button of $('inference-presets').children) button.addEventListener('click', () => loadPreset(button.dataset.preset));
  loadPreset('chain');
  function setInferenceState(next) {
    if (!next || typeof next !== 'object' || !Array.isArray(next.premises) || typeof next.goal !== 'string' || !Number.isInteger(next.step) || next.step < 0) throw new TypeError('State requires premises, goal and a nonnegative integer step');
    const checked = deriveProof({premises: next.premises, goal: next.goal});
    if (next.step >= Math.max(1, checked.lines.length)) throw new RangeError('Step exceeds proof length');
    autoAdvance = false; stopStepTimer();
    editor.replaceChildren(); rowNumber = 0; next.premises.forEach(value => addRow(value)); $('inference-goal').value = displayFormula(next.goal);
    for (const button of $('inference-presets').children) button.setAttribute('aria-pressed', 'false');
    runInference(); focusStep(next.step); scheduleStep();
  }
  window.__atlasScenes.inference = {
    // Scene state is the last valid input; incomplete input is exposed separately as draft.
    getState() { return {premises:[...lastPremises],goal:lastGoal,step:activeStep}; },
    setState: setInferenceState,
    reset() { setInferenceState({...presets.chain, step:0}); },
    seek(timeMs) { if (typeof timeMs !== 'number' || !Number.isFinite(timeMs) || timeMs < 0) throw new RangeError('Time must be finite and nonnegative'); const proof = deriveProof(presets.chain); setInferenceState({...presets.chain,step:Math.min(proof.lines.length-1,Math.floor(timeMs/1800))}); },
    getInspectionSnapshot() {
      const draft = {premises:[...editor.children].map(row => ({formula:row.querySelector('input[type=text]').value,enabled:row.querySelector('input[type=checkbox]').checked})),goal:$('inference-goal').value};
      return structuredClone({sceneId:'scene:logic.inference.lab',committedState:{premises:lastPremises,goal:lastGoal,step:activeStep},proof:lastProof,draft,stale:inferenceStale});
    }
  };
}
mountInferenceLab().catch(error => {
  $('inference-status').textContent = '추론 실험실을 불러오지 못했습니다. 새로고침해 주세요.';
  console.error(error);
});
