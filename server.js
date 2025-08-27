import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/gemini', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required.' });
        }

        const modelUrl = new URL(process.env.GEMINI_API_URL);
        const modelName = modelUrl.pathname.split('/').pop().split(':')[0];

        if (!modelName) {
            return res.status(500).json({ error: 'Model name not found in GEMINI_API_URL.' });
        }

        const model = genAI.getGenerativeModel({ model: modelName });

        const result = await model.generateContent(prompt);
        const response = result.response;

        res.json(response);

    } catch (error) {
        console.error('Error with Gemini API:', error);
        res.status(500).json({ error: 'Failed to generate content from Gemini API.' });
    }
});

app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});