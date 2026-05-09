const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

async function generateAudio(content) {
  const outputDir = `output/${new Date().toISOString().split('T')[0]}_${content.category}`;
  await fs.ensureDir(outputDir);

  const scripts = content.script.split('\n\n');

  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    const response = await axios.post('https://api.fish.audio/v1/tts', {
      text: script,
      reference_id: '182083889a2d4da09b3bb39fc1f2b978',
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.FISH_AUDIO_API_KEY}`,
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer',
    });

    await fs.outputFile(
      path.join(outputDir, `card_${String(i+1).padStart(2, '0')}.mp3`),
      Buffer.from(response.data)
    );
  }
}

module.exports = generateAudio;
