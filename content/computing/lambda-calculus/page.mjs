export default {
  "slug": "lambda-calculus",
  "articleId": "article:computing.lambda-calculus.ko",
  "label": "람다 계산",
  "category": "논리 · 프로그래밍",
  "interactive": "typed-lambda",
  "styles": [
    "/topics/computing/typed-lambda.css"
  ],
  "claimRefs": [
    "claim:computing.lambda.syntax",
    "claim:computing.lambda.substitution",
    "claim:computing.lambda.typing",
    "claim:computing.lambda.self-application",
    "claim:computing.lambda.safety",
    "claim:computing.lambda.termination"
  ],
  "scenes": [
    {
      "id": "function",
      "title": "함수를 만드는 작은 언어",
      "block": 0,
      "from": 0,
      "cards": [
        "입력 이름 : 타입",
        "λx:A. 몸체"
      ],
      "known": "람다 추상화 표기 읽기",
      "suggestion": {
        "example": "identity"
      }
    },
    {
      "id": "apply",
      "title": "함수를 만드는 것과 사용하는 것",
      "block": 1,
      "from": 0,
      "cards": [
        "함수 : A → A",
        "적용 결과 : A"
      ],
      "known": "추상화와 적용의 구별",
      "suggestion": {
        "example": "beta"
      }
    },
    {
      "id": "substitution",
      "title": "한 단계 실행은 치환입니다",
      "block": 2,
      "from": 0,
      "cards": [
        "(λx:A. x) a ↦ a",
        "자유로운 매개변수 자리에 치환"
      ],
      "known": "베타 축약과 치환",
      "suggestion": {
        "example": "beta"
      }
    },
    {
      "id": "binding",
      "title": "같은 글자라도 다른 변수일 수 있어요",
      "block": 3,
      "from": 0,
      "cards": [
        "λx:A. (λx:B. x)",
        "안쪽 x는 안쪽 λ에 결합"
      ],
      "known": "결합 변수·자유 변수와 포획 방지",
      "suggestion": {
        "example": "shadowing"
      }
    },
    {
      "id": "composition",
      "title": "함수도 입력과 결과가 됩니다",
      "block": 4,
      "from": 0,
      "cards": [
        "k : A → B · h : B → C",
        "h (k a) : C"
      ],
      "known": "고차 함수와 합성의 타입 조건",
      "suggestion": {
        "example": "compose"
      }
    },
    {
      "id": "mismatch",
      "title": "실행 전에 잡을 수 있는 오류",
      "block": 5,
      "from": 0,
      "cards": [
        "필요한 입력 A · 받은 입력 C",
        "A ≠ C이면 적용 유도 실패"
      ],
      "known": "타입 불일치와 증명 불가능성의 구별",
      "suggestion": {
        "example": "mismatch"
      }
    },
    {
      "id": "self-application",
      "title": "자기 자신을 입력으로 주면?",
      "block": 6,
      "from": 0,
      "cards": [
        "x : T · x : T → U",
        "유한 단순 타입에서 충돌"
      ],
      "known": "자기 적용이 단순 타입에서 거부되는 이유",
      "suggestion": {
        "example": "self-application"
      }
    },
    {
      "id": "limits",
      "title": "안전하게 계산됨과 종료는 다른 성질",
      "block": 7,
      "from": 0,
      "cards": [
        "진행 + 보존 → 타입 안전성",
        "종료 · 명세 만족은 별도 확인"
      ],
      "known": "진행·보존·종료·정답의 구별",
      "suggestion": {
        "example": "pair"
      }
    }
  ]
};
