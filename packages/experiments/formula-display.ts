// Presentation aliases already accepted by the propositional parser.
// Do not parse, evaluate, simplify or otherwise change the proposition here.
export function displayFormula(text:string) {
  if (typeof text !== 'string') throw new TypeError('Formula display requires a string');
  return text.replace(/->/g, '→').replace(/[!~]/g, '¬').replace(/&/g, '∧').replace(/\|/g, '∨');
}

export const normalizeFormulaInput = displayFormula;

export function normalizedSelection(value:string, start:number, end = start) {
  const text = normalizeFormulaInput(value);
  return {text, start: normalizeFormulaInput(value.slice(0, start)).length,
    end: normalizeFormulaInput(value.slice(0, end)).length};
}

export function bindFormulaInput(input:HTMLInputElement|HTMLTextAreaElement) {
  function normalize(event:Event) {
    if (event instanceof InputEvent && event.isComposing) return;
    const value = input.value;
    const next = normalizedSelection(value, input.selectionStart ?? value.length, input.selectionEnd ?? value.length);
    if (next.text !== value) {
      input.value = next.text;
      input.setSelectionRange(next.start, next.end);
    }
  }
  input.addEventListener('input', normalize);
  input.addEventListener('compositionend', normalize);
  return () => {input.removeEventListener('input', normalize); input.removeEventListener('compositionend', normalize);};
}
