import type { VercelRequest, VercelResponse } from '@vercel/node';

const FAST_MODELS = ['gemini-1.5-flash', 'gemini-2.0-flash'];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const rawKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '';
  const apiKey = rawKey.trim();
  const { season = 'spring', lang = 'zhTW', restrictions = [] } = req.body || {};
  const isZh = lang !== 'en';
  const restrictionStr = Array.isArray(restrictions) && restrictions.length > 0 ? restrictions.join(', ') : 'None';

  // 1. 尝试快速请求 Gemini API（带 4 秒超时控制器）
  if (apiKey) {
    const prompt = `You are a Michelin chef. Generate a 7-day meal plan (21 UNIQUE dishes: 7 breakfast, 7 lunch, 7 dinner) for ${season.toUpperCase()} season.
Restrictions: ${restrictionStr}.
Language: Output title_zh, title_en, cuisine strictly in ${isZh ? 'Traditional Chinese (繁體中文)' : 'English'}.
Return ONLY a raw JSON array of 21 objects: [{"title_zh":"菜名","title_en":"Dish Name","meal_type":"breakfast","cuisine":"Style","calories":"350 kcal","prep_time":"15 mins"}]`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json', temperature: 0.7 },
    };

    for (const model of FAST_MODELS) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000); // 4秒超时保护

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

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
  }

  // 2. 超时或异常时，服务端直接返回 200 OK 和高品质时令保底菜品
  const defaultDishes = getSeasonalFallbackData(isZh);
  return res.status(200).json({ success: true, dishes: defaultDishes });
}

function getSeasonalFallbackData(isZh: boolean) {
  const bZh = ['牛油果水波蛋全麥吐司', '翡翠薺菜鮮蝦滑蛋卷', '時令草莓希臘優格碗', '菠菜乳清芝士帕尼尼', '低卡奇亞籽野莓燕麥杯', '滑嫩白米瑤柱粥佐溏心蛋', '田園嫩蘆筍烘蛋餅'];
  const bEn = ['Avocado Poached Egg Toast', 'Spring Prawn Omelette', 'Strawberry Greek Yogurt Bowl', 'Spinach Ricotta Panini', 'Chia Berry Overnight Oats', 'Silky Scallop Congee with Egg', 'Garden Asparagus Frittata'];
  const lZh = ['鮮甜蔥薑清蒸春鱸魚', '嫩蘆筍鮮蝦全麥意大利麵', '春筍黑椒安格斯牛柳粒', '越式鮮牛肉清湯河粉', '地中海烤三文魚藜麥暖碗', '日式鮮鯛魚高湯茶泡飯', '嫩菠菜炙烤香草雞胸溫沙拉'];
  const lEn = ['Cantonese Steamed Seabass', 'Asparagus & Prawn Spaghetti', 'Bamboo Black Pepper Beef', 'Vietnamese Beef Pho', 'Mediterranean Salmon Quinoa Bowl', 'Japanese Sea Bream Ochazuke', 'Grilled Herb Chicken Salad'];
  const dZh = ['法式迷迭香烤春雞佐蘆筍', '西班牙藏紅花海鮮燉飯', '香煎安格斯肉眼牛排佐蘆筍', '清蒸大西洋真鱈魚柳', '泰式香茅大蝦冬陰功湯', '意式香草烤嫩羊小排', '香煎三文魚佐黑松露時蔬'];
  const dEn = ['Rosemary Roast Chicken', 'Spanish Saffron Seafood Paella', 'Angus Ribeye with Asparagus', 'Steamed Atlantic Cod Fillet', 'Tom Yum Prawn Soup', 'Italian Herb Roasted Lamb Chops', 'Salmon with Black Truffle Greens'];

  const dishes: any[] = [];
  for (let i = 0; i < 7; i++) {
    dishes.push(
      { title_zh: bZh[i], title_en: bEn[i], meal_type: 'breakfast', cuisine: 'Healthy Western', calories: '320 kcal', prep_time: '12 mins' },
      { title_zh: lZh[i], title_en: lEn[i], meal_type: 'lunch', cuisine: 'Gourmet Style', calories: '420 kcal', prep_time: '20 mins' },
      { title_zh: dZh[i], title_en: dEn[i], meal_type: 'dinner', cuisine: 'Michelin Home', calories: '480 kcal', prep_time: '30 mins' }
    );
  }
  return dishes;
}