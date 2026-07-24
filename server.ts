import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client server-side
const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Endpoint: AI Weather Assistant & Intelligent Planning Summary
app.post('/api/weather-ai', async (req, res) => {
  try {
    const { city, country, tempC, condition, humidity, windSpeed, uvIndex, rainProb, forecastSummary, prompt } = req.body;

    const ai = getGenAI();
    if (!ai) {
      return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured.' });
    }

    const systemInstruction = `You are WeatherIntel AI, an expert meteorologist and outdoor lifestyle advisor.
Provide concise, actionable, and engaging weather intelligence for users.
Focus on practical daily advice: clothing choices, outdoor activity scores (running, cycling, dining out, stargazing), travel/commute risks, and UV/health warnings.
Keep formatting clean with clear markdown headings and bullet points. Format with emojis for readability.`;

    const userPrompt = prompt || `Provide a Weather Intelligence Summary and Planning Recommendation for:
City: ${city}, ${country || ''}
Current Weather: ${condition}, ${tempC}°C
Humidity: ${humidity}%
Wind Speed: ${windSpeed} km/h
UV Index: ${uvIndex}
Precipitation Probability: ${rainProb}%
Upcoming 7-Day Outlook Highlights: ${forecastSummary || 'Normal seasonal variations'}

Include:
1. 👕 What to Wear (Specific outfit & accessories guidance)
2. 🏃 Outdoor Activities Score (Running, Cycling, Outdoor Events, Camping)
3. ⚠️ Safety & Health Advisories (UV protection, hydration, driving/wind/rain risks)
4. 🌟 Quick AI Tip for Today`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const aiText = response.text || 'Unable to generate weather insights at this time.';
    res.json({ result: aiText });
  } catch (err: any) {
    console.error('Error generating AI weather insights:', err);
    res.status(500).json({ error: err.message || 'Failed to generate AI weather insights.' });
  }
});

// Vite Middleware for development / static serving for production
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Weather Intelligence server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer().catch((err) => {
  console.error('Failed to start server:', err);
});
