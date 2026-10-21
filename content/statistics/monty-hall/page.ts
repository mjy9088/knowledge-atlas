import type {ContentPage} from '../../../packages/content/types.js';
export default {
  "slug": "monty-hall",
  "articleId": "article:statistics.monty-hall.ko",
  "label": "문 두 개, 정말 반반일까요?",
  "category": "statistics",
  "model": null,
  "experiment": false,
  "navigation": {
    "chapters": [{"kind":"mainline","id":"host-and-observation","title":"공개 규칙과 관측의 무게","sceneIds":["question","protocol","strategy","shortened","compare","specific","close"]}],
    "relatedArticleIds": ["article:statistics.two-children.ko"]
  },
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
      },
      "suggestion": {
        "example": "question"
      }
    },
    {
      "id": "protocol",
      "title": "유명한 몬티 홀 문제라면?",
      "block": 1,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-protocol.svg",
        "alt": "상품 균등 → 정답을 앎 → 항상 오답 → 항상 교환. 오답 둘 중 고를 수 있으면 균등하게 선택",
        "caption": "오답 둘 중 고를 수 있으면 균등하게 선택"
      },
      "suggestion": {
        "example": "protocol"
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
      },
      "suggestion": {
        "example": "strategy"
      }
    },
    {
      "id": "shortened",
      "title": "과연 그럴까요? 처음 문제는 달랐습니다",
      "block": 3,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-shortened.svg",
        "alt": "오답 문 공개 → 공개 정책 ? → 사후확률 ?. “오답을 봤다”와 “항상 오답만 연다”를 구분",
        "caption": "“오답을 봤다”와 “항상 오답만 연다”를 구분"
      },
      "suggestion": {
        "example": "shortened"
      }
    },
    {
      "id": "compare",
      "title": "우연히 오답을 본 게임은 얼마나 남을까요?",
      "block": 4,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-compare.svg",
        "alt": "정답을 알고 항상 오답을 공개하면 교환 승률 2/3. 모르고 무작위로 공개한 뒤 오답을 본 실행만 남기면 가중치가 1/3 대 1/3으로 같아져 교환 승률 1/2.",
        "caption": "처음 선택 1번 · 상품 균등 · 공개한 문이 오답인 관측"
      },
      "suggestion": {
        "example": "compare"
      }
    },
    {
      "id": "specific",
      "title": "2번을 열었다는 정보까지 쓰면?",
      "block": 5,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-specific.svg",
        "alt": "처음 1번을 골랐고 정답을 아는 진행자가 2번을 열어 오답을 보인 사건 D2에 조건을 겁니다. 상품 위치가 1,2,3번일 때 남는 확률은 t/3,0,1/3입니다. 여기서 t는 상품이 1번일 때 진행자가 2번을 여는 확률입니다. 3번으로 교환해 이길 조건부확률은 1/(1+t)입니다.",
        "caption": "공개 번호를 가리지 않은 전체 전략과, 2번이 열린 게임만 남긴 계산은 서로 다른 질문입니다."
      },
      "suggestion": {
        "example": "specific"
      }
    },
    {
      "id": "close",
      "title": "진행자의 선택 규칙이 중요한 이유",
      "block": 6,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-close.svg",
        "alt": "사전 경우 → 공개 정책 → 실제 관측 → 다시 가중. 정책이 빠진 문장에는 답이 하나로 정해지지 않을 수 있어요",
        "caption": "정책이 빠진 문장에는 답이 하나로 정해지지 않을 수 있어요"
      },
      "suggestion": {
        "example": "close"
      }
    }
  ],
  "interactive": "monty-hall",
  "styles": [
    "/topics/statistics/possibility-lab.css"
  ]
} satisfies ContentPage;
