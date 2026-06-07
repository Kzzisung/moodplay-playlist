# 🎵 MoodPlay — 감정기반 플레이리스트 생성 서비스

> 감정을 말해줘, 음악을 찾아줄게

감정이나 기분을 자연어로 입력하면 AI가 분석하여 어울리는 음악 플레이리스트를 추천해주는 웹 서비스입니다.

## ✨ 주요 기능

- 🧠 **AI 감정 분석**: Claude API로 입력 텍스트에서 mood / energy / genre 추출
- 🎶 **음악 추천**: Spotify Web API로 실제 트랙 검색 + 30초 미리듣기
- 📺 **YouTube 연동**: 트랙별 YouTube 검색 링크 자동 생성
- 💾 **최근 기록**: localStorage에 최대 5건 자동 저장 (FIFO)

## 🛠 기술 스택

| 역할 | 기술 |
|------|------|
| Frontend | React 18 + Vite |
| Backend | Node.js + Express.js |
| Reverse Proxy | NGINX |
| Container | Docker + Docker Compose |
| AI | Claude API (Haiku) |
| 음악 데이터 | Spotify Web API |
| CI/CD | GitHub Actions |
| 배포 | Render |

## 🚀 로컬 실행

### 1. 환경변수 설정

```bash
cd backend
cp .env.example .env
# .env 파일에 API 키 입력
```

### 2. Docker Compose로 실행

```bash
docker compose up --build
```

브라우저에서 `http://localhost` 접속

### 3. 개발 모드 (Docker 없이)

```bash
# 터미널 1 - 백엔드
cd backend && npm install && npm run dev

# 터미널 2 - 프론트엔드
cd frontend && npm install && npm run dev
```

## 🔑 필요한 API 키

| API | 발급처 |
|-----|--------|
| Claude API Key | [console.anthropic.com](https://console.anthropic.com) |
| Spotify Client ID/Secret | [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard) |

## 📁 프로젝트 구조

```
moodplay-playlist/
├── backend/
│   ├── routes/
│   │   ├── analyze.js    # Claude API 감정 분석
│   │   └── spotify.js    # Spotify 트랙 검색
│   ├── tests/
│   ├── server.js
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── MoodInput.jsx
│   │   │   ├── PlaylistResult.jsx
│   │   │   ├── TrackCard.jsx
│   │   │   └── HistoryPanel.jsx
│   │   ├── hooks/
│   │   │   └── useHistory.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── Dockerfile
├── nginx/
│   └── default.conf
├── .github/workflows/ci.yml
├── docker-compose.yml
└── render.yaml
```

## 📝 CI/CD

`main` 브랜치 push 시 자동 실행:
1. 백엔드 테스트
2. 프론트엔드 빌드
3. Docker 이미지 빌드
4. Render 자동 배포

---

**Web Programming 프로젝트 | 202201446 강지성**
