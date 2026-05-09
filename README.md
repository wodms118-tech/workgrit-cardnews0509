# Work Grit Card News Automation Pipeline

워크그릿 인스타그램 카드뉴스 자동 생성 파이프라인.

## 기능
- GitHub Actions에서 실행
- Claude API로 콘텐츠 생성
- Puppeteer로 이미지 생성
- Fish Audio API로 나레이션 생성
- Artifacts로 결과물 저장

## 사용법
1. GitHub Secrets에 ANTHROPIC_API_KEY와 FISH_AUDIO_API_KEY 설정
2. 워크플로우 수동 실행
3. Artifacts 다운로드

## 구조
- src/: 소스 코드
- .github/workflows/: GitHub Actions
- output/: 생성된 파일들 (런타임)