export default {
  "slug": "curry-howard",
  "articleId": "article:computing.curry-howard.ko",
  "label": "명제와 타입",
  "category": "논리 · 프로그래밍",
  "interactive": "typed-lambda",
  "styles": [
    "/topics/computing/typed-lambda.css"
  ],
  "claimRefs": [
    "claim:computing.curry-howard.correspondence",
    "claim:computing.curry-howard.implication",
    "claim:computing.curry-howard.context",
    "claim:computing.curry-howard.product",
    "claim:computing.curry-howard.composition",
    "claim:computing.curry-howard.normalization",
    "claim:computing.curry-howard.limits"
  ],
  "scenes": [
    {
      "id": "question",
      "title": "논리식과 함수 타입이 닮은 이유",
      "block": 0,
      "from": 0,
      "cards": [
        "명제 ↔ 타입",
        "증명 ↔ 항"
      ],
      "known": "명제·타입·증명·항의 대응 범위",
      "suggestion": {
        "example": "identity"
      }
    },
    {
      "id": "identity",
      "title": "A라면 A: 가장 작은 증명",
      "block": 1,
      "from": 0,
      "cards": [
        "A → A",
        "λx:A. x"
      ],
      "known": "항등 함수와 함의 도입",
      "suggestion": {
        "example": "identity"
      }
    },
    {
      "id": "context",
      "title": "가정은 어디에 기록될까요?",
      "block": 2,
      "from": 0,
      "cards": [
        "x : A",
        "Γ ⊢ t : B"
      ],
      "known": "문맥과 타입 판단, 가정 의존성",
      "suggestion": {
        "example": "apply"
      }
    },
    {
      "id": "application",
      "title": "추론 규칙이 함수 호출이 됩니다",
      "block": 3,
      "from": 0,
      "cards": [
        "A → B, A ⊢ B",
        "f : A → B, a : A ⊢ f a : B"
      ],
      "known": "함의 제거와 함수 적용",
      "suggestion": {
        "example": "apply"
      }
    },
    {
      "id": "composition",
      "title": "두 추론을 하나로 이어 보세요",
      "block": 4,
      "from": 0,
      "cards": [
        "A → B, B → C ⊢ A → C",
        "λx:A. g (f x)"
      ],
      "known": "함수 합성과 가정 의존성",
      "suggestion": {
        "example": "compose-proof"
      }
    },
    {
      "id": "pair",
      "title": "‘그리고’의 증거를 함께 담기",
      "block": 5,
      "from": 0,
      "cards": [
        "A ∧ B ↔ A × B",
        "쌍 만들기 · 성분 꺼내기"
      ],
      "known": "논리곱과 곱 타입의 도입·제거",
      "suggestion": {
        "example": "pair"
      }
    },
    {
      "id": "calculation",
      "title": "계산은 증명을 어떻게 줄일까요?",
      "block": 6,
      "from": 0,
      "cards": [
        "(λx:A. x) a ↦ a",
        "함의 도입 뒤 제거를 단순화"
      ],
      "known": "함수 계산과 증명 단순화",
      "suggestion": {
        "example": "beta"
      }
    },
    {
      "id": "limits",
      "title": "타입이 맞으면 모든 것이 증명됐을까요?",
      "block": 7,
      "from": 0,
      "cards": [
        "확인한 타입 · 명시한 조건",
        "언어와 논리가 바뀌면 대응도 점검"
      ],
      "known": "타입 검사와 프로그램 검증의 범위",
      "suggestion": {
        "example": "mismatch"
      }
    }
  ]
};
