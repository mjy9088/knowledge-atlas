import type {ContentPage} from '../../../packages/content/types.js';
// Presentation metadata; prose and claims stay in adjacent data files.
export default {
  "category": "논리",
  "slug": "paraconsistent-logic",
  "articleId": "article:logic.paraconsistent.ko",
  "label": "초일관 논리",
  "experiment": true,
  "model": "fde",
  "scenes": [
    {
      "id": "rules",
      "title": "폭발 규칙을 항상 허용해야 할까요?",
      "block": 0,
      "from": 0,
      "to": 2,
      "cards": [
        "A와 ¬A",
        "임의의 B로의 폭발을 일반적으로 허용하지 않음"
      ],
      "known": "초일관성의 비폭발성"
    },
    {
      "id": "intuitionistic",
      "title": "고전논리가 아니라면?",
      "block": 0,
      "from": 2,
      "cards": [
        "통상적인 직관주의 논리",
        "폭발을 허용"
      ],
      "known": "직관주의 논리와 폭발의 관계"
    },
    {
      "id": "truth",
      "title": "추론 규칙과 진리관을 구별해요",
      "block": 1,
      "from": 0,
      "to": 2,
      "cards": [
        "어떤 추론을 허용하는가",
        "어떤 모순이 참이라고 주장하는가"
      ],
      "known": "초일관 추론과 참인 모순을 인정하는 진리관의 구별"
    },
    {
      "id": "boundary",
      "title": "어떤 규칙을 쓰는지 먼저 확인해요",
      "block": 1,
      "from": 2,
      "cards": [
        "논리마다 규칙이 다름",
        "고전 규칙을 그대로 옮기지 않음"
      ],
      "known": "각 논리의 규칙을 확인해야 하는 이유"
    },
    {
      "id": "four-values",
      "title": "네 값으로 살펴보는 정보",
      "block": 2,
      "from": 0,
      "cards": [
        "T · F",
        "B · N"
      ],
      "known": "네 값과 부정의 의미"
    },
    {
      "id": "counterexample",
      "title": "모순을 허용하는 반례 평가",
      "block": 3,
      "from": 0,
      "cards": [
        "전제는 지정값",
        "목표는 비지정값"
      ],
      "known": "FDE에서 추론이 성립하지 않음을 보이는 반례"
    },
    {
      "id": "valid-rules",
      "title": "그래도 사용할 수 있는 추론",
      "block": 4,
      "from": 0,
      "cards": [
        "∧ 제거",
        "∨ 도입"
      ],
      "known": "FDE에서 유지되는 추론 규칙"
    }
  ]
} satisfies ContentPage;
