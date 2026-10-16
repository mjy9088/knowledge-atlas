import type {ContentPage} from '../../../packages/content/types.js';
// Presentation metadata; prose and claims stay in adjacent data files.
export default {
  "category": "집합론",
  "slug": "zfc",
  "articleId": "article:set.zfc.ko",
  "label": "ZFC",
  "experiment": true,
  "model": "sets",
  "scenes": [
    {
      "id": "sets",
      "title": "집합론은 무엇을 다룰까요?",
      "block": 0,
      "from": 0,
      "to": 1,
      "cards": [
        "집합",
        "원소가 속한다는 관계"
      ],
      "known": "집합론의 기본 대상"
    },
    {
      "id": "axioms",
      "title": "ZFC는 출발 가정을 정합니다",
      "block": 0,
      "from": 1,
      "cards": [
        "ZF",
        "선택공리 C",
        "ZFC"
      ],
      "known": "ZFC의 이름과 공리의 역할"
    },
    {
      "id": "consistency",
      "title": "Con(ZFC)는 무슨 뜻일까요?",
      "block": 1,
      "from": 0,
      "to": 1,
      "cards": [
        "Con(ZFC)",
        "ZFC에서 모순을 증명할 수 없음"
      ],
      "known": "Con(ZFC)의 의미"
    },
    {
      "id": "boundary",
      "title": "독립성 설명에 조건이 붙는 이유",
      "block": 1,
      "from": 1,
      "cards": [
        "만일 모순이 증명되면",
        "CH와 ¬CH도 도출"
      ],
      "known": "CH 독립성 설명의 일관성 조건"
    },
    {
      "id": "membership",
      "title": "원소와 부분집합은 다른 관계입니다",
      "block": 2,
      "from": 0,
      "cards": [
        "X ∈ A · A ⊆ B",
        "X ∈ B"
      ],
      "known": "부분집합 정의를 사용한 원소 전달"
    },
    {
      "id": "extensionality",
      "title": "서로 포함하면 같은 집합입니다",
      "block": 3,
      "from": 0,
      "cards": [
        "A ⊆ B · B ⊆ A",
        "A = B"
      ],
      "known": "외연성 공리의 한 적용"
    }
  ]
} satisfies ContentPage;
