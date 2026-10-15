# ADR 0006 — 브라우저 기반 로컬 동영상 렌더러

상태: 로컬 구현 후보 / 2026-10-16.

후속 결정: [ADR 0010](0010-local-media-cli.md)에 따라 아래 초기 구현의 웹 MP4 변환/자동 실행은 제거했다. 현재 MP4는 CLI 전용이고 `render.html`은 공개 빌드에서 제외되는 개발용 WebM 생성 보조 화면이다. 아래 연속 변환 기록은 당시 구현 이력이다.

전체/시험 렌더 버튼은 WebM 생성 후 로컬 FFmpeg MP4 변환까지 연속 실행한다. WebM 미리보기의 성공 여부와 MP4의 ffprobe 검증을 별도로 기록한다. WebM을 직접 저장하거나 이미 저장한 파일을 따로 변환할 수도 있다.

`render.html`에서 WebCodecs VideoEncoder(VP8)와 자체 최소 WebM muxer로 무음 파일을 생성한다. 이어 사용자가 설치한 mise FFmpeg로 H.264/yuv420p/faststart MP4를 만든다. 외부 코드·폰트·음원·네트워크 인코딩 서비스나 npm 의존성을 추가하지 않는다. 음성, 렌더 팜, 공개 배포는 이번 범위 밖이다. WebCodecs 미지원 브라우저에서는 명시적 오류를 보여주며 기존 WebM의 MP4 변환은 별도 사용할 수 있다.

웹의 같은 `deriveProof/createVideoTimeline(expanded)/frameAt/visualForStep`에서 수식·참조·규칙·해설을 읽는다. HTML 레이아웃을 녹화하지 않고 Canvas에 영상용으로 배치한다. 프레임 시각은 `index/fps`, 타임스탬프/길이는 마이크로초 정수 경계로 계산한다. 벽시계, requestAnimationFrame 재생 속도, 앞선 상호작용에 의존하지 않는다. 출력 인코더 비트열의 환경 간 동일성은 보장하지 않는다.

지원 형식은 1080×1440(3:4), 1920×1080(16:9), 24/30fps다. 기본 180초/30fps는 5400프레임이다. 입력은 현재 등록된 여섯 예시이며 임의 편집 입력 전달은 후속 범위다. 현재 구현은 출력 bytes와 패킷을 메모리에 보관하므로 긴 영상/저메모리 기기에는 적합하지 않다.

현재 MP4는 중간 VP8 WebM을 H.264로 재인코딩한다. 무손실 프레임에서 직접 MP4를 만드는 경로와 인코딩 품질이 같다고 주장하지 않는다.

인코더 큐는 1초 분량마다 flush하고 UI에 진행률을 알린다. 취소 신호를 검사하고 VideoFrame/VideoEncoder를 닫는다. 첫 패킷은 키프레임이어야 하며 패킷 시각의 역전을 거부한다. WebM에 Duration·해상도·기본 프레임 길이·클러스터·cue index를 쓴다. 저장 전에 브라우저 video 요소로 메타데이터 길이/해상도를 확인한다. 이는 모든 프레임의 독립적 디코드/영상 품질/과학적 정확성 검증을 대신하지 않는다.

브라우저가 생성 WebM을 미리보기로 열지 못하면 출력 프레임 수와 계획만 기록하고 `actual=null`, `nativePreviewError`를 명시한다. 검증이 끝났다고 표시하지 않으며 MP4 변환/ffprobe 검사를 안내한다. 실제 16:9 시험 WebM은 이 경로에 해당했고 ffprobe에서는 정상 VP8/1920×1080/10초로 읽혔다. 이 환경의 WebM 미리보기 호환성은 제한이며 MP4 경로와 구별한다.

출력은 영상, 같은 타임라인의 VTT, SHA-256·계획/실제 메타데이터·입력/증명/cue·출처 참조를 담은 JSON이다. source snapshot/권리/사람의 내용 승인/공개 상태는 false로 유지한다. 파일을 생성했다고 기존 30초 storyboard 계약이나 출판 pipeline이 완료되었다고 표시하지 않는다.

MP4 변환은 `node scripts/encode-mp4.mjs input.webm output.mp4` 또는 UI의 `POST /api/render/mp4`를 사용한다. 실행은 shell 없이 인자 배열을 사용해 `mise exec -- ffmpeg/ffprobe`로 제한한다. 출력 덮어쓰기는 거부한다. UI API는 같은 로컬 origin·WebM MIME/서명·100MiB 이하·한 번에 한 작업만 허용하고 서버가 만든 UUID 디렉터리에 저장한다. ffprobe로 지원 해상도와 10분 이하 길이를 확인한 뒤 변환한다. 입력/출력 해시·코덱/길이/해상도/프레임 수·FFmpeg 버전을 기록한다. `/renders/`는 해당 생성물 디렉터리에 한정된다. 변환 요청 중에는 설정과 취소를 잠근다. 브라우저 프레임 인코딩의 취소와 FFmpeg 변환의 취소를 혼동하지 않는다. HTTP 파일 응답은 전체 파일 방식이며 대용량 Range 스트리밍은 후속 범위다.

참고한 규격: [W3C WebCodecs](https://www.w3.org/TR/webcodecs/), [WebM Container Guidelines](https://www.webmproject.org/docs/container/). 외부 구현 코드를 복제하지 않았다.
