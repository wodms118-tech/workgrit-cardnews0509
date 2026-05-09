const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

async function generateImages(content) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080 });

  const outputDir = `output/${new Date().toISOString().split('T')[0]}_${content.category}`;
  await fs.ensureDir(outputDir);

  for (let i = 0; i < content.cards.length; i++) {
    const card = content.cards[i];
    let html = await fs.readFile('./src/templates/card.html', 'utf-8');
    html = html.replace('{{title}}', card.title).replace('{{content}}', card.content);
    await page.setContent(html);
    await page.screenshot({ path: path.join(outputDir, `card_${String(i+1).padStart(2, '0')}.png`) });
  }

  await browser.close();
}

module.exports = generateImages;
