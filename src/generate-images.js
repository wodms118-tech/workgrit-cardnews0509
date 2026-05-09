const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

const categoryKeywords = {
  '멘탈관리': 'mental health, wellness, meditation',
  '업무노하우': 'productivity, work, office',
  '직장심리전': 'business, corporate, teamwork',
  'AI프롬프트': 'technology, ai, innovation'
};

const categoryColors = {
  '멘탈관리': '#C8FF00',
  '업무노하우': '#ffffff',
  '직장심리전': '#FF8C42',
  'AI프롬프트': '#7EB8FF'
};

function parseTitle(title) {
  // "앞문장|핵심단어|뒷문장" 형식으로 파싱
  const parts = title.split('|');
  if (parts.length === 3) {
    return {
      frontText: parts[0],
      keyword: parts[1],
      backText: parts[2]
    };
  }
  // 파싱 실패시 기본값
  return {
    frontText: '',
    keyword: title,
    backText: ''
  };
}

async function generateImages(content) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });

  const outputDir = `output/${new Date().toISOString().split('T')[0]}_${content.category}`;
  await fs.ensureDir(outputDir);

  const keywords = categoryKeywords[content.category] || 'business';
  const imageUrl = `https://source.unsplash.com/1080x1920/?${encodeURIComponent(keywords)}`;
  const accentColor = categoryColors[content.category] || '#ffffff';

  for (let i = 0; i < content.cards.length; i++) {
    const card = content.cards[i];
    const titleParts = parseTitle(card.title);

    let html = await fs.readFile('./src/templates/card.html', 'utf-8');
    html = html
      .replace(/\{\{category\}\}/g, content.category)
      .replace(/\{\{front_text\}\}/g, titleParts.frontText)
      .replace(/\{\{keyword\}\}/g, titleParts.keyword)
      .replace(/\{\{back_text\}\}/g, titleParts.backText)
      .replace(/\{\{content\}\}/g, card.content)
      .replace(/\{\{image_url\}\}/g, imageUrl)
      .replace(/\{\{accent_color\}\}/g, accentColor);

    await page.setContent(html);
    await page.screenshot({ path: path.join(outputDir, `card_${String(i+1).padStart(2, '0')}.png`) });
  }

  await browser.close();
}

module.exports = generateImages;