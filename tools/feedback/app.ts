type Question = {
  readonly id: string;
  readonly text: string;
  readonly optional: boolean;
  readonly status: 'pending' | 'answered';
  readonly answer: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly answeredAt: string | null;
};

const capability = decodeURIComponent(location.pathname.replace(/^\/a\//, ''));
function requiredHTMLElement(selector: string): HTMLElement {
  const value = document.querySelector(selector);
  if (!(value instanceof HTMLElement)) throw new TypeError(`Missing page element: ${selector}`);
  return value;
}

function requiredTemplate(selector: string): HTMLTemplateElement {
  const value = document.querySelector(selector);
  if (!(value instanceof HTMLTemplateElement)) throw new TypeError(`Missing page template: ${selector}`);
  return value;
}
const questionsRoot = requiredHTMLElement('#questions');
const summary = requiredHTMLElement('#summary');
const template = requiredTemplate('#question-template');

let currentQuestions: readonly Question[] = [];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function parseQuestion(value: unknown): Question {
  if (!isRecord(value)) throw new TypeError('Invalid question response');
  const {id, text, optional, status, answer, createdAt, updatedAt, answeredAt} = value;
  if (typeof id !== 'string' || typeof text !== 'string' || typeof optional !== 'boolean') throw new TypeError('Invalid question response');
  if (status !== 'pending' && status !== 'answered') throw new TypeError('Invalid question status');
  if (answer !== null && typeof answer !== 'string') throw new TypeError('Invalid answer response');
  if (typeof createdAt !== 'string' || typeof updatedAt !== 'string' || (answeredAt !== null && typeof answeredAt !== 'string')) throw new TypeError('Invalid timestamp response');
  return {id, text, optional, status, answer, createdAt, updatedAt, answeredAt};
}

function parseQuestions(value: unknown): readonly Question[] {
  if (!isRecord(value) || !Array.isArray(value.questions)) throw new TypeError('Invalid questions response');
  return value.questions.map(parseQuestion);
}

function formatTime(value: string): string {
  return new Intl.DateTimeFormat(undefined, {dateStyle: 'medium', timeStyle: 'short'}).format(new Date(value));
}

async function request(path: string, options: RequestInit = {}): Promise<unknown> {
  const headers = new Headers(options.headers);
  headers.set('X-Feedback-Capability', capability);
  const response = await fetch(path, {...options, headers});
  const data: unknown = await response.json();
  if (!response.ok) {
    const message = isRecord(data) && typeof data.error === 'string' ? data.error : 'Request failed';
    throw new Error(message);
  }
  return data;
}

function renderQuestion(question: Question): DocumentFragment {
  const fragment = template.content.cloneNode(true);
  if (!(fragment instanceof DocumentFragment)) throw new TypeError('Question template is invalid');
  const card = fragment.querySelector('.question-card');
  const form = fragment.querySelector('form');
  const textarea = fragment.querySelector('textarea');
  const saved = fragment.querySelector('.saved-answer');
  const savedText = saved?.querySelector('p');
  const formStatus = fragment.querySelector('.form-status');
  const submit = fragment.querySelector('button[type="submit"]');
  const edit = fragment.querySelector('.edit-answer');
  const questionText = fragment.querySelector('.question-text');
  const questionId = fragment.querySelector('.question-id');
  const badge = fragment.querySelector('.status-badge');
  const timestamps = fragment.querySelector('.timestamps');
  const label = form?.querySelector('label');
  if (!(card instanceof HTMLElement) || !(form instanceof HTMLFormElement) || !(textarea instanceof HTMLTextAreaElement)
    || !(saved instanceof HTMLElement) || !(savedText instanceof HTMLElement) || !(formStatus instanceof HTMLElement)
    || !(submit instanceof HTMLButtonElement) || !(edit instanceof HTMLButtonElement) || !(questionText instanceof HTMLElement)
    || !(questionId instanceof HTMLElement) || !(badge instanceof HTMLElement) || !(timestamps instanceof HTMLElement)
    || !(label instanceof HTMLLabelElement)) throw new TypeError('Question template controls are incomplete');

  questionText.textContent = question.text;
  questionId.textContent = question.id;
  badge.textContent = question.status === 'answered' ? 'Answered' : question.optional ? 'Optional' : 'Awaiting answer';
  timestamps.textContent = question.status === 'answered' && question.answeredAt !== null
    ? `Asked ${formatTime(question.createdAt)}. Answer saved ${formatTime(question.answeredAt)}.`
    : `Asked ${formatTime(question.createdAt)}.`;
  textarea.value = question.answer ?? '';
  textarea.id = `answer-${question.id}`;
  formStatus.id = `answer-status-${question.id}`;
  textarea.setAttribute('aria-describedby', formStatus.id);
  label.htmlFor = textarea.id;
  card.dataset.status = question.status;

  if (question.status === 'answered') {
    form.hidden = true;
    saved.hidden = false;
    savedText.textContent = question.answer;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    submit.disabled = true;
    formStatus.textContent = 'Saving...';
    try {
      const updated = parseQuestion(await request('/api/public/answer', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: question.id, answer: textarea.value}),
      }));
      currentQuestions = currentQuestions.map((item) => item.id === updated.id ? updated : item);
      render('Answer saved. You can close this page or answer another question.');
    } catch (error) {
      formStatus.textContent = error instanceof Error ? error.message : 'Could not save the answer.';
      submit.disabled = false;
    }
  });
  edit.addEventListener('click', () => {
    saved.hidden = true;
    form.hidden = false;
    textarea.focus();
  });
  return fragment;
}

function render(message?: string): void {
  questionsRoot.replaceChildren(...currentQuestions.map(renderQuestion));
  if (message) {
    summary.textContent = message;
    return;
  }
  const pending = currentQuestions.filter((question) => question.status === 'pending').length;
  summary.textContent = currentQuestions.length === 0 ? 'There are no questions right now.' : `${pending} awaiting answer, ${currentQuestions.length - pending} answered.`;
}

async function load(): Promise<void> {
  try {
    currentQuestions = parseQuestions(await request('/api/public/questions'));
    render();
  } catch (error) {
    summary.classList.add('error');
    summary.textContent = error instanceof Error ? error.message : 'Could not load questions.';
  }
}

void load();
