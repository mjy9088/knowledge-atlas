export const NUCLEAR_EVIDENCE_DURATION_MS = 6_000;
export const NUCLEAR_EVIDENCE_STEPS = Object.freeze([0, 1_600, 3_200, 4_800] as const);

const STAGES = Object.freeze([
  Object.freeze({stage: 'setup', role: 'setup', label: '설정', observation: '알파 입자를 질소 표적 쪽으로 보냅니다.'}),
  Object.freeze({stage: 'contact', role: 'unresolved', label: '반응 영역', observation: '표적 안 반응의 세부 경로는 이 관찰만으로 정해지지 않았습니다.'}),
  Object.freeze({stage: 'emission', role: 'observation', label: '관찰', observation: '양전하 수소핵이 표적에서 방출됐습니다.'}),
  Object.freeze({stage: 'inference', role: 'inference', label: '잠정 해석', observation: '수소핵이 다른 원자핵의 구성 성분일 가능성을 제안했습니다.'}),
] as const);

export type NuclearEvidenceStage = (typeof STAGES)[number]['stage'];
export type NuclearEvidenceRole = (typeof STAGES)[number]['role'];
export type NuclearEvidenceState = Readonly<{version: 1; timeMs: number}>;
export type NuclearEvidenceFrame = Readonly<{
  timeMs: number;
  stageIndex: number;
  stage: NuclearEvidenceStage;
  role: NuclearEvidenceRole;
  label: string;
  observation: string;
  alphaProgress: number;
  hydrogenProgress: number;
  hydrogenNucleusVisible: boolean;
  tentativeInferenceVisible: boolean;
  reactionResolved: false;
}>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export function nuclearEvidenceAvailability(suggestion: unknown): boolean {
  return isRecord(suggestion) && suggestion['example'] === 'proton';
}

export function nuclearEvidenceFrameAt(timeMs: number): NuclearEvidenceFrame {
  if (!Number.isFinite(timeMs) || timeMs < 0) throw new RangeError('Time must be finite and non-negative');
  const time = Math.min(timeMs, NUCLEAR_EVIDENCE_DURATION_MS);
  const stageIndex = time >= NUCLEAR_EVIDENCE_STEPS[3] ? 3 : time >= NUCLEAR_EVIDENCE_STEPS[2] ? 2 : time >= NUCLEAR_EVIDENCE_STEPS[1] ? 1 : 0;
  const stage = STAGES[stageIndex];
  if (!stage) throw new RangeError('Unknown nuclear evidence stage');
  return Object.freeze({
    timeMs: time,
    stageIndex,
    stage: stage.stage,
    role: stage.role,
    label: stage.label,
    observation: stage.observation,
    alphaProgress: Math.min(time / NUCLEAR_EVIDENCE_STEPS[2], 1),
    hydrogenProgress: Math.max(0, Math.min((time - NUCLEAR_EVIDENCE_STEPS[2]) / 1_600, 1)),
    hydrogenNucleusVisible: stageIndex >= 2,
    tentativeInferenceVisible: stageIndex >= 3,
    reactionResolved: false,
  });
}

export function createNuclearEvidenceCursor() {
  let timeMs = 0;
  const seek = (next: number) => {
    const frame = nuclearEvidenceFrameAt(next);
    timeMs = frame.timeMs;
    return frame;
  };
  return {
    getState: (): NuclearEvidenceState => ({version: 1, timeMs}),
    setState(value: unknown) {
      if (!isRecord(value) || Object.keys(value).length !== 2 || value['version'] !== 1 ||
        typeof value['timeMs'] !== 'number' || !Number.isFinite(value['timeMs']) ||
        value['timeMs'] < 0 || value['timeMs'] > NUCLEAR_EVIDENCE_DURATION_MS) {
        throw new TypeError('Invalid nuclear evidence state');
      }
      return seek(value['timeMs']);
    },
    seek,
    reset: () => seek(0),
  };
}
