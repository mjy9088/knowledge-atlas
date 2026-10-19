import type {ContentPage} from '../../../packages/content/types.js';

export default {
  slug: 'nuclear-constituents',
  articleId: 'article:physics-discovery.nuclear-constituents.ko',
  label: '핵의 구성 입자',
  category: '물리 · 발견',
  interactive: 'nuclear-evidence',
  styles: ['/topics/physics/nuclear-evidence.css'],
  claimRefs: [
    'claim:physics-discovery.nuclear-constituents.scope',
    'claim:physics-discovery.nuclear-constituents.proton',
    'claim:physics-discovery.nuclear-constituents.neutron',
  ],
  scenes: [
    {id: 'question', title: '핵을 찾은 것과 구성은 다릅니다', block: 0, from: 0, cards: ['산란 | 작은 양전하 중심', '남은 질문 | 무엇으로 구성?'], known: '증거 범위의 구별'},
    {id: 'proton', title: '수소핵이 핵반응에서 나왔습니다', block: 1, from: 0, cards: ['입사 | α', '표적 | 질소', '방출 | 양전하 수소핵'], known: '양성자 증거', suggestion: {example: 'proton'}},
    {id: 'neutral', title: '같은 질량과 속도로 비교하면', block: 2, from: 0, cards: [], known: '중성 방사선', figure: {src: '/content/physics-discovery/nuclear-constituents/figure-neutral-penetration.svg', alt: '입자 가설에서 질량과 입사 속도를 같다고 둘 때의 조건부 정성 비교. 양전하 양성자는 더 일찍 멈추고 베릴륨 방사선은 더 깊이 진행한다. 이 비교는 매우 작은/0 전하 해석을 지지하지만 감마선 대안을 투과만으로 해결하지 않는다. 경로는 측정 궤적이나 축척이 아니다.', caption: '조건부 비교: 같은 질량·속도라면 · 입자 해석 지지, 감마선 대안은 투과만으로 미해결 · 정성도, 축척 아님'}},
    {id: 'collision-model', title: '최대 반동 식의 조건을 세우면', block: 3, from: 0, to: 2, cards: [], known: '충돌식의 변수와 조건', figure: {src: '/content/physics-discovery/nuclear-constituents/figure-collision-model.svg', alt: '점선 투사체 M은 입사 입자 가설의 모형 표시다. 속도 V로 처음 정지한 표적 A를 정면 탄성 충돌한다. 충돌 뒤 전하 입자로 나타난 표적의 최대 반동 속도 u=2MV/(M+A)를 관측한다. 화살표는 힘이 아닌 속도이며 임의 각도 충돌식이 아니다.', caption: '모형 조건: 표적 처음 정지 · 정면 탄성 충돌 · 점선 M은 가설, 관찰량은 전하 반동 u최대 · 도식, 축척 아님'}},
    {id: 'recoil', title: '두 최대 반동 속도로 질량을 구했습니다', block: 3, from: 2, cards: [], known: '충돌 추론', figure: {src: '/content/physics-discovery/nuclear-constituents/figure-recoil-mass.svg', alt: '같은 입사 속도 V의 투사체 M과 수소 A=1, 질소 A=14 표적을 비교한다. 보고된 최대 반동 속도 3.7×10⁹ cm/s와 4.7×10⁸ cm/s의 비에서 V를 약분하면 M≈0.89 양성자 질량 단위를 얻는다. 역사적 추정이며 화살표 길이는 속도 축척이 아니다.', caption: 'H: 3.7×10⁹ cm/s · N: 4.7×10⁸ cm/s · 공통 V에서 M≈0.89 양성자 질량 단위 · 역사적 추정, 그림의 속도 길이는 축척 아님'}},
    {id: 'limit', title: '한 단서만으로는 부족했습니다', block: 4, from: 0, cards: ['투과력만 | 감마선 대안', '반동 비교 | 입자 질량', '후속 | 핵 구성 모형'], known: '간접 증거의 결합'},
    {id: 'transfer', title: '표적 하나면 충분할까요?', block: 5, from: 0, cards: ['한 표적 | M과 V 미지', '두 표적 | 같은 V', '비를 취해 | V 약분'], known: '여러 표적 비교'},
  ],
} satisfies ContentPage;
