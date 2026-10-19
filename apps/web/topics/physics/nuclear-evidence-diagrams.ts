export type NuclearEvidenceDiagram = Readonly<{
  root: SVGElement;
  description: SVGElement;
  alpha: SVGElement;
  hydrogen: SVGElement;
}>;

type DiagramLayout = Readonly<{
  modifier: string;
  viewBox: string;
  beam: string;
  alpha: Readonly<{cx: string; cy: string; labelX: string; labelY: string}>;
  target: Readonly<{x: string; y: string; width: string; height: string; textX: string; nameY: string; scopeY: string}>;
  unresolved: Readonly<{cx: string; cy: string}>;
  emission: string;
  hydrogen: Readonly<{cx: string; cy: string; labelX: string; labelY: string; anchor: string}>;
  inference: Readonly<{x: string; y: string; width: string; height: string; textX: string; textY: string}>;
}>;

const vocabulary = {
  title: '알파 입자 조사와 양전하 수소핵 방출의 단계별 개념도',
  source: '알파 입자 조사',
  target: '질소 표적',
  unresolved: '반응 세부 미해결',
  observation: '양전하 수소핵 방출',
  inference: '잠정 해석 · 다른 핵의 구성 성분일 가능성',
} as const;

const layouts: readonly DiagramLayout[] = [
  {
    modifier: 'desktop', viewBox: '0 0 680 280', beam: 'M 78 118 H 328',
    alpha: {cx: '92', cy: '118', labelX: '78', labelY: '66'},
    target: {x: '342', y: '64', width: '138', height: '112', textX: '411', nameY: '112', scopeY: '139'},
    unresolved: {cx: '342', cy: '118'}, emission: 'M 478 118 H 635',
    hydrogen: {cx: '485', cy: '118', labelX: '558', labelY: '66', anchor: 'middle'},
    inference: {x: '154', y: '208', width: '372', height: '48', textX: '340', textY: '238'},
  },
  {
    modifier: 'compact', viewBox: '0 0 328 200', beam: 'M 28 64 H 108',
    alpha: {cx: '36', cy: '64', labelX: '24', labelY: '24'},
    target: {x: '118', y: '24', width: '104', height: '80', textX: '170', nameY: '57', scopeY: '82'},
    unresolved: {cx: '118', cy: '64'}, emission: 'M 222 64 L 296 116',
    hydrogen: {cx: '222', cy: '64', labelX: '304', labelY: '138', anchor: 'end'},
    inference: {x: '20', y: '150', width: '288', height: '36', textX: '164', textY: '174'},
  },
] as const;

export function createNuclearEvidenceDiagrams(doc: Document): readonly NuclearEvidenceDiagram[] {
  const create = (tag: string, attributes: Readonly<Record<string, string>>, text = '') => {
    const element = doc.createElementNS('http://www.w3.org/2000/svg', tag);
    for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, value);
    element.textContent = text;
    return element;
  };
  return layouts.map(layout => {
    const root = create('svg', {viewBox: layout.viewBox, role: 'img', class: `nuclear-evidence-diagram nuclear-evidence-diagram--${layout.modifier}`});
    const title = create('title', {}, vocabulary.title);
    const description = create('desc', {});
    const beam = create('path', {d: layout.beam, class: 'nuclear-beam'});
    const alpha = create('g', {class: 'nuclear-alpha'});
    alpha.append(create('circle', {cx: layout.alpha.cx, cy: layout.alpha.cy, r: '22'}), create('text', {x: layout.alpha.cx, y: String(Number(layout.alpha.cy) + 6), 'text-anchor': 'middle'}, 'α'));
    const sourceLabel = create('text', {x: layout.alpha.labelX, y: layout.alpha.labelY, class: 'nuclear-label'}, vocabulary.source);
    const target = create('g', {class: 'nuclear-target'});
    target.append(
      create('rect', {x: layout.target.x, y: layout.target.y, width: layout.target.width, height: layout.target.height, rx: '16'}),
      create('text', {x: layout.target.textX, y: layout.target.nameY, 'text-anchor': 'middle'}, vocabulary.target),
      create('text', {x: layout.target.textX, y: layout.target.scopeY, 'text-anchor': 'middle', class: 'nuclear-small'}, vocabulary.unresolved),
    );
    const unresolved = create('g', {class: 'nuclear-unresolved'});
    unresolved.append(create('circle', {cx: layout.unresolved.cx, cy: layout.unresolved.cy, r: '30'}), create('text', {x: layout.unresolved.cx, y: String(Number(layout.unresolved.cy) + 7), 'text-anchor': 'middle'}, '?'));
    const hydrogen = create('g', {class: 'nuclear-hydrogen'});
    hydrogen.append(create('circle', {cx: layout.hydrogen.cx, cy: layout.hydrogen.cy, r: '22'}), create('text', {x: layout.hydrogen.cx, y: String(Number(layout.hydrogen.cy) + 6), 'text-anchor': 'middle'}, 'H⁺'));
    const observation = create('text', {x: layout.hydrogen.labelX, y: layout.hydrogen.labelY, 'text-anchor': layout.hydrogen.anchor, class: 'nuclear-label'}, vocabulary.observation);
    const inference = create('g', {class: 'nuclear-inference'});
    inference.append(create('rect', {x: layout.inference.x, y: layout.inference.y, width: layout.inference.width, height: layout.inference.height, rx: '8'}), create('text', {x: layout.inference.textX, y: layout.inference.textY, 'text-anchor': 'middle'}, vocabulary.inference));
    root.append(title, description, beam, sourceLabel, alpha, target, unresolved, create('path', {d: layout.emission, class: 'nuclear-emission'}), hydrogen, observation, inference);
    return {root, description, alpha, hydrogen};
  });
}
