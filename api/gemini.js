import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  try {
    const modelUrl = new URL(process.env.GEMINI_API_URL);
    const modelName = modelUrl.pathname.split('/').pop().split(':')[0];

    if (!modelName) {
      return res.status(500).json({ error: 'Model name not found in GEMINI_API_URL.' });
    }

    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    res.status(200).json(result.response);
  } catch (err) {
    console.error('Gemini error:', err);
    res.status(500).json({ error: 'Failed to generate content.' });
  }
}
