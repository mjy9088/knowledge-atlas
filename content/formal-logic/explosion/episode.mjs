// Canonical web explanation and its short projection; original wording, no quotations.
export const EXPLOSION_EPISODE = {
  id:'lesson:logic.explosion.short.ko', version:1,
  title:'모순에서 무엇이든 증명할 수 있을까?',
  reviewStatus:'needs-content-review',
  sourceRefs:['source:forallx-calgary-2026','source:baskent-paraconsistency-2011','source:marks-set-theory-2026'],
  sections:[
    {id:'question',durationMs:12000,scene:'Q',phase:'intro',title:'모순에서 무엇이든 증명할 수 있을까?',text:'한 문장과 그 부정을 둘 다 전제로 받아들이면 어떻게 될까요? 여기서는 고전 자연연역의 규칙으로 결론을 도출한다는 말이 무엇인지 살펴봅니다.',claimRefs:['claim:logic.explosion.rule']},
    {id:'symbols',durationMs:13000,scene:'Q',phase:'intro',title:'P와 ¬P: 문장과 그 부정',text:'P는 문장에 붙인 이름입니다. 한 정수를 정해 “이 수는 짝수다”라고 합시다. ¬P는 “이 수는 짝수가 아니다”입니다. 같은 수에 대해 둘을 함께 가정하며, 사실로 확인했다는 뜻은 아닙니다.',claimRefs:['claim:logic.explosion.from_pair','claim:logic.explosion.not-reality']},
    {id:'premise-p',durationMs:6000,scene:'Q',line:0,title:'전제 1: P',text:'전제는 이번 도출의 출발점으로 받아들이는 가정입니다. 먼저 P를 놓습니다.',claimRefs:['claim:logic.inference.proof-structure']},
    {id:'premise-not-p',durationMs:7000,scene:'Q',line:1,title:'전제 2: ¬P',text:'이번에는 P의 부정도 함께 놓습니다. 서로 무관한 두 문장이 아니라 한 문장과 바로 그 부정입니다.',claimRefs:['claim:logic.explosion.from_pair']},
    {id:'contradiction',durationMs:11000,scene:'Q',line:2,title:'두 전제에서 모순 ⊥',text:'P와 ¬P를 함께 사용하면 모순을 나타내는 ⊥를 얻습니다. 도표의 두 근거가 이 단계에 함께 연결되는지 확인하세요.',claimRefs:['claim:logic.explosion.from_pair']},
    {id:'explosion',durationMs:14000,scene:'Q',line:3,title:'⊥에서 Q: 폭발 규칙',text:'이 체계는 ⊥에서 임의의 문장을 도출하는 규칙을 채택합니다. Q가 P와 관련된 내용일 필요도 없습니다. 이 규칙을 모순 폭발, 또는 ⊥ 제거라고 부릅니다.',claimRefs:['claim:logic.explosion.rule']},
    {id:'change-r',durationMs:10000,scene:'R',line:3,title:'Q 대신 R을 골라도',text:'목표를 R로 바꿨습니다. 새 사실을 조사한 것이 아닙니다. 같은 모순에 같은 폭발 규칙을 적용해 다른 목표도 도출한 것입니다.',claimRefs:['claim:logic.explosion.rule','claim:logic.explosion.not-reality']},
    {id:'change-s',durationMs:7000,scene:'S',line:3,title:'S도 같은 경로로',text:'S도 마찬가지입니다. 핵심은 특정 결론의 내용이 아니라 임의의 결론에 이 규칙을 적용할 수 있다는 점입니다.',claimRefs:['claim:logic.explosion.rule']},
    {id:'remove-premise',durationMs:13000,scene:'missing',phase:'outro',title:'¬P를 빼면 이 경로는 끊깁니다',text:'이제 P만 남겼습니다. 이 모순 폭발 경로로는 ⊥와 S를 얻지 못합니다. 이것만 보고 S가 거짓이라거나 다른 모든 증명도 불가능하다고 판단할 수는 없습니다.',claimRefs:['claim:logic.explosion.from_pair','claim:logic.explosion.not-reality']},
    {id:'truth',durationMs:15000,scene:'Q',phase:'outro',title:'증명했다고 현실의 사실이 될까요?',text:'아닙니다. 지금 확인한 것은 선택한 전제와 규칙 아래에서의 도출입니다. 고전논리에서는 P와 ¬P를 동시에 참으로 만드는 해석이 없습니다. 모순된 가정에서 나온 Q를 현실의 사실로 확인한 셈이 아닙니다.',claimRefs:['claim:logic.explosion.not-reality','claim:logic.classical.contradiction-unsatisfiable']},
    {id:'consistency',durationMs:14000,scene:'Q',phase:'outro',title:'그래서 일관성이 중요합니다',text:'이런 체계에서 모순이 증명되면 모든 문장이 도출되어, 증명 가능하다는 것만으로 문장을 구별할 수 없게 됩니다. 모순이 도출되지 않는다는 일관성 조건이 중요한 이유입니다.',claimRefs:['claim:logic.consistency.nontrivial']},
    {id:'summary',durationMs:12000,scene:'Q',phase:'outro',title:'모순 + 폭발 규칙 ⇒ 임의의 결론',text:'모순된 전제에서 무엇이든 도출된다는 것과 무엇이든 현실에서 참이라는 것은 다릅니다. 폭발을 허용하지 않는 논리와 ZFC의 일관성·독립성은 웹의 연관 해설에서 이어서 살펴볼 수 있습니다.',claimRefs:['claim:logic.explosion.rule','claim:logic.explosion.not-reality','claim:logic.paraconsistent.nonexplosive','claim:logic.independence.ch']}
  ]
};
