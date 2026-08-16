import type { VercelRequest, VercelResponse } from '@vercel/node';

export const config = {
  maxDuration: 30, // 声明延长函数执行上限
};

const FAST_MODELS = ['gemini-1.5-flash', 'gemini-2.0-flash'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const rawKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  const apiKey = rawKey.trim();

  if (!apiKey) {
    return res.status(500).json({ error: 'Missing API Key' });
  }

  const { season = 'spring', lang = 'zhTW', restrictions = [] } = req.body || {};
  const isZh = lang !== 'en';
  const restrictionStr = Array.isArray(restrictions) && restrictions.length > 0 ? restrictions.join(', ') : 'None';

  // 极速提示词：优先保证核心菜名与风味在 3 秒内返回
  const prompt = `You are a culinary expert. Generate a 7-day seasonal meal plan (7 days * 3 meals = 21 UNIQUE dishes) for ${season.toUpperCase()} season.
Dietary constraints: ${restrictionStr}.
Language: Output title_zh, title_en, cuisine, main_ingredient strictly in ${isZh ? 'Traditional Chinese (繁體中文)' : 'English'}.

Return ONLY a raw JSON array of 21 objects:
[
  {
    "title_zh": "時令菜名",
    "title_en": "English Name",
    "meal_type": "breakfast",
    "cuisine": "Cantonese",
    "calories": "350 kcal",
    "main_ingredient": "主食材名稱",
    "prep_time": "15 mins"
  }
]`;

  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  };

  for (const model of FAST_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        let rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
        rawJson = rawJson.replace(/```json/gi, '').replace(/```/gi, '').trim();
        const dishes = JSON.parse(rawJson);

        if (Array.isArray(dishes) && dishes.length >= 21) {
          return res.status(200).json({ success: true, dishes });
        }
      }
    } catch {
      continue;
    }
  }

  return res.status(502).json({ error: 'Upstream generation timed out' });
}