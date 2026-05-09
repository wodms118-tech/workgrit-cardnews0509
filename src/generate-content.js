const Anthropic = require('@anthropic-ai/sdk');
const fs = require('fs-extra');

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function generateContent(category) {
  const prompt = `
반드시 JSON만 반환하세요. 다른 텍스트나 코드블록 없이 순수 JSON만 출력하세요.

카테고리: ${category}

워크그릿 인스타 카드뉴스 콘텐츠를 생성하세요.

카드 구성:
- card_01: 훅 (SUCCESs 6원칙 중 하나 적용)
- card_02: 내용1
- card_03: 내용2
- card_04: 내용3
- card_05: 마무리/CTA

나레이션 대본도 생성하세요. 자연스러운 말투로 변환, [pause]와 [long pause] 삽입.

출력 형식:
{
  "cards": [
    {"title": "훅 제목", "content": "내용"},
    ...
  ],
  "script": "전체 나레이션 대본"
}
  `;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const cleanJson = response.content[0].text
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();
  return JSON.parse(cleanJson);
}

module.exports = generateContent;