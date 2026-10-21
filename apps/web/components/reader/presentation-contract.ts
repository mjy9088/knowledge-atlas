export type SequenceDefinition = {
  readonly id: string;
  readonly durationMs: number;
  readonly posterMs: number;
  readonly mount: (host: HTMLElement) => MountedSequence;
};

export type MountedSequence = {
  readonly renderAt: (timeMs: number) => void;
  readonly dispose: () => void;
};

export type PresentationState = {
  readonly version: 1;
  readonly positions: Readonly<Record<string, number>>;
};
