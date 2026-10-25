import type {ContentPage} from '../../../packages/content/types.js';
export default {
  "slug": "two-children",
  "articleId": "article:statistics.two-children.ko",
  "label": "적어도 한 명이 아들: 그걸 어떻게 알았나요?",
  "category": "statistics",
  "model": null,
  "experiment": false,
  "navigation": {
    "chapters": [{"id": "observation-denominators", "title": "관측이 남기는 경우를 세기", "sceneIds": ["question", "model", "filter", "child", "missing", "transfer"]}],
    "relatedArticleIds": ["article:statistics.monty-hall.ko"]
  },
  "claimRefs": [
    "claim:statistics.two-children.family-model",
    "claim:statistics.two-children.family-filter",
    "claim:statistics.two-children.family-child",
    "claim:statistics.two-children.reporting-rule"
  ],
  "scenes": [
    {
      "id": "question",
      "title": "한 명이 아들이면 다른 한 명은?",
      "block": 0,
      "from": 0,
      "cards": [],
      "known": "참인 가족 정보와 그 정보를 얻는 관측 절차를 구별한다.",
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
      "known": "출생순 네 가족의 동일한 사전확률과 BG·GB의 구별을 설명한다.",
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
      "title": "아들이 있는 가족만 남기면?",
      "block": 2,
      "from": 0,
      "cards": [],
      "known": "세 가족이 각각 1/4을 남겨 관측의 분모가 3/4임을 계산한다.",
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
      "known": "여덟 관측 조합에서 네 조합이 남는 이유와 가족별 가중치를 연결한다.",
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
      "known": "참인 보고와 가족별 보고 확률을 구별하고 미지의 분모를 밝힌다.",
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
      "title": "첫째가 아들이라면 무엇이 남을까요?",
      "block": 5,
      "from": 0,
      "cards": [],
      "known": "첫째를 지정한 조건으로 BB·BG만 남기고 둘째의 독립성을 적용한다.",
      "figure": {
        "src": "/content/statistics/two-children/figure-transfer.svg",
        "alt": "모든 가족에게 첫째가 아들인지 묻고 진실한 예에 조건을 겁니다. 각각 사전확률 1/4인 BB와 BG는 남고 GB와 GG는 제외됩니다. 두 아들인 BB의 확률 1/4을 남은 합 1/2로 나누면 1/2입니다.",
        "caption": "같은 1/2라도 남는 경우는 다릅니다. 이번에는 첫째라는 좌표가 고정되어 있습니다."
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
