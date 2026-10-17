import type {ContentPage} from '../../../packages/content/types.js';
export default {
  "slug": "binary-relations",
  "articleId": "article:mathematics.binary-relations.ko",
  "label": "이항 관계: 화살표 하나가 말하는 것",
  "category": "mathematics",
  "model": null,
  "experiment": false,
  "claimRefs": [
    "claim:mathematics.binary-relations.relation-definition",
    "claim:mathematics.binary-relations.relation-properties"
  ],
  "scenes": [
    {
      "id": "question",
      "title": "누가 누구와 연결됐나요?",
      "block": 0,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/mathematics/binary-relations/figure-question.svg",
        "alt": "민에서 논리·확률로, 수에서 확률로 세 화살표가 향한다.",
        "caption": "사람 → 수업 · 화살표마다 연결 하나"
      }
    },
    {
      "id": "pairs",
      "title": "연결을 순서쌍으로",
      "block": 1,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/mathematics/binary-relations/figure-pairs.svg",
        "alt": "순서쌍 세 개와 같은 연결을 표시한 2행 2열 표. 민 행은 1,1이고 수 행은 0,1이다.",
        "caption": "행 = 사람 · 열 = 수업 · 1 = 관계에 포함"
      }
    },
    {
      "id": "functions",
      "title": "한 사람에 화살표가 둘이어도 관계",
      "block": 2,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/mathematics/binary-relations/figure-functions.svg",
        "alt": "왼쪽 관계에서 민은 두 수업과 연결된다. 오른쪽 함수에서는 민과 수 각각 수업 하나와 연결된다.",
        "caption": "모든 입력에 출력이 정확히 하나인 관계가 함수"
      }
    },
    {
      "id": "properties",
      "title": "같은 집합 안에서는 어떤 성질이 있나요?",
      "block": 3,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/mathematics/binary-relations/figure-properties.svg",
        "alt": "반사성은 모든 자기 연결, 대칭성은 모든 화살표의 역방향, 추이성은 이어진 모든 두 화살표의 직통 연결을 요구한다.",
        "caption": "그림은 검사 조건 · 해당하는 모든 원소에 적용"
      }
    },
    {
      "id": "transfer",
      "title": "반례 하나로 성질을 깨 보기",
      "block": 4,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/mathematics/binary-relations/figure-transfer.svg",
        "alt": "행과 열이 1,2,3인 ≤ 표. 대각선과 오른쪽 위는 1, 왼쪽 아래는 0.",
        "caption": "행 ≤ 열인지 표시 · 반례 하나로 대칭성이 깨짐"
      }
    },
    {
      "id": "close",
      "title": "그림과 표는 같은 연결의 다른 표현",
      "block": 5,
      "from": 0,
      "cards": [],
      "known": "조건을 바꿨을 때 결과가 어떻게 달라지는지 확인한다.",
      "figure": {
        "src": "/content/mathematics/binary-relations/figure-close.svg",
        "alt": "왼쪽의 세 화살표와 오른쪽 표의 세 1이 같은 순서쌍을 나타낸다.",
        "caption": "표현을 바꿔도 연결의 방향과 포함 여부를 유지"
      }
    }
  ]
} satisfies ContentPage;
