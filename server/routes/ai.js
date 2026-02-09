const express = require('express');
const router = express.Router();

// Gemini AI API endpoint
router.post('/gemini', async (req, res) => {
    try {
        const { prompt } = req.body;
        console.log('Received Gemini prompt:', prompt);
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
        
        if (!GEMINI_API_KEY) {
            return res.status(500).json({ error: 'Gemini API key not configured' });
        }

        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAMcVteK3Z4k6cfGI0Dv2wj-z67_iw6L4Y`;
            
        const payload = {
            contents: [{
                role: "user",
                parts: [{ text: prompt }]
            }]
        };
        console.log('Gemini API payload:', payload.contents.parts);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        console.log('Gemini API response:', response);

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
