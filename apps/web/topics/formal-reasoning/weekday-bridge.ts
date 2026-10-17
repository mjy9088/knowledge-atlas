import {WEEKDAYS,type WeekdayInterpretation} from '/packages/models/weekday-worlds.js';
import {markAlignment} from '../../components/alignment/semantic-alignment.js';
import {conditionalReading} from './weekday-alignment.js';

// Short authored steps before exposing the full world editor.
export function mountWeekdayBridge(container:HTMLElement){
  const doc=container.ownerDocument;container.className='weekday-bridge';
  function p(text:string,cls=''){const node=doc.createElement('p');node.textContent=text;node.className=cls;return node;}
  function card(title:string,lines:string[]){const node=doc.createElement('section'),h=doc.createElement('h2');h.textContent=title;node.append(h,...lines.map(line=>p(line)));return node;}
  return {render(input:WeekdayInterpretation,scene:string){
    container.replaceChildren();
    if(scene==='modal-rules'){
      container.append(card('양상 논리에도 추론 도구가 있습니다',[
        'K 공리: □(P → Q) → (□P → □Q)',
        '모든 접근 세계에서 P이면 Q이고, 모두 P라면, 모두 Q입니다.',
        '필연화 규칙: 가정 없이 증명한 정리 P에서 □P로',
        '“오늘은 금요일”이라고 가정했다고 □를 붙일 수는 없습니다.',
        '체계에 따라 더하는 공리도 다릅니다. 예: T, □P → P는 자기 자신으로의 접근이 있을 때 보장됩니다.',
      ]));return;
    }
    const source=card('풀이용 문장',[]),line=p(''),root=markAlignment(doc.createElement('span'),'constraints','source'),a=markAlignment(doc.createElement('span'),'antecedent','source'),b=markAlignment(doc.createElement('span'),'consequent','source'),connect=markAlignment(doc.createElement('span'),'conditional-connective','source');
    a.textContent='어제가 내일';b.textContent=`오늘이 ${WEEKDAYS[input.target]}이다.`;connect.textContent='이라면, ';root.append('만약 ',a,connect,b);line.append(root);source.append(line);container.append(source);
    if(scene==='conditional'){source.append(p('설명의 편의를 위해 문장을 이렇게 단순화하고, 그 가정 아래 요일을 계산해 봅시다.'));return;}
    const symbols=card('문장을 기호로 줄이면',[]),formula=p('','weekday-bridge-formula');formula.append(conditionalReading(doc));symbols.append(formula,p('A: 어제가 내일이다.'),p(`B: 오늘이 ${WEEKDAYS[input.target]}이다.`));container.append(symbols);
    if(scene==='inference')container.append(card('고전 논리의 한 가지 추론 규칙',[
      'A → B 와 A 를 놓으면 B',
      '전건 긍정 · modus ponens',
      '조건문에 더해 A라는 가정을 놓아야 B로 갈 수 있습니다. A → B만으로 A나 B가 참인 것은 아닙니다.',
      '이 가정 아래 B의 요일과 날짜 대응을 함께 놓아, 지금의 오늘을 계산합니다.',
    ]));
  }};
}
