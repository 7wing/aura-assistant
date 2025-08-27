require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express();
const port = process.env.PORT || 3000;

app.use(cors()); 
app.use(express.json());

app.post('/api/gemini', async (req, res) => {
    const { prompt } = req.body;
    const GEMINI_API_URL = process.env.GEMINI_API_URL;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY || !GEMINI_API_URL) {
        return res.status(500).json({ error: 'API key or URL not configured' });
    }

    try {
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching from Gemini API:', error);
        res.status(500).json({ error: 'Failed to fetch from Gemini API' });
    }
});

app.use(express.static('public')); 

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});