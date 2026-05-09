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
    let html = await fs.readFile('./src/templates/card.html', 'utf-8');
    html = html
      .replace('{{category}}', content.category)
      .replace('{{title}}', card.title)
      .replace('{{content}}', card.content)
      .replace('{{image_url}}', imageUrl)
      .replace('{{accent_color}}', accentColor);

    await page.setContent(html);
    await page.screenshot({ path: path.join(outputDir, `card_${String(i+1).padStart(2, '0')}.png`) });
  }

  await browser.close();
}

module.exports = generateImages;