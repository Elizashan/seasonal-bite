import type { VercelRequest, VercelResponse } from '@vercel/node';

// 官方标准支持的生产模型名称
const CANDIDATE_MODELS = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-2.0-flash',
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const rawKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  const apiKey = rawKey.trim();

  const { season = 'spring', lang = 'zhTW', restrictions = [] } = req.body || {};
  const isZh = lang !== 'en';
  const restrictionText = Array.isArray(restrictions) && restrictions.length > 0 ? restrictions.join(', ') : 'None';

  const prompt = `You are an elite Michelin-star chef and culinary nutritionist.
Generate a complete, diverse 7-day seasonal meal plan (7 days * 3 meals = 21 UNIQUE dishes) for the ${season.toUpperCase()} season.
Strict Dietary Restrictions: Must NOT violate ${restrictionText}.

REQUIREMENTS:
1. Target Language: Output ALL dish names, ingredient names, instructions, and chef_tips strictly in ${isZh ? 'Traditional Chinese (繁體中文)' : 'English'}.
2. Ensure every single dish is UNIQUE and authentic. NO repeated dish names, NO placeholder templates.
3. Metric measurements for ingredients (e.g. "250g", "2湯匙 (30ml)", "1茶匙 (5g)").
4. 3-5 distinct step-by-step instructions with exact cooking timings and heat levels.
5. Provide 1 practical chef tip for novice cooks.

Return ONLY a raw JSON array of 21 objects with this exact structure:
[
  {
    "title_zh": "菜品中文名稱",
    "title_en": "Authentic English Name",
    "meal_type": "breakfast",
    "cuisine": "Cantonese",
    "prep_time": "15 mins",
    "calories": "320 kcal",
    "dietary_tags": ["seasonal_produce"],
    "ingredients": [
      { "name": "${isZh ? '食材名稱' : 'Ingredient'}", "amount": "200g" }
    ],
    "instructions": [
      { "step": 1, "text": "${isZh ? '具體烹飪步驟描述' : 'Cooking instruction'}" }
    ],
    "chef_tips": "${isZh ? '專業烹飪避坑技巧' : 'Chef tip'}"
  }
]`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  };

  let responseData: any = null;
  let lastError = '';

  if (apiKey) {
    for (const model of CANDIDATE_MODELS) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const apiRes = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (apiRes.ok) {
          responseData = await apiRes.json();
          break;
        } else {
          const errJson = await apiRes.json().catch(() => null);
          lastError = errJson?.error?.message || `HTTP ${apiRes.status} on ${model}`;
        }
      } catch (e: any) {
        lastError = e.message || 'Fetch failed';
      }
    }
  }

  if (responseData) {
    try {
      let rawJson = responseData.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
      rawJson = rawJson.replace(/```json/gi, '').replace(/```/gi, '').trim();
      const dishes = JSON.parse(rawJson);
      if (Array.isArray(dishes) && dishes.length >= 21) {
        return res.status(200).json({ success: true, dishes });
      }
    } catch (e) {
      console.warn('JSON parse warning:', e);
    }
  }

  return res.status(502).json({ error: `Gemini generation failed: ${lastError}` });
}