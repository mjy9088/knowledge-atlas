import type {ContentPage} from '../../../packages/content/types.js';
// Presentation metadata; prose and claims stay in adjacent data files.
export default {
  "category": "집합론",
  "slug": "continuum-hypothesis",
  "articleId": "article:set.ch-independence.ko",
  "label": "연속체 가설과 독립성",
  "experiment": true,
  "model": "ch",
  "scenes": [
    {
      "id": "size",
      "title": "무한의 크기도 비교할 수 있나요?",
      "block": 0,
      "from": 0,
      "to": 2,
      "cards": [
        "자연수의 기수",
        "실수의 기수가 더 큼"
      ],
      "known": "일대일 대응과 기수 비교"
    },
    {
      "id": "ch",
      "title": "연속체 가설이 묻는 것",
      "block": 0,
      "from": 2,
      "cards": [
        "CH",
        "그 사이 기수의 집합이 없음"
      ],
      "known": "CH의 의미와 실수 사이 간격과의 구별"
    },
    {
      "id": "independence",
      "title": "ZFC로부터 독립이라는 뜻",
      "block": 1,
      "from": 0,
      "cards": [
        "ZFC가 일관적이라면",
        "CH도 ¬CH도 ZFC만으로 증명되지 않음"
      ],
      "known": "상대일관성 결과와 고정된 이론의 독립성"
    },
    {
      "id": "boundary",
      "title": "탐색 실패와 독립성 증명은 달라요",
      "block": 2,
      "from": 0,
      "cards": [
        "구성가능 우주 · 강제법",
        "별도의 정리가 필요"
      ],
      "known": "컴퓨터의 탐색 실패와 독립성 정리의 구별"
    },
    {
      "id": "branches",
      "title": "두 상대일관성의 갈래",
      "block": 3,
      "from": 0,
      "cards": [
        "Con(ZFC + CH)",
        "Con(ZFC + ¬CH)"
      ],
      "known": "일관성 가정에서 두 확장으로 가는 연결"
    },
    {
      "id": "metaproof",
      "title": "증명되지 않는 두 방향을 합칩니다",
      "block": 4,
      "from": 0,
      "cards": [
        "ZFC ⊬ CH · ZFC ⊬ ¬CH",
        "Ind(CH,ZFC)"
      ],
      "known": "등록된 정리를 사용하는 독립성 연결"
    }
  ]
} satisfies ContentPage;
