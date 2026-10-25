import {orderScenes} from '../../../packages/content/reading-order.js';
import type {ContentPage} from '../../../packages/content/types.js';
const page = {
  "slug": "monty-hall",
  "articleId": "article:statistics.monty-hall.ko",
  "label": "문 두 개, 정말 반반일까요?",
  "category": "확률 · 통계",
  "model": null,
  "experiment": false,
  "navigation": {
    "chapters": [
      {
        "id": "host-and-observation",
        "title": "문을 고르고, 경우를 하나씩 비교하기",
        "sceneIds": [
          "question",
          "reveal",
          "protocol",
          "tie-rule",
          "case-hit",
          "case-miss-a",
          "case-miss-b",
          "informed-tree",
          "strategy",
          "shortened",
          "blind-rule",
          "blind-paths",
          "blind-keep-hit",
          "blind-keep-miss",
          "compare",
          "sampling",
          "close"
        ]
      },
      {
        "id": "numbered-reveal",
        "title": "2번이 열린 게임만 고르면?",
        "sceneIds": [
          "specific",
          "specific-cases",
          "specific-result"
        ]
      },
      {
        "id": "free-experiment",
        "title": "규칙을 바꾸며 더 실험하기",
        "sceneIds": [
          "experiment"
        ]
      }
    ],
    "relatedArticleIds": [
      "article:statistics.two-children.ko"
    ]
  },
  "claimRefs": [
    "claim:statistics.monty-hall.monty-strategy",
    "claim:statistics.monty-hall.monty-observation",
    "claim:statistics.monty-hall.monty-epistemic",
    "claim:statistics.monty-hall.monty-tree"
  ],
  "scenes": [
    {
      "id": "question",
      "title": "문 셋 중 하나를 골라 보세요",
      "block": 0,
      "from": 0,
      "cards": [],
      "known": "상품 위치를 모른 채 문 하나를 고른다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-question.svg",
        "alt": "문 셋 중 하나에만 상품이 있고, 나머지는 꽝입니다. 아직 어느 문이 당첨인지 모릅니다. 먼저 마음에 드는 문 하나를 골라 보세요.",
        "caption": "세 문은 모두 닫혀 있습니다. 선택 없이 넘기면 1번 예시로 이어집니다."
      },
      "suggestion": {
        "example": "question"
      }
    },
    {
      "id": "reveal",
      "title": "다른 문 하나는 꽝이었습니다",
      "block": 1,
      "from": 0,
      "cards": [],
      "known": "내 선택과 공개된 꽝, 남은 문을 구별한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-reveal.svg",
        "alt": "진행자가 내가 고르지 않은 문 하나를 열었더니 꽝이 나왔습니다. 이제 닫힌 문은 두 개입니다. 처음 문을 지킬까요, 남은 문으로 바꿀까요?",
        "caption": "선택한 문을 유지하며 경우를 하나씩 비교합니다."
      },
      "suggestion": {
        "example": "reveal"
      }
    },
    {
      "id": "protocol",
      "title": "진행자는 반드시 꽝을 엽니다",
      "block": 2,
      "from": 0,
      "cards": [],
      "known": "진행자가 반드시 꽝을 여는 규칙을 확인한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-protocol.svg",
        "alt": "먼저 규칙을 정하겠습니다. 상품은 세 문에 같은 확률로 놓입니다. 진행자는 상품 위치를 알고, 내가 고르지 않은 꽝 문을 반드시 엽니다. 그리고 언제나 바꿀 기회를 줍니다.",
        "caption": "선택한 문을 유지하며 경우를 하나씩 비교합니다."
      },
      "suggestion": {
        "example": "protocol"
      }
    },
    {
      "id": "tie-rule",
      "title": "꽝 문이 둘이면 반반으로 고릅니다",
      "from": 0,
      "cards": [],
      "known": "열 수 있는 꽝이 둘일 때 각각 1/2로 고르는 규칙을 확인한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-tie-rule.svg",
        "alt": "처음 고른 문이 당첨이면, 남은 두 문은 모두 꽝입니다. 이 예시에서는 진행자가 어느 쪽도 선호하지 않고 각각 1/2로 고릅니다. 나머지 두 경우에는 열 수 있는 꽝이 하나뿐입니다.",
        "caption": "상품 배치와 진행자 공개 규칙을 구별합니다."
      },
      "suggestion": {
        "example": "tie-rule"
      },
      "block": 3
    },
    {
      "id": "case-hit",
      "title": "처음 고른 문에 상품이 있다면?",
      "block": 4,
      "from": 0,
      "cards": [],
      "known": "처음 맞힌 경우에는 바꾸면 지는 이유를 설명한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-case-hit.svg",
        "alt": "상품이 내가 고른 문에 있다고 가정해 봅시다. 처음부터 맞혔으니, 진행자가 어느 꽝을 열어도 바꾸면 상품을 놓칩니다.",
        "caption": "선택한 문을 유지하며 경우를 하나씩 비교합니다."
      },
      "suggestion": {
        "example": "case-hit"
      }
    },
    {
      "id": "case-miss-a",
      "title": "상품이 다른 한쪽 문에 있다면?",
      "block": 5,
      "from": 0,
      "cards": [],
      "known": "다른 한쪽에 상품이 있으면 바꾸면 이기는 이유를 설명한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-case-miss-a.svg",
        "alt": "이번에는 상품이 다른 문에 있다고 가정해 봅시다. 진행자는 내 문도 상품 문도 열 수 없습니다. 남은 꽝을 열어야 하므로, 바꾸면 상품을 얻습니다.",
        "caption": "선택한 문을 유지하며 경우를 하나씩 비교합니다."
      },
      "suggestion": {
        "example": "case-miss-a"
      }
    },
    {
      "id": "case-miss-b",
      "title": "나머지 문에 상품이 있어도?",
      "block": 6,
      "from": 0,
      "cards": [],
      "known": "또 다른 상품 위치에서도 바꾸면 이기는 이유를 설명한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-case-miss-b.svg",
        "alt": "상품이 또 다른 문에 있어도 같습니다. 진행자는 상품이 없는 쪽을 열어야 합니다. 처음 선택이 틀렸던 이 경우도 바꾸면 이깁니다.",
        "caption": "선택한 문을 유지하며 경우를 하나씩 비교합니다."
      },
      "suggestion": {
        "example": "case-miss-b"
      }
    },
    {
      "id": "informed-tree",
      "title": "가지 끝의 확률은 같지 않습니다",
      "from": 0,
      "cards": [],
      "known": "가지마다 나뉘는 확률을 곱해 전체 경로의 확률을 구별한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-informed-tree.svg",
        "alt": "상품 위치는 각각 1/3입니다. 처음 맞힌 경우만 다시 두 갈래로 나뉘어 각 경로가 1/6이 됩니다. 나머지 경로는 각각 1/3이므로, 네 말단을 똑같이 세면 안 됩니다.",
        "caption": "상품 배치와 진행자 공개 규칙을 구별합니다."
      },
      "suggestion": {
        "example": "informed-tree"
      },
      "block": 7
    },
    {
      "id": "strategy",
      "title": "세 경우 중 두 경우에서 이깁니다",
      "block": 8,
      "from": 0,
      "cards": [],
      "known": "같은 확률의 세 경우 중 두 경우를 센다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-strategy.svg",
        "alt": "상품 위치 세 경우는 각각 1/3입니다. 처음 맞힌 한 경우에서는 바꾸면 지고, 처음 틀린 두 경우에서는 바꾸면 이깁니다. 그래서 항상 바꾸는 전략의 승률은 2/3입니다.",
        "caption": "선택한 문을 유지하며 경우를 하나씩 비교합니다."
      },
      "suggestion": {
        "example": "strategy"
      }
    },
    {
      "id": "shortened",
      "title": "그런데 처음에 규칙을 말했나요?",
      "block": 9,
      "from": 0,
      "cards": [],
      "known": "한 번 본 장면과 항상 따르는 규칙을 구별한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-shortened.svg",
        "alt": "그런데 처음 장면에서는 진행자의 규칙을 말하지 않았습니다. 정답을 모르는 사람이 우연히 꽝을 열었을 수도 있습니다. 그 경우에도 바꾸는 승률은 같을까요?",
        "caption": "선택한 문을 유지하며 경우를 하나씩 비교합니다."
      },
      "suggestion": {
        "example": "shortened"
      }
    },
    {
      "id": "blind-rule",
      "title": "이번 진행자는 정답을 모릅니다",
      "block": 10,
      "from": 0,
      "cards": [],
      "known": "모르는 진행자는 상품을 열 수도 있음을 확인한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-blind-rule.svg",
        "alt": "이번 진행자는 정답을 모릅니다. 내가 고르지 않은 두 문 중 하나를 똑같은 확률로 엽니다. 상품이 나온 게임은 빼고, 꽝이 나온 게임만 비교하겠습니다.",
        "caption": "선택한 문을 유지하며 경우를 하나씩 비교합니다."
      },
      "suggestion": {
        "example": "blind-rule"
      }
    },
    {
      "id": "blind-paths",
      "title": "열 수 있는 문은 두 개씩입니다",
      "block": 11,
      "from": 0,
      "cards": [],
      "known": "상품 위치와 문 공개를 합친 여섯 경우를 만든다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-blind-paths.svg",
        "alt": "상품 위치는 세 가지이고, 각 위치에서 진행자가 열 문은 두 가지입니다. 따라서 같은 확률의 여섯 경우로 나눌 수 있습니다. 실제로 여섯 번 하면 꼭 이대로 나온다는 뜻은 아닙니다.",
        "caption": "선택한 문을 유지하며 경우를 하나씩 비교합니다."
      },
      "suggestion": {
        "example": "blind-paths"
      }
    },
    {
      "id": "blind-keep-hit",
      "title": "처음 맞혔던 경우는 모두 남습니다",
      "block": 12,
      "from": 0,
      "cards": [],
      "known": "처음 맞힌 경우는 두 가지 공개가 모두 남음을 확인한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-blind-keep-hit.svg",
        "alt": "상품이 내가 고른 문에 있으면, 다른 두 문은 모두 꽝입니다. 어느 문을 열어도 꽝이므로 두 경우가 전부 남습니다. 둘 다 바꾸면 집니다.",
        "caption": "선택한 문을 유지하며 경우를 하나씩 비교합니다."
      },
      "suggestion": {
        "example": "blind-keep-hit"
      }
    },
    {
      "id": "blind-keep-miss",
      "title": "처음 틀렸다면 절반만 남습니다",
      "block": 13,
      "from": 0,
      "cards": [],
      "known": "처음 틀린 경우는 상품을 연 절반이 제외됨을 확인한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-blind-keep-miss.svg",
        "alt": "상품이 다른 문에 있으면, 진행자는 상품이나 꽝을 열 수 있습니다. 상품을 연 게임은 문제의 ‘꽝이 열렸다’는 조건에 맞지 않습니다. 그래서 꽝을 연 절반만 남습니다.",
        "caption": "선택한 문을 유지하며 경우를 하나씩 비교합니다."
      },
      "suggestion": {
        "example": "blind-keep-miss"
      }
    },
    {
      "id": "compare",
      "title": "남은 네 경우 중 두 경우에서 이깁니다",
      "block": 14,
      "from": 0,
      "cards": [],
      "known": "남은 네 경우 중 교환으로 이기는 두 경우를 센다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-compare.svg",
        "alt": "문제는 ‘꽝이 열린 뒤’의 승률을 묻습니다. 상품을 연 두 경로는 이 조건에 맞지 않아, 네 경로만 셉니다. 이 중 교환 승리는 둘이므로 2/4=1/2입니다.",
        "caption": "선택한 문을 유지하며 경우를 하나씩 비교합니다."
      },
      "suggestion": {
        "example": "compare"
      }
    },
    {
      "id": "sampling",
      "title": "같은 뽑기에서 무엇이 빠질까요?",
      "from": 0,
      "cards": [],
      "known": "전체 시행과 제외, 남은 게임, 교환 승리를 나란히 비교한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-sampling.svg",
        "alt": "같은 상품 배치를 두 진행 방식에 적용해 보세요. 정답을 모르는 쪽에서 상품을 공개한 게임은 집계에서 빠집니다. 전체 뽑기 수와 남은 게임 수를 구별하고, 승률을 어느 쪽으로 나누는지 확인해 보세요.",
        "caption": "상품 배치와 진행자 공개 규칙을 구별합니다."
      },
      "suggestion": {
        "example": "sampling"
      },
      "block": 15
    },
    {
      "id": "close",
      "title": "같은 두 문인데, 답이 달라집니다",
      "block": 16,
      "from": 0,
      "cards": [],
      "known": "문 개수 대신 진행자 규칙으로 두 답의 차이를 설명한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-close.svg",
        "alt": "반드시 꽝을 여는 진행자라면, 처음 틀린 경우가 모두 남아 교환 승률은 2/3입니다. 모르고 무작위로 열었다면, 처음 틀린 경우의 절반이 제외되어 1/2입니다. 남은 문 개수만이 아니라 문을 연 규칙을 봐야 합니다.",
        "caption": "선택한 문을 유지하며 경우를 하나씩 비교합니다."
      },
      "suggestion": {
        "example": "close"
      }
    },
    {
      "id": "specific",
      "skip": {"to": "sampling", "label": "2번이 열린 게임만 고르면? 건너뛰기"},
      "title": "2번을 우선 여는 진행자",
      "block": 17,
      "from": 0,
      "cards": [],
      "known": "별도 예시의 처음 선택과 진행자 선호를 고정한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-specific.svg",
        "alt": "여기부터는 별도 예시입니다. 처음에 1번을 골랐고, 정답을 아는 진행자가 열 수 있으면 반드시 2번을 연다고 합시다. 이제 2번이 열린 게임만 골라 보겠습니다.",
        "caption": "별도 예시: 처음 선택은 1번 문입니다."
      },
      "suggestion": {
        "example": "specific"
      }
    },
    {
      "id": "specific-cases",
      "title": "2번이 열린 경우만 남겨 봅시다",
      "block": 18,
      "from": 0,
      "cards": [],
      "known": "2번이 열린 게임만 남겨 두 상품 위치를 찾는다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-specific-cases.svg",
        "alt": "상품이 1번이면 2번을 엽니다. 상품이 2번이면 그 문을 피해서 3번을 엽니다. 상품이 3번이면 2번을 엽니다. 따라서 2번이 열린 게임에는 상품이 1번과 3번인 경우만 남습니다.",
        "caption": "별도 예시: 처음 선택은 1번 문입니다."
      },
      "suggestion": {
        "example": "specific-cases"
      }
    },
    {
      "id": "specific-result",
      "title": "이때는 두 경우 중 한 경우입니다",
      "block": 19,
      "from": 0,
      "cards": [],
      "known": "골라 남긴 게임과 전체 게임의 승률을 구별한다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-specific-result.svg",
        "alt": "남은 두 경우는 같은 확률이고, 3번으로 바꾸면 한 경우에서 이깁니다. 이때는 1/2입니다. 모든 게임을 합치면 처음 틀린 두 경우에서 이겨 여전히 2/3입니다. 어떤 게임만 골랐는지가 다릅니다.",
        "caption": "별도 예시: 처음 선택은 1번 문입니다."
      },
      "suggestion": {
        "example": "specific-result"
      }
    },
    {
      "id": "experiment",
      "title": "규칙을 바꾸며 더 실험해 보세요",
      "block": 20,
      "from": 0,
      "cards": [],
      "known": "정확한 계산과 표본 실험을 구별하며 규칙을 바꾸어 본다.",
      "figure": {
        "src": "/content/statistics/monty-hall/figure-experiment.svg",
        "alt": "진행자의 규칙이나 처음 고른 문을 바꾸며 비교해 보세요. 여섯 칸은 같은 확률의 경우를 나눈 계산 그림입니다. 아래 표본 실험은 실제 뽑기를 흉내 내므로, 매번 같은 횟수로 나오지는 않습니다.",
        "caption": "선택한 문을 유지하며 경우를 하나씩 비교합니다."
      },
      "suggestion": {
        "example": "experiment"
      }
    }
  ],
  "interactive": "monty-hall",
  "workbenchPlacement": "after-explanation",
  "sceneVisualPlacement": "after-explanation",
  "styles": [
    "/topics/statistics/possibility-lab.css",
    "/topics/statistics/monty-hall.css"
  ]
} satisfies ContentPage;

export default orderScenes(page, ["question", "reveal", "protocol", "tie-rule", "case-hit", "case-miss-a", "case-miss-b", "informed-tree", "strategy", "shortened", "blind-rule", "blind-paths", "blind-keep-hit", "blind-keep-miss", "compare", "specific", "specific-cases", "specific-result", "sampling", "experiment", "close"]);
