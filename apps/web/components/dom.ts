/** Required elements belong to authored templates; fail clearly on a broken template. */
export function required<T extends Element = HTMLElement>(selector: string, scope: ParentNode = document): T {
  const element = scope.querySelector<T>(selector);
  if (!element) throw new Error(`Required element missing: ${selector}`);
  return element;
}
export function byId<T extends HTMLElement = HTMLElement>(id: string): T {
  return required<T>(`#${id}`);
}
export function eventElement(event: Event): Element | null {
  return event.target instanceof Element ? event.target : null;
}
