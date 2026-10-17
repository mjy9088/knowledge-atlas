import type {ContentPage} from '../../../packages/content/types.js';
export default {
  "slug": "monty-hall",
  "articleId": "article:statistics.monty-hall.ko",
  "label": "몬티 홀: 문 하나보다 공개 규칙",
  "category": "statistics",
  "model": null,
  "experiment": false,
  "claimRefs": [
    "claim:statistics.monty-hall.monty-strategy",
    "claim:statistics.monty-hall.monty-observation",
    "claim:statistics.monty-hall.monty-epistemic"
  ],
  "scenes": [
    {
      "id": "question",
      "title": "문이 둘 남았으니 반반일까요?",
      "block": 0,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다."
    },
    {
      "id": "protocol",
      "title": "표준 규칙을 빠짐없이",
      "block": 1,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다."
    },
    {
      "id": "strategy",
      "title": "처음 틀렸다면 바꾸면 이깁니다",
      "block": 2,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다."
    },
    {
      "id": "shortened",
      "title": "축약판에서 사라진 조건",
      "block": 3,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다."
    },
    {
      "id": "compare",
      "title": "같은 오답 공개, 다른 우도",
      "block": 4,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다."
    },
    {
      "id": "specific",
      "title": "어떤 관측에 조건을 걸었나요?",
      "block": 5,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다."
    },
    {
      "id": "close",
      "title": "정보가 참이라는 것만으로는",
      "block": 6,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다."
    }
  ]
} satisfies ContentPage;
