// Original explanatory copy grounded in the existing claims and model contract.
// No source quotations or new source-verification status are asserted.
export const LESSON = {
  id:'lesson:logic.inference.three-minutes.ko', version:1,
  reviewStatus:'needs-content-review', sourceRefs:['source:forallx-calgary-2026'],
  illustration:{kind:'generated-illustration-proposal',scope:'기호 읽기를 돕는 가상 예시. 실제 기기의 작동 설명이 아님',reviewStatus:'needs-content-review'},
  intro:[
    {id:'question',title:'추론은 무엇일까요?',text:'추론은 주어진 정보를 근거로 다른 결론을 얻는 과정입니다. 여기서는 어떤 가정을 받아들였을 때, 정해진 논리 규칙으로 무엇을 이끌어 낼 수 있는지 살펴봅니다.',claimRefs:['claim:logic.inference.proof-structure','claim:logic.explosion.not-reality']},
    {id:'symbols',title:'문장을 P·Q·R로 짧게 적습니다',text:'가상의 예를 들어 P는 “버튼을 눌렀다”, Q는 “표시등이 켜졌다”, R은 “알림이 표시됐다”라는 문장에 붙인 이름이라고 합시다. 실제 기기의 작동을 설명하는 예는 아닙니다.',claimRefs:['claim:logic.inference.proof-structure','claim:logic.explosion.not-reality']},
    {id:'conditional',title:'→는 “만약 …라면”으로 읽습니다',text:'P → Q는 “P라면 Q”입니다. 이것과 P가 함께 주어지면 Q를 얻습니다. 예에서는 “버튼을 누르면 표시등이 켜진다”와 “버튼을 눌렀다”를 받아들이고, 표시등이 켜졌다는 결론을 얻는 셈입니다.',claimRefs:['claim:logic.inference.modus-ponens']},
    {id:'premises',title:'전제는 출발점으로 삼는 가정입니다',text:'이번 추론에서 사용하기로 한 가정을 전제라고 합니다. 전제로 적었다고 실제 사실로 확인된 것은 아닙니다. 화면은 선택한 전제에서 무엇이 따라 나오는지를 계산합니다.',claimRefs:['claim:logic.inference.proof-structure','claim:logic.explosion.not-reality']},
    {id:'goal',title:'목표는 얻고 싶은 결론입니다',text:'목표를 적는 것만으로 그 식이 증명되지는 않습니다. 기본 예에서는 P에서 Q를, 다시 Q에서 R을 얻으려 합니다. 다른 예시를 골랐다면 화면의 전제와 목표에 맞춰 따라가세요.',claimRefs:['claim:logic.inference.modus-ponens']},
    {id:'reading',title:'근거 → 규칙 → 결론 순서로 봅니다',text:'각 행은 식을 한 줄 적은 것입니다. 행 번호는 앞의 근거를 가리키는 주소입니다. 도표는 사용한 행과 적용한 규칙, 새로 얻은 결론을 보여줍니다. 이제 입력한 전제부터 한 줄씩 살펴보겠습니다.',claimRefs:['claim:logic.inference.modus-ponens']}
  ],
  premiseNotes:{
    P:'P는 이번에 출발점으로 삼은 문장입니다. 가상 예시에서는 “버튼을 눌렀다”에 해당합니다. 기본 조건문 연결 예시에서는 이 문장과 “P라면 Q”를 함께 써서 Q를 얻습니다.',
    '(P → Q)':'“P라면 Q”라는 가정입니다. 조건문을 가지고 있다는 것과 P를 가지고 있다는 것은 다릅니다. 이 조건문이 쓰일 때 P를 어느 행에서 확보했는지 함께 찾아보세요.',
    '(Q → R)':'“Q라면 R”이라는 가정입니다. 이 조건문을 이용해 R로 나아가려면 Q가 필요합니다. 기본 예시에서는 앞의 P와 P → Q로 Q를 얻은 다음, 이 조건문에 연결합니다.'
  },
  rules:{
    premise:{text:'이 행은 입력에 포함된 전제입니다. 다른 행에서 계산해 얻은 결론이 아닙니다. 다음 단계에서 이 가정을 실제로 참조하는지, 아니면 이번 경로에는 쓰이지 않는지 구별해 보세요.',claimRefs:['claim:logic.inference.proof-structure','claim:logic.explosion.not-reality']},
    'modus-ponens':{text:'A → B와 A가 모두 준비되었을 때 B를 얻는 조건문 제거입니다. 조건문만 있다고 B가 생기지는 않습니다. B와 A → B만으로 A를 거꾸로 얻는 규칙도 아닙니다. 도표의 두 근거가 어떻게 맞물리는지 확인하세요.',claimRefs:['claim:logic.inference.modus-ponens']},
    'and-elimination':{text:'A ∧ B는 “A이고 B이다”로 읽습니다. 두 문장을 함께 담고 있으므로 A 또는 B를 각각 꺼낼 수 있습니다. 이것을 ∧ 제거라고 합니다. “A 또는 B”라는 논리합에서 한쪽을 마음대로 고르는 것과는 다릅니다.',claimRefs:['claim:logic.inference.and-elimination']},
    'and-introduction':{text:'A와 B를 각각 사용할 수 있으면 A ∧ B로 묶을 수 있습니다. 두 항 모두 근거가 있어야 합니다. 이 모형은 식을 끝없이 만들지 않도록 목표의 부분식에 한해서만 이런 도입을 시도합니다.',claimRefs:['claim:logic.inference.and-introduction']},
    'or-introduction':{text:'A ∨ B는 “A 또는 B”, 즉 하나 이상이 성립한다는 뜻입니다. A를 사용할 수 있으면 A ∨ B를 도입할 수 있습니다. B까지 증명했다는 의미는 아닙니다. 반대로 A ∨ B만으로 A를 꺼낼 수도 없습니다.',claimRefs:['claim:logic.inference.or-introduction']},
    contradiction:{text:'¬A는 “A가 아니다”, ⊥는 모순을 표시하는 기호입니다. 한 식과 그 부정이 함께 사용 가능하면 ⊥을 얻는 경로입니다. 단순히 서로 다른 글자인 것이 아니라, 두 근거가 서로 부정 관계인지 확인하세요.',claimRefs:['claim:logic.explosion.from_pair']},
    explosion:{text:'이 자연연역 체계에서는 모순 ⊥에서 임의의 목표식을 도출하는 ⊥ 제거를 사용합니다. 이것을 폭발이라고 부릅니다. 목표가 현실 세계의 사실로 확인되었다는 뜻은 아닙니다.',claimRefs:['claim:logic.explosion.rule','claim:logic.explosion.not-reality']}
  },
  outro:[
    {id:'result',title:'목표와 마지막 흐름을 대조합니다',text:'결과를 볼 때는 목표에 도달했는지뿐 아니라 어떤 가정과 규칙을 썼는지도 함께 확인하세요. 도출된 식이 목표와 같아도, 이 결과는 선택한 가정 아래의 도출 관계를 보여줍니다.',claimRefs:['claim:logic.inference.proof-structure','claim:logic.explosion.not-reality']},
    {id:'missing',title:'찾지 못함과 거짓은 다릅니다',text:'이 모형은 일부 규칙만 사용하는 제한된 탐색입니다. 경로를 찾지 못해도 목표가 거짓이거나 다른 증명도 불가능하다고 결론 내릴 수 없습니다. 웹 실험실은 이 경우 흐름을 비우고 탐색 한계를 안내합니다.',claimRefs:['claim:logic.inference.proof-structure','claim:logic.explosion.not-reality']},
    {id:'compare',title:'입력을 바꾸며 근거를 비교해 보세요',text:'웹의 전제 포함 여부를 바꾸거나 목표를 수정하면 같은 모형이 다시 계산합니다. 목표에 도달하는 입력에서는 현재 행의 배경이 차오르며 다음 단계로 진행합니다. 멈춘 뒤 참조 행을 직접 비교할 수도 있습니다.',claimRefs:['claim:logic.inference.modus-ponens']},
    {id:'summary',title:'가정 → 근거 → 규칙 → 결론',text:'처음 선택한 전제, 참조한 근거, 적용한 규칙, 얻은 결론을 구별해 읽는 것이 핵심입니다. 도출과 현실의 사실 판단을 구분하고, 못 찾은 경로를 불가능성의 증명으로 바꾸지 마세요. 설명과 출처는 내용 검토 대기 상태입니다.',claimRefs:['claim:logic.explosion.not-reality']}
  ]
};
