import {WEEKDAYS,type WeekdayInterpretation,type WorldIndex} from '/packages/models/weekday-worlds.js';
import {worldLabel} from './weekday-world-style.js';
import {markAlignment} from '../../components/alignment/semantic-alignment.js';
import {weekdayClassicalProof} from '/packages/models/weekday-classical.js';
import {SYSTEM_ROWS} from './weekday-systems.js';
import {relationPattern} from './weekday-relation-patterns.js';
import {conditionalReading} from './weekday-alignment.js';

// Short authored steps before exposing the full world editor.
export function mountWeekdayBridge(container:HTMLElement){
  const doc=container.ownerDocument;container.className='weekday-bridge';
  function p(text:string,cls=''){const node=doc.createElement('p');node.textContent=text;node.className=cls;return node;}
  function card(title:string,lines:string[]){const node=doc.createElement('section'),h=doc.createElement('h2');h.textContent=title;node.append(h,...lines.map(line=>p(line)));return node;}
  return {render(input:WeekdayInterpretation,scene:string){
    container.replaceChildren();container.dataset.step=scene;
    if(scene==='modal-systems'){
      const systems=card('가능세계 ≠ 공리 체계',[]),table=doc.createElement('table');table.className='weekday-system-table';const thead=doc.createElement('thead'),head=doc.createElement('tr');
      for(const text of ['체계','K에 더하는 공리','접근 관계 R의 조건']){const th=doc.createElement('th');th.textContent=text;head.append(th);}thead.append(head);table.append(thead);const body=doc.createElement('tbody');
      for(const row of SYSTEM_ROWS){const tr=doc.createElement('tr');for(const [index,text]of row.entries()){const td=doc.createElement('td');if(index===2){const motif=doc.createElement('span');motif.className='weekday-relation-pattern';motif.innerHTML=relationPattern(row[0]);td.append(motif);}td.append(doc.createTextNode(text));tr.append(td);}body.append(tr);}table.append(body);systems.append(table,p('작은 그림은 관계 조건의 예시입니다. 전체 조건은 각 행의 설명을 따릅니다.'),p('공통 바탕: 고전 논리 + K 공리 + 전건 긍정 + 정리에 대한 필연화.'),p('같은 가능세계 방법도 관계 조건에 따라 달라집니다. B 체계는 여기서 K + T + B입니다.'));container.append(systems);return;
    }
    if(scene==='modal-rules'){
      container.append(card('이 편집기의 기본 추론 체계: K',[
        '고전 논리의 추론 (전건 긍정 포함) + K 공리',
        'K 공리: □(P → Q) → (□P → □Q)',
        '모든 접근 세계에서 P이면 Q이고, 모두 P라면, 모두 Q입니다.',
        '필연화 규칙: 가정 없이 증명한 정리 P에서 □P로',
        '“오늘은 금요일”이라고 가정했다고 □를 붙일 수는 없습니다.',
        '◇P는 ¬□¬P로 정의합니다. 접근 관계에 추가 조건은 강제하지 않습니다.',
        '다음에서 관계 조건을 더한 D·T·B·S4·S5와 비교합니다.',
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
    const base=(id:WorldIndex)=>id===0?'t':id===1?'h':id===2?'t₂':'t₃';
    const symbols=card('추론 규칙을 적용할 수 있도록 기호로 나타내면',[]),formula=p('','weekday-bridge-formula');formula.append(conditionalReading(doc));const aDefinition=markAlignment(p(`A: ${base(input.contexts.yesterday)} − 1 ≡₇ ${base(input.contexts.tomorrow)} + 1`,'weekday-bridge-definition'),'antecedent','symbol'),bDefinition=markAlignment(p(`B: ${base(input.contexts.consequent)} ≡₇ ${input.target}`,'weekday-bridge-definition'),'consequent','symbol');symbols.append(formula,p((input.worlds??[{id:0},{id:1}]).map(w=>`${base(w.id)}: ${worldLabel(w.id)}의 오늘`).join(' · ')),p('월=0, …, 일=6 · ≡₇: 같은 요일 (차이가 7의 정수배)'),aDefinition,bDefinition);container.append(symbols);
    if(scene==='nonmodal-proof'){
      const model=weekdayClassicalProof(input),proof=card('가정에서 결론까지',[]);proof.classList.add('weekday-classical-proof');
      const rules=doc.createElement('div');rules.className='weekday-congruence-rules';rules.append(p('정의에서 얻는 ≡₇의 추론 규칙'),p('대칭: x ≡₇ y에서 y ≡₇ x'),p('추이: x ≡₇ y, y ≡₇ z에서 x ≡₇ z'),p('덧셈: x ≡₇ y에서 x + c ≡₇ y + c'),p('x·y·z·c는 정수. 뺄셈은 음수 더하기입니다.'));
      symbols.append(rules);
      if(model.supported&&model.answer!==null){
        const list=doc.createElement('ol');
        for(const step of model.steps){const li=doc.createElement('li'),term=doc.createElement('strong'),reason=doc.createElement('small');term.textContent=step.formula;reason.textContent=step.reason;li.append(term,reason);list.append(li);}proof.append(list,p('따라서 현실의 오늘은 '+WEEKDAYS[model.answer]+'.','weekday-classical-answer'),p('문제가 묻는 가정 A가 성립하는 경우의 답입니다. A → B만으로 A를 얻은 것은 아닙니다.'));
      }else{proof.append(p(model.kind==='impossible'?'선택한 날짜 조건에 맞는 달력이 없습니다. 이 순서로 특정 요일을 답으로 추출하지 않습니다.':'기본 두 기준과 다른 선택이므로 위의 t·h 풀이를 그대로 적용하지 않습니다.'),p(model.answer===null?'현재 질문의 요일을 하나로 정할 수 없습니다.':'현재 조건에서 질문의 답: '+WEEKDAYS[model.answer]));}
      const inputs=doc.createElement('div');inputs.className='weekday-classical-inputs';inputs.append(source,symbols);container.replaceChildren(inputs,proof);
    }
  }};
}
