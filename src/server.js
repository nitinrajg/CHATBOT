const express = require('express');
const bodyParser = require('body-parser');
const OpenAI = require('openai');

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI.OpenAIApi('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');

app.post('/process-voice', async (req, res) => {
  const { transcript } = req.body;

  try {
    const response = await openai.complete({
      engine: 'text-davinci-002',
      prompt: `Assistant: ${transcript}\n`,
      maxTokens: 100,
      temperature: 0.5,
    });

    const data = {
      text: response.data.choices[0].text.trim(),
    };

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: 'An error occurred while processing the voice input.',
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});