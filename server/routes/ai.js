const express = require('express');
const router = express.Router();

// Gemini AI API endpoint
router.post('/gemini', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        
        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Gemini API key not configured' });
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`;
        
        const payload = {
            contents: [{
                role: "user",
                parts: [{ text: prompt }]
            }]
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const result = await response.json();
        const aiResponse = result.candidates[0].content.parts[0].text;

        res.json({ 
            success: true, 
            response: aiResponse,
            model: 'gemini-2.5-flash-preview-05-20'
        });

    } catch (error) {
        console.error('Gemini API error:', error);
        res.status(500).json({ 
            error: 'Failed to get AI response',
            details: error.message 
        });
    }
});

module.exports = router;
