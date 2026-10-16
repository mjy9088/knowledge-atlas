export default {
  "slug": "atomic-orbitals",
  "articleId": "article:quantum.atomic-orbitals.ko",
  "label": "원자 오비탈",
  "category": "양자역학",
  "interactive": "hydrogenic-orbitals",
  "styles": [
    "/components/spatial/field-viewer.css",
    "/topics/quantum/orbitals.css"
  ],
  "claimRefs": [
    "claim:quantum.orbital.probability",
    "claim:quantum.hydrogenic.quantum-numbers",
    "claim:quantum.hydrogenic.radial",
    "claim:quantum.orbital.nodes",
    "claim:quantum.orbital.phase",
    "claim:quantum.hydrogenic.scaling",
    "claim:quantum.orbital.representation",
    "claim:quantum.hydrogenic.scope"
  ],
  "scenes": [
    {
      "id": "orbit",
      "title": "전자도 행성처럼 돌고 있을까요?",
      "block": 0,
      "from": 0,
      "cards": [
        "전자도 행성처럼 돌고 있을까요?",
        "ψ · |ψ|²"
      ],
      "known": "오비탈과 고전적 궤도의 구별",
      "suggestion": {
        "n": 2,
        "basis": "pz",
        "Z": 1,
        "mode": "cloud"
      }
    },
    {
      "id": "density",
      "title": "점이 많은 곳은 무엇을 뜻할까요?",
      "block": 1,
      "from": 0,
      "cards": [
        "점이 많은 곳은 무엇을 뜻할까요?",
        "ψ · |ψ|²"
      ],
      "known": "파동함수·확률밀도·영역 확률의 구별",
      "suggestion": {
        "n": 1,
        "basis": "s",
        "Z": 1,
        "mode": "cloud"
      }
    },
    {
      "id": "numbers",
      "title": "s·p·d와 방향을 바꿔 보세요",
      "block": 2,
      "from": 0,
      "cards": [
        "s·p·d와 방향을 바꿔 보세요",
        "ψ · |ψ|²"
      ],
      "known": "양자수와 실수 오비탈 방향의 의미",
      "suggestion": {
        "n": 3,
        "basis": "dxy",
        "Z": 1,
        "mode": "cloud"
      }
    },
    {
      "id": "nodes",
      "title": "분포 안의 빈 곳: 마디",
      "block": 3,
      "from": 0,
      "cards": [
        "분포 안의 빈 곳: 마디",
        "ψ · |ψ|²"
      ],
      "known": "방사 마디와 각 마디",
      "suggestion": {
        "n": 2,
        "basis": "s",
        "Z": 1,
        "mode": "slice"
      }
    },
    {
      "id": "phase",
      "title": "두 색은 전하가 다르다는 뜻일까요?",
      "block": 4,
      "from": 0,
      "cards": [
        "두 색은 전하가 다르다는 뜻일까요?",
        "ψ · |ψ|²"
      ],
      "known": "파동함수 부호와 전체 위상 선택",
      "suggestion": {
        "n": 3,
        "basis": "dxy",
        "Z": 1,
        "mode": "surface"
      }
    },
    {
      "id": "views",
      "title": "같은 분포를 세 가지 방법으로",
      "block": 5,
      "from": 0,
      "cards": [
        "같은 분포를 세 가지 방법으로",
        "ψ · |ψ|²"
      ],
      "known": "점·단면·등값면의 표시 기준",
      "suggestion": {
        "n": 2,
        "basis": "pz",
        "Z": 1,
        "mode": "surface"
      }
    },
    {
      "id": "charge",
      "title": "핵전하를 바꾸면 무엇이 달라질까요?",
      "block": 6,
      "from": 0,
      "cards": [
        "핵전하를 바꾸면 무엇이 달라질까요?",
        "ψ · |ψ|²"
      ],
      "known": "Z에 따른 크기·에너지와 자동 구도의 구별",
      "suggestion": {
        "n": 2,
        "basis": "pz",
        "Z": 2,
        "mode": "cloud"
      }
    },
    {
      "id": "limits",
      "title": "이 화면이 계산하는 범위",
      "block": 7,
      "from": 0,
      "cards": [
        "이 화면이 계산하는 범위",
        "ψ · |ψ|²"
      ],
      "known": "모형의 가정과 렌더 근사 한계",
      "suggestion": {
        "n": 3,
        "basis": "dz2",
        "Z": 1,
        "mode": "cloud"
      }
    }
  ]
};
