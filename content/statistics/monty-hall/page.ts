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
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-question.svg",
        "alt": "1번 문은 내 선택, 3번 문은 오답으로 공개됐고 2번 문은 남아 있다. 공개 규칙은 아직 주어지지 않았다.",
        "caption": "정답은 아직 표시하지 않아요 · 먼저 공개 규칙 확인"
      }
    },
    {
      "id": "protocol",
      "title": "표준 규칙을 빠짐없이",
      "block": 1,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-protocol.svg",
        "alt": "상품 균등 → 정답을 앎 → 항상 오답 → 항상 교환. 오답 둘 중 고를 수 있으면 균등하게 선택",
        "caption": "오답 둘 중 고를 수 있으면 균등하게 선택"
      }
    },
    {
      "id": "strategy",
      "title": "처음 틀렸다면 바꾸면 이깁니다",
      "block": 2,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-strategy.svg",
        "alt": "처음 선택이 1번일 때 상품이 1번이면 교환 패, 2번 또는 3번이면 교환 승. 세 경우는 각각 1/3.",
        "caption": "항상 미선택 오답을 여는 정책 · 무조건 전략 승률"
      }
    },
    {
      "id": "shortened",
      "title": "축약판에서 사라진 조건",
      "block": 3,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-shortened.svg",
        "alt": "오답 문 공개 → 공개 정책 ? → 사후확률 ?. “오답을 봤다”와 “항상 오답만 연다”를 구분",
        "caption": "“오답을 봤다”와 “항상 오답만 연다”를 구분"
      }
    },
    {
      "id": "compare",
      "title": "같은 오답 공개, 다른 우도",
      "block": 4,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-compare.svg",
        "alt": "정답을 알고 항상 오답을 공개하면 교환 승률 2/3. 모르고 무작위로 공개한 뒤 오답을 본 실행만 남기면 가중치가 1/3 대 1/3으로 같아져 교환 승률 1/2.",
        "caption": "처음 선택 1번 · 상품 균등 · 공개한 문이 오답인 관측"
      }
    },
    {
      "id": "specific",
      "title": "어떤 관측에 조건을 걸었나요?",
      "block": 5,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-specific.svg",
        "alt": "아무 오답 문 공개와 특정 번호 문 공개는 서로 다른 조건 사건이다. 특정 번호를 조건으로 삼으면 동률 공개 정책이 중요할 수 있다.",
        "caption": "무조건 전략 승률과 특정 관측 후 확률을 구분"
      }
    },
    {
      "id": "close",
      "title": "정보가 참이라는 것만으로는",
      "block": 6,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-close.svg",
        "alt": "사전 경우 → 공개 정책 → 실제 관측 → 다시 가중. 정책이 빠진 문장에는 답이 하나로 정해지지 않을 수 있어요",
        "caption": "정책이 빠진 문장에는 답이 하나로 정해지지 않을 수 있어요"
      }
    }
  ]
} satisfies ContentPage;
