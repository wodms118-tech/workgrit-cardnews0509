// Main entry point for the card news generation pipeline
const generateContent = require('./generate-content');
const generateImages = require('./generate-images');
const generateAudio = require('./generate-audio');
const fs = require('fs-extra');

async function main() {
  try {
    // Load state
    const state = await fs.readJson('./src/state.json').catch(() => ({ lastCategory: null }));

    // Determine next category
    const categories = ['멘탈관리', '업무노하우', '직장심리전', 'AI프롬프트'];
    const currentIndex = state.lastCategory ? categories.indexOf(state.lastCategory) : -1;
    const nextCategory = categories[(currentIndex + 1) % categories.length];

    // Generate content
    const content = await generateContent(nextCategory);

    // Generate images
    await generateImages(content);

    // Generate audio
    await generateAudio(content);

    // Save script.txt
    await fs.outputFile(`output/${new Date().toISOString().split('T')[0]}_${nextCategory}/script.txt`, content.script);

    // Update state
    await fs.outputJson('./src/state.json', { lastCategory: nextCategory });

    console.log('Pipeline completed successfully');
  } catch (error) {
    console.error('Error in pipeline:', error);
    process.exit(1);
  }
}

main();