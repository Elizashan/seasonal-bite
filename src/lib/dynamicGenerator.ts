import type { Dish, Lang, RestrictionCode, ThemeMode } from '@/types/recipe';
import { matchCulinaryImage } from './imageLibrary';

export async function generateSeasonalWeeklyPlan(
  season: ThemeMode,
  lang: Lang,
  restrictions: Set<RestrictionCode>
): Promise<Dish[][]> {
  const restrictionArray = Array.from(restrictions);

  // 向 Vercel 海外云函数发起请求（彻底绕过浏览器 IP 限制）
  const response = await fetch('/api/generate-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      season,
      lang,
      restrictions: restrictionArray,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error: ${response.status}`);
  }

  const result = await response.json();
  const list = result.dishes;

  if (!Array.isArray(list) || list.length < 21) {
    throw new Error('Incomplete dish list returned');
  }

  const formattedDishes: Dish[] = list.map((item, idx) => {
    const tZh = item.title_zh || '時令料理';
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
      ingredients: Array.isArray(item.ingredients) ? item.ingredients : [{ name: tZh, amount: '1份' }],
      instructions: Array.isArray(item.instructions) ? item.instructions : [{ step: 1, text: '精心烹調享用。' }],
      chef_tips: item.chef_tips || '控制火候，食材下鍋前擦乾水分。',
    };
  });

  const plan: Dish[][] = [];
  for (let d = 0; d < 7; d++) {
    plan.push([formattedDishes[d * 3], formattedDishes[d * 3 + 1], formattedDishes[d * 3 + 2]]);
  }

  return plan;
}