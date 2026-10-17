import {WEEKDAYS,type WeekdayInterpretation} from '/packages/models/weekday-worlds.js';
import {markAlignment} from '../../components/alignment/semantic-alignment.js';
import {weekdayClassicalProof} from '/packages/models/weekday-classical.js';
import {conditionalReading} from './weekday-alignment.js';

// Short authored steps before exposing the full world editor.
export function mountWeekdayBridge(container:HTMLElement){
  const doc=container.ownerDocument;container.className='weekday-bridge';
  function p(text:string,cls=''){const node=doc.createElement('p');node.textContent=text;node.className=cls;return node;}
  function card(title:string,lines:string[]){const node=doc.createElement('section'),h=doc.createElement('h2');h.textContent=title;node.append(h,...lines.map(line=>p(line)));return node;}
  return {render(input:WeekdayInterpretation,scene:string){
    container.replaceChildren();container.dataset.step=scene;
    if(scene==='modal-rules'){
      container.append(card('양상 논리에도 추론 도구가 있습니다',[
        'K 공리: □(P → Q) → (□P → □Q)',
        '모든 접근 세계에서 P이면 Q이고, 모두 P라면, 모두 Q입니다.',
        '필연화 규칙: 가정 없이 증명한 정리 P에서 □P로',
        '“오늘은 금요일”이라고 가정했다고 □를 붙일 수는 없습니다.',
        '체계에 따라 더하는 공리도 다릅니다. 예: T, □P → P는 자기 자신으로의 접근이 있을 때 보장됩니다.',
      ]));return;
    }
    if(scene==='inference'){
      const rules=card('고전 논리의 기본 도구 몇 가지',[]),table=doc.createElement('table');table.className='weekday-rule-table';
      const rows=[['전건 긍정 · MP','A → B, A','B'],['후건 부정 · MT','A → B, ¬B','¬A'],['논리곱 도입 · ∧I','A, B','A ∧ B'],['논리곱 제거 · ∧E','A ∧ B','A 또는 B를 각각'],['선언 삼단논법 · DS','A ∨ B, ¬A','B']];
      const head=doc.createElement('tr');for(const text of ['규칙','주어진 것','얻는 것']){const th=doc.createElement('th');th.textContent=text;head.append(th);}const thead=doc.createElement('thead');thead.append(head);table.append(thead);
      const body=doc.createElement('tbody');for(const row of rows){const tr=doc.createElement('tr');for(const text of row){const td=doc.createElement('td');td.textContent=text;tr.append(td);}body.append(tr);}table.append(body);
      rules.append(table,p('¬: 아니다 · ∧: 그리고 · ∨: 또는. 표의 A·B는 임의의 문장입니다.'),p('다음 풀이에는 전건 긍정과 날짜의 대입·계산을 씁니다.'));container.append(rules);return;
    }
    const source=card('풀이용 문장 (설명을 위해 간략화)',[]),line=p(''),root=markAlignment(doc.createElement('span'),'constraints','source'),a=markAlignment(doc.createElement('span'),'antecedent','source'),b=markAlignment(doc.createElement('span'),'consequent','source'),connect=markAlignment(doc.createElement('span'),'conditional-connective','source');
    a.textContent='어제가 내일';b.textContent=`오늘이 ${WEEKDAYS[input.target]}이다.`;connect.textContent='이라면, ';root.append('만약 ',a,connect,b);line.append(root);source.append(line);container.append(source);
    if(scene==='conditional'){source.append(p('설명의 편의를 위해 문장을 이렇게 단순화하고, 그 가정 아래 요일을 계산해 봅시다.'));return;}
    const symbols=card('문장을 기호로 줄이면',[]),formula=p('','weekday-bridge-formula');formula.append(conditionalReading(doc));symbols.append(formula,p('A: 어제가 내일이다.'),p(`B: 오늘이 ${WEEKDAYS[input.target]}이다.`));container.append(symbols);
    if(scene==='nonmodal-proof'){
      const model=weekdayClassicalProof(input),proof=card('가정에서 결론까지',[]);proof.classList.add('weekday-classical-proof');
      symbols.append(p('t: 현실의 오늘 · h: 가정한 오늘 · 월=0, …, 일=6'),p('≡₇: 같은 요일'));
      if(model.supported&&model.answer!==null){
        symbols.append(p('A: '+model.equation),p('B: h ≡₇ '+input.target));
        const list=doc.createElement('ol');
        for(const [formula,why]of [
          ['A → B','풀이용 조건문'],['A','전건을 추가로 가정'],['B','1·2에서 전건 긍정 (→E)'],
          [model.substituted!,'A에 B의 목표 요일 대입'],
          [model.relation!+' ≡₇ '+model.answer,'같은 수를 더하거나 빼기 · 7일 주기 계산'],
        ]){const li=doc.createElement('li'),term=doc.createElement('strong'),reason=doc.createElement('small');term.textContent=formula;reason.textContent=why;li.append(term,reason);list.append(li);}proof.append(list,p('따라서 현실의 오늘은 '+WEEKDAYS[model.answer]+'.','weekday-classical-answer'),p('이 결론은 A를 가정한 아래의 결과입니다. 조건문 하나만으로 A나 B가 참이 되지는 않습니다.'));
      }else{proof.append(p(model.kind==='impossible'?'선택한 날짜 조건에 맞는 달력이 없습니다. 이 순서로 특정 요일을 답으로 추출하지 않습니다.':'기본 두 기준과 다른 선택이므로 위의 t·h 풀이를 그대로 적용하지 않습니다.'),p(model.answer===null?'현재 질문의 요일을 하나로 정할 수 없습니다.':'현재 조건에서 질문의 답: '+WEEKDAYS[model.answer]));}
      const inputs=doc.createElement('div');inputs.className='weekday-classical-inputs';inputs.append(source,symbols);container.replaceChildren(inputs,proof);
    }
  }};
}
