import type {ContentPage} from '../../../packages/content/types.js';
export default {
  "slug": "two-children",
  "articleId": "article:statistics.two-children.ko",
  "label": "적어도 한 명이 아들: 그걸 어떻게 알았나요?",
  "category": "statistics",
  "model": null,
  "experiment": false,
  "claimRefs": [
    "claim:statistics.two-children.family-model",
    "claim:statistics.two-children.family-filter",
    "claim:statistics.two-children.family-child"
  ],
  "scenes": [
    {
      "id": "question",
      "title": "한 명이 아들이면 다른 한 명은?",
      "block": 0,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다."
    },
    {
      "id": "model",
      "title": "먼저 단순한 모형을 정하자",
      "block": 1,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다."
    },
    {
      "id": "filter",
      "title": "가족에게 “적어도 한 명?”을 물었다면",
      "block": 2,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다."
    },
    {
      "id": "child",
      "title": "자녀 한 명을 무작위로 만났다면",
      "block": 3,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다."
    },
    {
      "id": "missing",
      "title": "부모의 자발적인 말이라면?",
      "block": 4,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다."
    },
    {
      "id": "transfer",
      "title": "몬티 홀·검사 결과와 같은 질문",
      "block": 5,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다."
    }
  ]
} satisfies ContentPage;
