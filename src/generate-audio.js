const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

async function generateAudio(content) {
  const outputDir = `output/${new Date().toISOString().split('T')[0]}_${content.category}`;
  await fs.ensureDir(outputDir);

  const scripts = content.script.split('\n\n'); // Assume script is split by double newlines for each card

  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    const response = await axios.post('https://api.fish.audio/v1/tts', {
      text: script,
      voice: 'ko-KR-Wavenet-A', // Example voice, adjust as needed
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.FISH_AUDIO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(path.join(outputDir, `card_${String(i+1).padStart(2, '0')}.mp3`));
    response.data.pipe(writer);
    await new Promise((resolve, reject) => {
      writer.on('finish', resolve);
      writer.on('error', reject);
    });
  }
}

module.exports = generateAudio;