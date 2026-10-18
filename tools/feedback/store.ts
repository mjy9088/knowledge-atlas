import {existsSync, mkdirSync, readFileSync, renameSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';

export type QuestionStatus = 'pending' | 'answered';

export type Question = {
  readonly id: string;
  readonly text: string;
  readonly optional: boolean;
  readonly status: QuestionStatus;
  readonly answer: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly answeredAt: string | null;
};

export type NewQuestion = {
  readonly text: string;
  readonly optional: boolean;
};

type Clock = () => string;
type IdFactory = () => string;

const MAX_QUESTIONS = 200;
const MAX_QUESTION_LENGTH = 1_000;
const MAX_ANSWER_LENGTH = 4_000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseQuestion(value: unknown): Question {
  if (!isRecord(value)) throw new TypeError('Question must be an object');
  const {id, text, optional, status, answer, createdAt, updatedAt, answeredAt} = value;
  if (typeof id !== 'string' || !/^q_[A-Za-z0-9_-]{1,100}$/.test(id)) throw new TypeError('Invalid question ID');
  if (typeof text !== 'string' || text.length < 1 || text.length > MAX_QUESTION_LENGTH) throw new TypeError('Invalid question text');
  if (typeof optional !== 'boolean') throw new TypeError('Invalid optional flag');
  if (status !== 'pending' && status !== 'answered') throw new TypeError('Invalid question status');
  if (answer !== null && (typeof answer !== 'string' || answer.length < 1 || answer.length > MAX_ANSWER_LENGTH)) throw new TypeError('Invalid answer');
  if (typeof createdAt !== 'string' || typeof updatedAt !== 'string') throw new TypeError('Invalid timestamps');
  if (answeredAt !== null && typeof answeredAt !== 'string') throw new TypeError('Invalid answer timestamp');
  if ((status === 'pending' && (answer !== null || answeredAt !== null)) || (status === 'answered' && (answer === null || answeredAt === null))) {
    throw new TypeError('Question state is inconsistent');
  }
  return {id, text, optional, status, answer, createdAt, updatedAt, answeredAt};
}

function parseState(value: unknown): readonly Question[] {
  if (!isRecord(value) || value.version !== 1 || !Array.isArray(value.questions) || value.questions.length > MAX_QUESTIONS) {
    throw new TypeError('Invalid question store');
  }
  const questions = value.questions.map(parseQuestion);
  if (new Set(questions.map((question) => question.id)).size !== questions.length) throw new TypeError('Duplicate question ID');
  return questions;
}

export class QuestionStore {
  readonly #file: string;
  readonly #clock: Clock;
  readonly #idFactory: IdFactory;
  #questions: Question[];

  constructor(directory: string, clock: Clock = () => new Date().toISOString(), idFactory: IdFactory = () => `q_${randomUUID()}`) {
    mkdirSync(directory, {recursive: true, mode: 0o700});
    this.#file = path.join(directory, 'questions.json');
    this.#clock = clock;
    this.#idFactory = idFactory;
    this.#questions = existsSync(this.#file) ? [...parseState(JSON.parse(readFileSync(this.#file, 'utf8')))] : [];
  }

  list(): readonly Question[] {
    return structuredClone(this.#questions);
  }

  add(input: NewQuestion): Question {
    const text = input.text.trim();
    if (text.length < 1 || text.length > MAX_QUESTION_LENGTH) throw new TypeError(`Question must be 1-${MAX_QUESTION_LENGTH} characters`);
    if (this.#questions.length >= MAX_QUESTIONS) throw new RangeError(`Question limit is ${MAX_QUESTIONS}`);
    const id = this.#idFactory();
    if (!/^q_[A-Za-z0-9_-]{1,100}$/.test(id) || this.#questions.some((question) => question.id === id)) throw new TypeError('Invalid or duplicate generated question ID');
    const now = this.#clock();
    const question: Question = {id, text, optional: input.optional, status: 'pending', answer: null, createdAt: now, updatedAt: now, answeredAt: null};
    const next = [...this.#questions, question];
    this.#persist(next);
    this.#questions = next;
    return structuredClone(question);
  }

  answer(id: string, rawAnswer: string): Question {
    const answer = rawAnswer.trim();
    if (answer.length < 1 || answer.length > MAX_ANSWER_LENGTH) throw new TypeError(`Answer must be 1-${MAX_ANSWER_LENGTH} characters`);
    const existing = this.#questions.find((question) => question.id === id);
    if (!existing) throw new RangeError('Unknown question');
    const now = this.#clock();
    const updated: Question = {...existing, status: 'answered', answer, updatedAt: now, answeredAt: now};
    const next = this.#questions.map((question) => question.id === id ? updated : question);
    this.#persist(next);
    this.#questions = next;
    return structuredClone(updated);
  }

  #persist(questions: readonly Question[]): void {
    const temporary = `${this.#file}.${process.pid}.${randomUUID()}.tmp`;
    writeFileSync(temporary, `${JSON.stringify({version: 1, questions}, null, 2)}\n`, {encoding: 'utf8', mode: 0o600});
    renameSync(temporary, this.#file);
  }
}
