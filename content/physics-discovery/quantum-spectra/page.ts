import type {ContentPage} from '../../../packages/content/types.js';

export default {
  slug: 'quantum-spectra',
  articleId: 'article:physics-discovery.quantum-spectra.ko',
  label: '양자와 선 스펙트럼',
  category: '물리 · 발견',
  styles: ['/topics/physics/quantum-spectra.css'],
  claimRefs: [
    'claim:physics-discovery.quantum-spectra.lines',
    'claim:physics-discovery.quantum-spectra.energy-differences',
    'claim:physics-discovery.quantum-spectra.bohr-limit',
  ],
  scenes: [
    {id: 'question', title: '선택한 발머 전이의 파장은 무엇을 말할까요?', block: 0, from: 0, cards: ['자료 범위 | NIST 원자 수소 표의 선택한 발머 전이', '표 값 | 656.3 · 486.1 · 434.0 · 410.2 nm'], known: '선택한 표 자료의 범위'},
    {id: 'pattern', title: '파장 간격은 고르지 않습니다', block: 1, from: 0, cards: [], known: '선형 공기 파장 축의 선택한 발머 전이', figure: {src: '/content/physics-discovery/quantum-spectra/figure-balmer-lines.svg', alt: '400에서 670 나노미터까지의 선형 공기 파장 축에 NIST 표에서 고른 원자 수소 발머 전이의 반올림 공기 파장 410.2, 434.0, 486.1, 656.3 나노미터가 실제 수치 간격대로 놓입니다. 네 표시는 서로 다른 높이의 라벨과 지시선으로 구분됩니다. 선 높이는 같고 위치만 나타내며 밝기 자료가 아닙니다. 도식은 NIST 표에서 고른 네 전이만 표시합니다.', caption: '원본 개념도 · NIST 표에서 고른 네 전이의 공기 파장 반올림 · 공통 선형 축 · 위치 표시이며 밝기 자료 아님'}},
  {id: 'energy', title: '정확한 관계 뒤에 근사를 둡니다', block: 2, from: 0, to: 5, cards: [], known: '개별 선의 공기 파장에서 광자 에너지로의 변환', figure: {src: '/content/physics-discovery/quantum-spectra/figure-energy-conversion.svg', alt: '개별 한 광자 선에서 정확한 E=h뉴=hc 나누기 람다 진공 관계와 같은 진동수에서의 람다 진공=nₐᵢᵣ 곱하기 람다 공기 관계를 먼저 놓고 nₐᵢᵣ를 약 1로 근사합니다. hc=1239.84 전자볼트 나노미터로 410.2 나노미터는 약 3.02 전자볼트, 656.3 나노미터는 약 1.89 전자볼트입니다. h, 뉴, c, 전자볼트와 공기 굴절률 nₐᵢᵣ의 뜻을 함께 표시합니다.', caption: '개별 선의 정확한 관계: E=hν=hc/λvac, λvac=nₐᵢᵣλair · 근사: nₐᵢᵣ≈1 · 410.2 nm→3.02 eV, 656.3 nm→1.89 eV'}},
    {id: 'transition-limit', title: '국소 방출률은 관측 밝기와 다릅니다', block: 2, from: 5, cards: [], known: '국소 선 방출률과 관측 밝기의 추가 조건', figure: {src: '/content/physics-discovery/quantum-spectra/figure-transition-conditions.svg', alt: '광자 에너지, 초의 역수 단위 전이율 Aki, 세제곱미터당 상위 준위 들뜬 원자 수밀도 Nk가 국소 선 방출률로 향합니다. 국소 방출률은 광원 부피와 입체각당 와트 단위입니다. 관측 밝기에는 불투명도, 광원 기하, 기기 응답이 더 필요합니다. E1과 함께 방사 가능한 M1, E2도 표시되며 수치 밝기 자료는 없습니다.', caption: '국소 εline=(4π)⁻¹hνAkiNk · Aki [s⁻¹] · Nk [m⁻³] · 관측 밝기에는 불투명도·기하·기기 응답이 추가로 필요'}},
    {id: 'bohr', title: '모형 진공값과 표 공기값을 구별합니다', block: 3, from: 0, cards: [], known: '역사 모형의 수소 스펙트럼 성공과 파장 표기 관례', figure: {src: '/content/physics-discovery/quantum-spectra/figure-hydrogen-levels.svg', alt: '이상화한 수소 에너지 E_n은 마이너스 13.6 전자볼트를 주양자수 제곱으로 나눈 값입니다. n=2부터 6까지 준위를 그 에너지에 비례해 배치합니다. 3에서 2 전이는 모형 진공 파장 약 656 나노미터와 표의 반올림 공기 파장 656.3 나노미터를, 6에서 2 전이는 약 410과 410.2 나노미터를 대응시킵니다. 모형 값은 근사식의 정밀도에 맞춰 반올림했습니다. 화살표는 상태 변화이며 고전적 공간 경로가 아닙니다.', caption: '근사 모형 진공 예측 ≈656/410 nm ↔ NIST 표의 반올림 공기값 656.3/410.2 nm · 상태 변화이며 실제 경로 아님'}},
  {id: 'limit', title: '역사 모형과 현대 상태를 구별합니다', block: 4, from: 0, cards: ['실패 | 헬륨 · 다전자 원자', '현대 | 전자 상태를 나타내는 ψ', '의미 | |⁠ψ⁠|²는 위치 확률 밀도', '유지 | |⁠ΔE⁠|⁠=⁠hν'], known: '보어 모형의 적용 범위'},
    {id: 'transfer', title: '더 큰 에너지가 더 밝다는 뜻은 아닙니다', block: 5, from: 0, cards: [], known: '에너지, 국소 방출률, 관측 밝기의 구별', figure: {src: '/content/physics-discovery/quantum-spectra/figure-transfer.svg', alt: '410.2 나노미터의 약 3.02 전자볼트가 656.3 나노미터의 약 1.89 전자볼트보다 큽니다. 그러나 두 선의 전이율 Aki와 상위 준위 원자 수밀도 Nk가 없으면 국소 선 방출률을 비교할 수 없습니다. 불투명도, 광원 기하, 기기 응답이 없으면 관측 밝기 순서도 정할 수 없습니다.', caption: '에너지 순서: 410.2 nm > 656.3 nm · 국소 방출률에는 Aki·Nk, 관측 밝기에는 불투명도·기하·기기 응답이 더 필요'}},
  ],
} satisfies ContentPage;
