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
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/statistics/two-children/figure-question.svg",
        "alt": "가족에 질문 → 같은 문장 → 한 아이 관측. 정보를 얻은 절차에 따라 계산이 달라져요",
        "caption": "정보를 얻은 절차에 따라 계산이 달라져요"
      },
      "suggestion": {
        "example": "question"
      }
    },
    {
      "id": "model",
      "title": "먼저 단순한 모형을 정하자",
      "block": 1,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/statistics/two-children/figure-model.svg",
        "alt": "독립이며 아들/딸 확률 각각 1/2인 모형. 출생순 BB, BG, GB, GG는 각각 1/4이다.",
        "caption": "B = 아들 · G = 딸 · 현실 인구 통계의 주장이 아님"
      },
      "suggestion": {
        "example": "model"
      }
    },
    {
      "id": "filter",
      "title": "가족에게 “적어도 한 명?”을 물었다면",
      "block": 2,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/statistics/two-children/figure-filter.svg",
        "alt": "가족을 균등 추출하고 적어도 한 명이 아들인 가족을 선별한다. 관측 우도는 1,1,1,0이고 사후확률은 1/3,1/3,1/3,0이다.",
        "caption": "가족마다 사전확률 1/4 × 관측 우도 → 정규화"
      },
      "suggestion": {
        "example": "filter"
      }
    },
    {
      "id": "child",
      "title": "자녀 한 명을 무작위로 만났다면",
      "block": 3,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/statistics/two-children/figure-child.svg",
        "alt": "가족을 균등 추출한 뒤 아이 한 명을 균등 선택해 아들을 관측한다. 관측 우도는 1,1/2,1/2,0. 사후확률은 1/2,1/4,1/4,0이다.",
        "caption": "가족의 수만 세면 관측 우도의 차이가 사라져요"
      },
      "suggestion": {
        "example": "child"
      }
    },
    {
      "id": "missing",
      "title": "부모의 자발적인 말이라면?",
      "block": 4,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/statistics/two-children/figure-missing.svg",
        "alt": "BB, BG, GB에서 부모가 그 말을 할 확률이 모두 미정이다. 보고 정책을 알기 전에는 유일한 답을 확정할 수 없다.",
        "caption": "모르는 관측·보고 확률을 임의로 같게 두지 않기"
      },
      "suggestion": {
        "example": "missing"
      }
    },
    {
      "id": "transfer",
      "title": "몬티 홀·검사 결과와 같은 질문",
      "block": 5,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/statistics/two-children/figure-transfer.svg",
        "alt": "모집단 → 정보 과정 → 관측한 것 → 가중치 합. 몬티 홀·검사 결과에서도 먼저 관측 과정을 물어보세요",
        "caption": "몬티 홀·검사 결과에서도 먼저 관측 과정을 물어보세요"
      },
      "suggestion": {
        "example": "transfer"
      }
    }
  ],
  "interactive": "two-children",
  "styles": [
    "/topics/statistics/possibility-lab.css"
  ]
} satisfies ContentPage;
