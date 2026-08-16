import type { Dish, Lang, RestrictionCode, ThemeMode } from '@/types/recipe';
import { matchCulinaryImage } from './imageLibrary';

const SEASONAL_PRODUCE_MAP: Record<ThemeMode, { zh: string[]; en: string[] }> = {
  spring: {
    zh: ['春筍', '嫩蘆筍', '薺菜', '春鱸魚', '蠶豆', '菠菜', '草莓'],
    en: ['Spring Asparagus', 'Fresh Seabass', 'Baby Spinach', 'Snap Peas', 'Strawberries'],
  },
  summer: {
    zh: ['羅馬番茄', '新鮮羅勒', '三色彩椒', '小西葫蘆', '藍莓', '海蝦仁'],
    en: ['Roma Tomatoes', 'Sweet Basil', 'Zucchini', 'Bell Peppers', 'Blueberries', 'Tiger Prawns'],
  },
  autumn: {
    zh: ['板栗', '南瓜', '野生牛肝菌', '蓮藕', '法式羊排', '三文魚', '無花果'],
    en: ['Golden Pumpkin', 'Porcini Mushrooms', 'Lamb Chops', 'Wild Salmon', 'Figs'],
  },
  winter: {
    zh: ['黑松露', '冬根莖蔬菜', '銀鱈魚', '安格斯牛腩', '大白菜', '白蘿蔔'],
    en: ['Black Truffle', 'Winter Root Veggies', 'Black Cod', 'Angus Beef', 'Hearty Broth'],
  },
};

const CANDIDATE_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
];

export async function generateSeasonalWeeklyPlan(
  season: ThemeMode,
  lang: Lang,
  restrictions: Set<RestrictionCode>
): Promise<Dish[][]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const isZh = lang !== 'en';
  const restrictionText = Array.from(restrictions).join(', ') || 'None';
  const seasonalProduce = (isZh ? SEASONAL_PRODUCE_MAP[season]?.zh : SEASONAL_PRODUCE_MAP[season]?.en)?.join('、') || '';

  if (apiKey) {
    const prompt = `You are a Michelin-star chef and master nutritionist.
Generate a complete, diverse 7-day seasonal meal plan (7 days * 3 meals = 21 UNIQUE dishes) for ${season.toUpperCase()} season.
Seasonal Focus Ingredients: ${seasonalProduce}.
Strict Dietary Restrictions: Must NOT violate ${restrictionText}.

Requirements for each dish:
1. Target Language: ALL titles, ingredients, and instructions MUST be in ${isZh ? 'Traditional Chinese (繁體中文)' : 'English'}.
2. title_zh (Traditional/Simplified Chinese) and title_en (Authentic Culinary English Name).
3. meal_type: "breakfast" | "lunch" | "dinner".
4. ingredients: Array with EXACT metric amounts (e.g. "500g", "2.5汤匙 (35ml)", "1茶匙 (5g)").
5. instructions: 3-5 step-by-step authentic cooking steps with exact timings and heat levels.
6. chef_tips: 1 practical culinary tip.

Return ONLY a valid JSON array of 21 objects.`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    };

    let responseData: any = null;

    for (const model of CANDIDATE_MODELS) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        );

        if (res.ok) {
          responseData = await res.json();
          break;
        }
      } catch {
        continue;
      }
    }

    if (responseData) {
      try {
        let rawJson = responseData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        rawJson = rawJson.replace(/```json/gi, '').replace(/```/gi, '').trim();
        const list: any[] = JSON.parse(rawJson);

        if (Array.isArray(list) && list.length >= 21) {
          const formattedDishes: Dish[] = list.map((item, idx) => {
            const tZh = item.title_zh || item.title || '時令料理';
            const tEn = item.title_en || 'Seasonal Dish';
            const mType = item.meal_type || (idx % 3 === 0 ? 'breakfast' : idx % 3 === 1 ? 'lunch' : 'dinner');

            return {
              id: `ai-${Date.now()}-${idx}`,
              slug: `seasonal-${season}-${idx}-${Date.now()}`,
              title: { en: tEn, zhCN: tZh, zhTW: tZh, zh: tZh },
              title_zh: tZh,
              title_en: tEn,
              season: season,
              meal_type: mType,
              cuisine: item.cuisine || 'Home Cooking',
              prep_time: item.prep_time || '20 mins',
              calories: item.calories || '350 kcal',
              image_url: matchCulinaryImage(tZh, tEn, mType),
              dietary_tags: Array.isArray(item.dietary_tags) ? item.dietary_tags : ['seasonal_produce'],
              ingredients: Array.isArray(item.ingredients) ? item.ingredients : [{ name: isZh ? '時令主食材' : 'Prime Ingredient', amount: '200g' }],
              instructions: Array.isArray(item.instructions) ? item.instructions : [{ step: 1, text: isZh ? '按常規烹調享用。' : 'Prepare and cook to perfection.' }],
              chef_tips: item.chef_tips || '',
            };
          });

          const plan: Dish[][] = [];
          for (let d = 0; d < 7; d++) {
            plan.push([formattedDishes[d * 3], formattedDishes[d * 3 + 1], formattedDishes[d * 3 + 2]]);
          }
          return plan;
        }
      } catch (e) {
        console.warn('JSON parsing error:', e);
      }
    }
  }

  // 若无 Key 或全部请求受阻，返回格式规整的 7 天空槽位或提示
  return Array.from({ length: 7 }, () => [null, null, null]);
}