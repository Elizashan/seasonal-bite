import type { VercelRequest, VercelResponse } from '@vercel/node';

const CANDIDATE_MODELS = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const apiKey = (process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) return res.status(500).json({ error: 'API Key missing on Vercel' });

  const { season = 'spring', lang = 'zhTW', restrictions = [] } = req.body || {};
  const isZh = lang !== 'en';
  const restrictionStr = Array.isArray(restrictions) && restrictions.length > 0 ? restrictions.join(', ') : 'None';

  const prompt = `You are a Michelin-star chef and clinical nutritionist.
Generate a complete, personalized 7-day seasonal meal plan (7 days * 3 meals = 21 UNIQUE dishes) for ${season.toUpperCase()} season.
Strict Dietary Restrictions: Must STRICTLY satisfy: ${restrictionStr}.

Requirements:
1. Language: Output ALL fields strictly in ${isZh ? 'Traditional Chinese (繁體中文)' : 'English'}.
2. Ensure every single dish is authentic, seasonal, and unique.
3. Metric measurements for ingredients (e.g. "250g", "2湯匙 (30ml)", "1茶匙 (5g)").
4. 3-4 precise cooking instructions with heat levels and minutes.
5. 1 practical chef tip for novice cooks.

Return ONLY a raw JSON array of 21 objects:
[
  {
    "title": "菜品名稱",
    "meal_type": "breakfast",
    "cuisine": "Cantonese",
    "prep_time": "15 mins",
    "calories": "320 kcal",
    "dietary_tags": ["seasonal_produce"],
    "ingredients": [{"name": "食材名稱", "amount": "200g"}],
    "instructions": [{"step": 1, "text": "烹飪步驟"}],
    "chef_tips": "主廚避坑要點"
  }
]`;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        let rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        rawText = rawText.replace(/```json/gi, '').replace(/```/gi, '').trim();
        const dishes = JSON.parse(rawText);
        if (Array.isArray(dishes) && dishes.length >= 21) {
          return res.status(200).json({ success: true, dishes });
        }
      }
    } catch {
      continue;
    }
  }

  return res.status(502).json({ error: 'AI generation failed' });
}