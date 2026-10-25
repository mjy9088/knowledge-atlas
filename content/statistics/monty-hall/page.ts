import type {ContentPage} from '../../../packages/content/types.js';
export default {
  "slug": "monty-hall",
  "articleId": "article:statistics.monty-hall.ko",
  "label": "문 두 개, 정말 반반일까요?",
  "category": "statistics",
  "model": null,
  "experiment": false,
  "navigation": {
    "chapters": [
      {"kind":"mainline","id":"host-and-observation","title":"진행자가 어떤 문을 여는지가 중요합니다","sceneIds":["question","protocol","strategy","shortened","compare","close"]},
      {"kind":"detour","id":"numbered-reveal","title":"2번이 열린 게임만 고르면?","sceneIds":["specific"],"parentSceneId":"compare","returnSceneId":"compare"}
    ],
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
      "known": "진행자 규칙이 빠졌다는 점을 알아본다.",
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
      "title": "진행자는 반드시 꽝을 엽니다",
      "block": 1,
      "from": 0,
      "cards": [],
      "known": "계산에 사용할 상품 배치와 공개 규칙을 말한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-protocol.svg",
        "alt": "상품은 세 문에 같은 확률로 배치. 진행자는 정답을 알고 미선택 꽝을 반드시 열며 항상 교환을 제안합니다.",
        "caption": "처음 선택은 상품 위치와 무관 · 두 꽝 중 어느 문을 열어도 전략 승률은 같습니다"
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
      "known": "처음 틀린 두 경우에서 바꾸면 이기는 이유를 설명한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-strategy.svg",
        "alt": "처음 선택이 1번일 때 상품이 1번이면 교환 패, 2번 또는 3번이면 교환 승. 세 경우는 각각 1/3.",
        "caption": "처음 틀렸던 두 경우에서는 진행자가 남은 꽝을 치워 줍니다"
      },
      "suggestion": {
        "example": "strategy"
      }
    },
    {
      "id": "shortened",
      "title": "꽝을 봤다는 것만으로 충분할까요?",
      "block": 3,
      "from": 0,
      "cards": [],
      "known": "꽝을 한 번 본 것과 항상 꽝만 여는 규칙을 구별한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-shortened.svg",
        "alt": "정답을 알고 반드시 꽝을 여는 경우와, 정답을 모르고 열었는데 꽝이 나온 경우를 비교합니다.",
        "caption": "“오답을 봤다”와 “항상 오답만 연다”를 구분"
      },
      "suggestion": {
        "example": "shortened"
      }
    },
    {
      "id": "compare",
      "title": "모르고 열었는데 꽝이었다면?",
      "block": 4,
      "from": 0,
      "cards": [],
      "known": "같은 확률의 여섯 칸 중 남은 네 칸을 세어 1/2를 얻는다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-compare.svg",
        "alt": "처음 1번 선택. 같은 확률의 여섯 칸에서 상품을 연 두 칸을 제외합니다. 상품 1번의 두 칸, 2번과 3번의 한 칸씩이 남아 네 칸 중 두 칸에서 바꾸면 이깁니다.",
        "caption": "상품이 공개된 게임은 제외 · 남은 네 칸 중 두 칸에서 바꾸면 이깁니다"
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
      "known": "특정 번호가 열린 게임과 전체 전략의 승률을 구별한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-specific.svg",
        "alt": "처음 1번 선택. 정답을 아는 진행자가 열 수 있으면 반드시 2번을 엽니다. 2번이 열린 경우만 남기면 상품 위치 1번과 3번이 같은 확률로 남아, 3번으로 바꾸면 승률은 1/2입니다.",
        "caption": "공개 번호를 가리지 않은 전체 전략과, 2번이 열린 게임만 남긴 계산은 서로 다른 질문입니다."
      },
      "suggestion": {
        "example": "specific"
      }
    },
    {
      "id": "close",
      "title": "같은 두 문인데, 왜 답이 다를까요?",
      "block": 6,
      "from": 0,
      "cards": [],
      "known": "진행자 규칙에 따라 어떤 게임이 제외되는지 설명한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-close.svg",
        "alt": "반드시 꽝을 열면 처음 틀린 게임이 모두 남아 바꾸기 승률 2/3. 모르고 무작위로 열면 처음 틀린 게임의 절반이 제외되어, 꽝을 본 게임의 바꾸기 승률 1/2.",
        "caption": "문 두 개가 남았다는 사실만으로 반반이라고 할 수는 없습니다"
      },
      "suggestion": {
        "example": "close"
      }
    }
  ],
  "interactive": "monty-hall",
  "workbenchPlacement": "after-explanation",
  "styles": [
    "/topics/statistics/possibility-lab.css"
  ]
} satisfies ContentPage;
