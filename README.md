---
title: SIHA Web
emoji: 💬
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
---

# SIHA Web — Hugging Face Spaces 배포판

업로드한 SIHA HTML 화면을 유지하고, 실제 생성형 답변을 Python Transformers 백엔드에 연결한 시작판입니다. `llama-server`를 사용하지 않습니다. 기본 모델은 `Qwen/Qwen2.5-0.5B-Instruct`이며 CPU에서 실행합니다.

## 배포 방법
1. Hugging Face 계정에 로그인하고 새 **Space**를 만듭니다.
2. SDK는 **Docker**로 선택합니다.
3. 이 폴더 안의 `README.md`, `Dockerfile`, `requirements.txt`, `app.py`, `index.html`을 Space 저장소 루트에 업로드합니다.
4. 빌드가 완료되면 Space의 URL을 열어 대화합니다. 첫 시작 때 모델 가중치를 다운로드하므로 초기 기동은 오래 걸릴 수 있습니다.

## 기능 및 한계
- 채팅은 규칙 문구만 반환하는 대신 서버의 실제 Qwen 모델이 생성합니다.
- 최근 대화 일부를 브라우저에서 보내므로 대화 문맥을 이어갈 수 있습니다. 기록은 브라우저 localStorage에 저장됩니다.
- `/search`는 한국어 Wikipedia 검색을 제공합니다. 이미지 생성 기능은 원본 HTML의 외부 이미지 서비스 호출을 유지합니다. 따라서 이미지 프롬프트는 해당 외부 서비스로 전송됩니다.
- `모델 학습` 탭의 브라우저 학습 기능은 작은 데모 모델이며, 서버에 배포된 Qwen 모델의 가중치를 학습하거나 바꾸지는 않습니다.
- 무료 Space는 잠들거나 느릴 수 있고, CPU 추론은 답변이 느릴 수 있습니다. 공개 웹사이트라면 이용량 제한/인증을 추가하는 것이 좋습니다. 이 데모에는 강한 인증이나 남용 방지 기능이 없습니다.
- 사용자의 대화는 모델 추론을 위해 Space 서버로 전송됩니다. 민감한 개인정보를 입력하지 마세요.
