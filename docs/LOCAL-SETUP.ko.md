# 로컬 실행 및 GitHub 게시

## 1. 로컬 저장소

이 아카이브는 `.git` 디렉터리와 초기 커밋을 포함한 **실제 Git 저장소**이다. 압축을 푼 뒤:

```bash
cd knowledge-atlas
node --version           # 22+ 권장
npm run validate
npm test
npm run dev              # localhost:4173
npm run storyboard       # artifacts/storyboard.json
npm run impact           # 고정 source의 영향도 후보 출력
npm run release:check    # 초기 단계에서는 공개 차단이 정상
```

패키지 설치는 필요하지 않다. `artifacts/`는 빌드 산출물이며 Git에서 제외한다.

## 2. GitHub에 새 저장소 게시 (공개 여부 직접 결정)

연결된 GitHub 앱은 기존 저장소를 읽고 수정할 수 있지만, 현재 **새 저장소를 생성하는 기능을 제공하지 않는다**. 먼저 GitHub 웹사이트에서 비공개 빈 저장소를 하나 생성하거나, 로컬에서 인증된 GitHub CLI를 이용한다.

```bash
# GitHub 웹에서 mjy9088/knowledge-atlas 등의 빈 저장소 생성 후
cd knowledge-atlas
git remote add origin git@github.com:YOUR_OWNER/knowledge-atlas.git
git push -u origin main
```

SSH 대신 HTTPS remote를 사용해도 된다. **기존 README/LICENCE/초기 커밋을 GitHub 새 저장소에 별도로 만들지 않으면** 초기 push 충돌 가능성이 낮다.

GitHub CLI 예시(설치·로그인한 환경):

```bash
gh auth login
gh repo create knowledge-atlas --private --source=. --remote=origin --push
```

원격 저장소를 공개하기 전에 라이선스/소스 권리 검토를 완료한다. 프로젝트 자체가 처음부터 오픈소스여야 한다고 가정하지 않는다.

## 3. 현 상태와 다음 작업

웹: 무의존성, 첫 논리 장면 상호작용 가능. `window.__atlasScenes.proof.getState()/setState()/reset()` 최소 hook 노출.

스토리보드: placeholder timeline JSON export만 구현. **실제 MP4, TTS, Remotion, AI 제작/피드백 자동 적용은 아직 없다.**

다음 작업은 `docs/ROADMAP.ko.md`의 M1. 새 패키지 설치나 스택 마이그레이션 전에 데이터/씬 상태 계약이 깨지지 않게 테스트를 유지한다.
