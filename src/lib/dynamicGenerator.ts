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

export async function generateSeasonalWeeklyPlan(
  season: ThemeMode,
  lang: Lang,
  restrictions: Set<RestrictionCode>
): Promise<Dish[][]> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const isZh = lang !== 'en';
  const restrictionText = Array.from(restrictions).join(', ') || 'None';
  const seasonalProduce = (isZh ? SEASONAL_PRODUCE_MAP[season].zh : SEASONAL_PRODUCE_MAP[season].en).join('、');

  const prompt = `You are an elite Michelin-trained chef and culinary nutritionist.
Create a complete, diverse 7-day seasonal meal plan (7 days * 3 meals = 21 UNIQUE dishes) for ${season.toUpperCase()} season.
Seasonal Focus Ingredients: ${seasonalProduce}.
Strict Dietary Restrictions: Must NOT violate ${restrictionText}.

STRICT REQUIREMENTS:
1. Target Language: ${isZh ? 'Traditional Chinese (繁體中文)' : 'English'}.
2. Output strictly a JSON array of 21 objects.
3. Every single dish must have DISTINCT, authentic cooking steps with exact heat levels and timings (e.g. "中火煎4分鐘至兩面金黃"). NO generic placeholder templates.
4. Ingredients must have exact metric quantities (e.g. "250g", "2湯匙 (30ml)", "1茶匙 (5g)").

JSON Schema per item:
{
  "title_zh": "菜品名稱",
  "title_en": "Authentic English Name",
  "meal_type": "breakfast" | "lunch" | "dinner",
  "cuisine": "e.g. Cantonese / Italian / French",
  "prep_time": "20 mins",
  "calories": "380 kcal",
  "dietary_tags": ["seasonal_produce"],
  "ingredients": [{ "name": "${isZh ? '食材名稱' : 'Ingredient name'}", "amount": "200g" }],
  "instructions": [{ "step": 1, "text": "${isZh ? '具體步驟描述' : 'Cooking instruction'}" }],
  "chef_tips": "${isZh ? '專業防翻車技巧' : 'Chef tip'}"
}`;

  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: 'application/json' },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        let rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
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
        }
      }
    } catch (e) {
      console.warn('Live API request failed (likely regional IP restriction):', e);
    }
  }

  return generateAlgorithmicPlan(season, lang);
}

function generateAlgorithmicPlan(season: ThemeMode, lang: Lang): Dish[][] {
  const isZh = lang !== 'en';

  const seasonalBreakfasts: Record<ThemeMode, Array<{ zh: string; en: string; cal: string; time: string; cuisine: string }>> = {
    spring: [
      { zh: '牛油果水波蛋全麥吐司', en: 'Avocado Poached Egg Toast', cal: '320 kcal', time: '15 mins', cuisine: 'Western' },
      { zh: '翡翠春筍鮮蔬蒸餃', en: 'Steamed Spring Bamboo Dumplings', cal: '280 kcal', time: '18 mins', cuisine: 'Chinese' },
      { zh: '時令草莓希臘優格碗', en: 'Spring Berry Greek Yogurt Bowl', cal: '250 kcal', time: '10 mins', cuisine: 'Mediterranean' },
      { zh: '鮮蝦薺菜滑蛋卷', en: 'Shepherds Purse Prawn Omelette', cal: '310 kcal', time: '12 mins', cuisine: 'Chinese' },
      { zh: '菠菜芝士全麥帕尼尼', en: 'Spinach Cheese Wholewheat Panini', cal: '340 kcal', time: '15 mins', cuisine: 'Italian' },
      { zh: '低卡奇亞籽燕麥布丁', en: 'Chia Seed Overnight Oats', cal: '260 kcal', time: '10 mins', cuisine: 'Healthy' },
      { zh: '滑嫩白米粥佐溏心蛋', en: 'Silky Rice Congee with Soft Egg', cal: '220 kcal', time: '20 mins', cuisine: 'Chinese' },
    ],
    summer: [
      { zh: '時令藍莓希臘優格杯', en: 'Summer Blueberry Greek Yogurt', cal: '240 kcal', time: '10 mins', cuisine: 'Mediterranean' },
      { zh: '番茄牛油果酸麵包', en: 'Tomato Avocado Sourdough Toast', cal: '310 kcal', time: '12 mins', cuisine: 'Western' },
      { zh: '京都抹茶奇亞籽布丁', en: 'Kyoto Matcha Chia Pudding', cal: '230 kcal', time: '10 mins', cuisine: 'Japanese' },
      { zh: '彩椒羅勒無油煎蛋餅', en: 'Summer Pepper Basil Omelette', cal: '280 kcal', time: '12 mins', cuisine: 'Western' },
      { zh: '鮮果燕麥巴西莓碗', en: 'Fresh Acai Smoothie Bowl', cal: '290 kcal', time: '15 mins', cuisine: 'Healthy' },
      { zh: '全麥冷萃果乾燕麥片', en: 'Cold Brew Overnight Muesli', cal: '270 kcal', time: '10 mins', cuisine: 'Nordic' },
      { zh: '田園鮮蔬水煎包', en: 'Pan-Fried Vegetable Bao', cal: '320 kcal', time: '18 mins', cuisine: 'Chinese' },
    ],
    autumn: [
      { zh: '金黃南瓜肉桂燕麥粥', en: 'Golden Pumpkin Spiced Oatmeal', cal: '290 kcal', time: '15 mins', cuisine: 'Healthy' },
      { zh: '菠菜乳清芝士意式烘蛋', en: 'Spinach Ricotta Italian Frittata', cal: '330 kcal', time: '20 mins', cuisine: 'Italian' },
      { zh: '香烤栗子全麥貝果', en: 'Roasted Chestnut Wholewheat Bagel', cal: '340 kcal', time: '12 mins', cuisine: 'Western' },
      { zh: '無花果蜂蜜酸奶厚吐司', en: 'Fig Honey Greek Yogurt Toast', cal: '310 kcal', time: '10 mins', cuisine: 'Mediterranean' },
      { zh: '紫薯燕麥溫熱飲', en: 'Warm Sweet Potato Oat Porridge', cal: '260 kcal', time: '15 mins', cuisine: 'Chinese' },
      { zh: '黑松露野菌全麥吐司', en: 'Truffle Mushroom Sourdough', cal: '320 kcal', time: '15 mins', cuisine: 'French' },
      { zh: '溫潤小米南瓜暖粥', en: 'Warm Millet Pumpkin Porridge', cal: '230 kcal', time: '20 mins', cuisine: 'Chinese' },
    ],
    winter: [
      { zh: '黑松露野菌滑蛋', en: 'Truffle Wild Mushroom Scramble', cal: '310 kcal', time: '12 mins', cuisine: 'French' },
      { zh: '煙熏三文魚全麥貝果', en: 'Smoked Salmon Dill Bagel', cal: '360 kcal', time: '12 mins', cuisine: 'Nordic' },
      { zh: '溫熱紅豆燕麥暖心粥', en: 'Warm Red Bean Oat Porridge', cal: '290 kcal', time: '20 mins', cuisine: 'Chinese' },
      { zh: '芝士厚蛋燒佐全麥多士', en: 'Tamagoyaki with Wholewheat Toast', cal: '340 kcal', time: '15 mins', cuisine: 'Japanese' },
      { zh: '法式洋蔥芝士烘蛋杯', en: 'French Onion Egg Cocotte', cal: '330 kcal', time: '18 mins', cuisine: 'French' },
      { zh: '薑汁黑糖熱燕麥碗', en: 'Ginger Brown Sugar Oatmeal', cal: '280 kcal', time: '12 mins', cuisine: 'Healthy' },
      { zh: '生滾牛肉片溫胃粥', en: 'Cantonese Sliced Beef Congee', cal: '350 kcal', time: '20 mins', cuisine: 'Chinese' },
    ],
  };

  const seasonalLunches: Record<ThemeMode, Array<{ zh: string; en: string; cal: string; time: string; cuisine: string }>> = {
    spring: [
      { zh: '鮮甜蔥薑清蒸鱸魚', en: 'Cantonese Steamed Seabass with Scallions', cal: '280 kcal', time: '18 mins', cuisine: 'Chinese' },
      { zh: '越式鮮牛肉清湯河粉', en: 'Vietnamese Artisanal Beef Pho', cal: '410 kcal', time: '20 mins', cuisine: 'Vietnamese' },
      { zh: '蘆筍鮮蝦全麥意麵', en: 'Asparagus Prawn Spaghetti', cal: '390 kcal', time: '20 mins', cuisine: 'Italian' },
      { zh: '春筍黑椒嫩牛柳粒', en: 'Spring Bamboo Black Pepper Beef', cal: '430 kcal', time: '20 mins', cuisine: 'Chinese' },
      { zh: '地中海烤三文魚藜麥碗', en: 'Mediterranean Salmon Quinoa Bowl', cal: '440 kcal', time: '22 mins', cuisine: 'Mediterranean' },
      { zh: '日式鮮鯛魚茶泡飯', en: 'Japanese Sea Bream Ochazuke', cal: '360 kcal', time: '15 mins', cuisine: 'Japanese' },
      { zh: '嫩菠菜雞胸溫沙拉', en: 'Baby Spinach Grilled Chicken Salad', cal: '340 kcal', time: '18 mins', cuisine: 'Western' },
    ],
    summer: [
      { zh: '新鮮番茄羅勒意大利麵', en: 'Fresh Tomato Basil Summer Spaghetti', cal: '380 kcal', time: '20 mins', cuisine: 'Italian' },
      { zh: '彩椒藜麥嫩烤雞胸碗', en: 'Rainbow Quinoa Grilled Chicken Bowl', cal: '420 kcal', time: '25 mins', cuisine: 'Mediterranean' },
      { zh: '地中海番茄檸檬鮮蝦面', en: 'Tomato Lemon Garlic Prawn Pasta', cal: '410 kcal', time: '20 mins', cuisine: 'Mediterranean' },
      { zh: '韓式照燒嫩雞肉蓋飯', en: 'Chicken and Rice Bowl', cal: '430 kcal', time: '20 mins', cuisine: 'Korean' },
      { zh: '泰式鮮蝦青木瓜溫拌面', en: 'Thai Prawn Summer Noodle Bowl', cal: '370 kcal', time: '18 mins', cuisine: 'Thai' },
      { zh: '香煎銀鱈魚佐西葫蘆', en: 'Pan-Seared Cod with Zucchini', cal: '360 kcal', time: '20 mins', cuisine: 'Western' },
      { zh: '牛油果金槍魚彩虹沙拉', en: 'Avocado Tuna Rainbow Salad', cal: '390 kcal', time: '15 mins', cuisine: 'Healthy' },
    ],
    autumn: [
      { zh: '鄉村蔬菜濃湯佐酸麵包', en: 'Rustic Autumn Vegetable Soup', cal: '290 kcal', time: '25 mins', cuisine: 'French' },
      { zh: '日式煎三文魚茶泡飯', en: 'Japanese Salmon Green Tea Rice', cal: '390 kcal', time: '15 mins', cuisine: 'Japanese' },
      { zh: '牛肝菌黑松露燉飯', en: 'Porcini Truffle Arborio Risotto', cal: '460 kcal', time: '30 mins', cuisine: 'Italian' },
      { zh: '板栗南瓜慢煨雞腿肉', en: 'Braised Chicken with Chestnuts', cal: '450 kcal', time: '30 mins', cuisine: 'Chinese' },
      { zh: '蓮藕胡蘿蔔排骨清湯面', en: 'Lotus Root Pork Rib Noodle Soup', cal: '420 kcal', time: '35 mins', cuisine: 'Chinese' },
      { zh: '香煎鴨胸佐無花果汁', en: 'Seared Duck Breast with Fig Glaze', cal: '480 kcal', time: '25 mins', cuisine: 'French' },
      { zh: '秋季根莖蔬菜暖溫碗', en: 'Warm Autumn Roasted Root Bowl', cal: '340 kcal', time: '25 mins', cuisine: 'Healthy' },
    ],
    winter: [
      { zh: '牛肝菌黑松露燉飯', en: 'Porcini Truffle Arborio Risotto', cal: '460 kcal', time: '30 mins', cuisine: 'Italian' },
      { zh: '韓式海鮮嫩豆腐暖鍋', en: 'Korean Soft Tofu Seafood Stew', cal: '360 kcal', time: '20 mins', cuisine: 'Korean' },
      { zh: '冬日根莖蔬菜慢燉湯', en: 'Hearty Winter Vegetable Stew', cal: '310 kcal', time: '30 mins', cuisine: 'French' },
      { zh: '濃湯白蘿蔔鮮牛腩煲', en: 'Braised Beef Brisket with Radish', cal: '490 kcal', time: '40 mins', cuisine: 'Chinese' },
      { zh: '京都白味噌海鮮烏冬面', en: 'Saikyo Miso Seafood Udon', cal: '430 kcal', time: '20 mins', cuisine: 'Japanese' },
      { zh: '法式經典洋蔥濃湯', en: 'French Traditional Onion Soup', cal: '340 kcal', time: '30 mins', cuisine: 'French' },
      { zh: '黑椒洋蔥炒安格斯牛柳', en: 'Black Pepper Sliced Angus Beef', cal: '470 kcal', time: '18 mins', cuisine: 'Chinese' },
    ],
  };

  const seasonalDinners: Record<ThemeMode, Array<{ zh: string; en: string; cal: string; time: string; cuisine: string }>> = {
    spring: [
      { zh: '法式迷迭香烤春雞佐蘆筍', en: 'French Rosemary Roast Spring Chicken', cal: '480 kcal', time: '35 mins', cuisine: 'French' },
      { zh: '西班牙藏紅花海鮮燉飯', en: 'Spanish Saffron Seafood Paella', cal: '470 kcal', time: '35 mins', cuisine: 'Spanish' },
      { zh: '香煎春季三文魚佐檸檬汁', en: 'Pan-Seared Spring Salmon with Lemon', cal: '460 kcal', time: '25 mins', cuisine: 'Western' },
      { zh: '嫩煎安格斯肉眼牛排', en: 'Pan-Seared Angus Ribeye Steak', cal: '520 kcal', time: '25 mins', cuisine: 'Western' },
      { zh: '清蒸大西洋真鱈魚柳', en: 'Steamed Atlantic Cod Fillet', cal: '340 kcal', time: '20 mins', cuisine: 'Healthy' },
      { zh: '泰式香茅大蝦冬陰功湯', en: 'Thai Lemongrass Tom Yum Prawn Soup', cal: '380 kcal', time: '25 mins', cuisine: 'Thai' },
      { zh: '意式香草烤嫩羊排', en: 'Italian Herb Roasted Lamb Chops', cal: '510 kcal', time: '30 mins', cuisine: 'Italian' },
    ],
    summer: [
      { zh: '烤鮭魚佐夏日烤時蔬', en: 'Pan-Seared Salmon with Roast Greens', cal: '490 kcal', time: '25 mins', cuisine: 'Western' },
      { zh: '泰式椰香青咖哩雞', en: 'Thai Aromatic Green Curry Chicken', cal: '450 kcal', time: '25 mins', cuisine: 'Thai' },
      { zh: '香煎安格斯牛排佐蘆筍', en: 'Angus Steak with Summer Asparagus', cal: '520 kcal', time: '25 mins', cuisine: 'Western' },
      { zh: '地中海香草檸檬烤大蝦', en: 'Mediterranean Garlic Herb Prawns', cal: '380 kcal', time: '20 mins', cuisine: 'Mediterranean' },
      { zh: '香煎鱸魚柳佐莎莎醬', en: 'Seared Seabass with Tomato Salsa', cal: '360 kcal', time: '20 mins', cuisine: 'Mexican' },
      { zh: '法式黑松露嫩煎雞胸', en: 'French Truffle Herb Chicken Breast', cal: '420 kcal', time: '25 mins', cuisine: 'French' },
      { zh: '西班牙瓦倫西亞海鮮飯', en: 'Valencia Seafood Rice', cal: '470 kcal', time: '35 mins', cuisine: 'Spanish' },
    ],
    autumn: [
      { zh: '香草脆皮烤羊小排', en: 'Herb-Crusted Roasted Lamb Chops', cal: '510 kcal', time: '30 mins', cuisine: 'Western' },
      { zh: '勃艮第紅酒慢燉牛腩', en: 'Slow-Cooked Beef Bourguignon', cal: '520 kcal', time: '45 mins', cuisine: 'French' },
      { zh: '香烤鮭魚佐迷迭香土豆', en: 'Roast Salmon with Rosemary Potatoes', cal: '490 kcal', time: '30 mins', cuisine: 'Western' },
      { zh: '南瓜濃汁焗烤海鮮飯', en: 'Baked Pumpkin Seafood Rice', cal: '460 kcal', time: '35 mins', cuisine: 'Italian' },
      { zh: '京都白味噌焗銀鱈魚', en: 'Kyoto Saikyo Miso Baked Black Cod', cal: '360 kcal', time: '20 mins', cuisine: 'Japanese' },
      { zh: '法式第戎芥末烤雞腿', en: 'Dijon Mustard Roasted Chicken Thigh', cal: '470 kcal', time: '35 mins', cuisine: 'French' },
      { zh: '紅酒黑椒慢煨安格斯牛肉', en: 'Red Wine Simmered Angus Beef', cal: '530 kcal', time: '45 mins', cuisine: 'Western' },
    ],
    winter: [
      { zh: '勃艮第紅酒慢燉牛腩', en: 'Slow-Cooked Beef Bourguignon', cal: '520 kcal', time: '45 mins', cuisine: 'French' },
      { zh: '京都白味噌焗銀鱈魚', en: 'Kyoto Saikyo Miso Baked Black Cod', cal: '360 kcal', time: '20 mins', cuisine: 'Japanese' },
      { zh: '香草脆皮烤羊小排', en: 'Herb-Crusted Roasted Lamb Chops', cal: '510 kcal', time: '30 mins', cuisine: 'Western' },
      { zh: '法式迷迭香烤嫩春雞', en: 'French Rosemary Roast Chicken', cal: '480 kcal', time: '35 mins', cuisine: 'French' },
      { zh: '西班牙藏紅花海鮮燉飯', en: 'Spanish Saffron Seafood Paella', cal: '470 kcal', time: '35 mins', cuisine: 'Spanish' },
      { zh: '黑椒洋蔥慢燉牛尾煲', en: 'Braised Oxtail with Black Pepper', cal: '540 kcal', time: '50 mins', cuisine: 'Chinese' },
      { zh: '香煎三文魚柳佐黑松露汁', en: 'Pan-Seared Salmon with Truffle Sauce', cal: '490 kcal', time: '25 mins', cuisine: 'French' },
    ],
  };

  const plan: Dish[][] = [];

  for (let day = 0; day < 7; day++) {
    const b = seasonalBreakfasts[season][day];
    const l = seasonalLunches[season][day];
    const d = seasonalDinners[season][day];

    const makeDish = (item: { zh: string; en: string; cal: string; time: string; cuisine: string }, mType: 'breakfast' | 'lunch' | 'dinner'): Dish => {
      const titleZh = item.zh;
      const titleEn = item.en;

      return {
        id: `dish-${season}-${mType}-${day}-${Date.now()}`,
        slug: `slug-${season}-${mType}-${day}`,
        title: { en: titleEn, zhCN: titleZh, zhTW: titleZh, zh: titleZh },
        title_zh: titleZh,
        title_en: titleEn,
        season,
        meal_type: mType,
        cuisine: item.cuisine,
        prep_time: item.time,
        calories: item.cal,
        image_url: matchCulinaryImage(titleZh, titleEn, mType),
        dietary_tags: ['seasonal_produce'],
        ingredients: [
          { name: isZh ? `${titleZh} 主食材` : `${titleEn} Prime Ingredient`, amount: '250g' },
          { name: isZh ? '當季新鮮配菜' : 'Seasonal Fresh Produce', amount: '120g' },
          { name: isZh ? '特級初榨橄欖油 / 調味油' : 'Cooking Oil / Olive Oil', amount: '1.5湯匙 (20ml)' },
          { name: isZh ? '天然海鹽與現磨黑胡椒' : 'Sea Salt & Crushed Pepper', amount: '鹽1茶匙(4g), 胡椒少許' },
        ],
        instructions: [
          { step: 1, text: isZh ? `【備料】：將 ${titleZh} 的主配食材用清水洗淨，徹底擦乾表面水分並切成適口大小。` : `Clean and thoroughly pat dry all ingredients. Cut into uniform portions.` },
          { step: 2, text: isZh ? '【熱鍋溫油】：鍋具開中小火預熱1分鐘，倒入食用油潤鍋，油熱後下入主食材。' : 'Preheat skillet over medium heat for 1 min, add oil and begin searing main ingredients.' },
          { step: 3, text: isZh ? '【精準烹調】：主料煎炒至變色熟透，加入配菜翻炒2-3分鐘鎖住原汁原味。' : 'Cook until browned and tender, adding seasonal sides to toss for 2-3 mins.' },
          { step: 4, text: isZh ? '【調味盛盤】：出鍋前均勻撒入海鹽與現磨黑胡椒提味，關火裝盤趁熱享用。' : 'Season evenly with sea salt and black pepper, rest 1 min and serve warmly.' },
        ],
        chef_tips: isZh ? '新手避坑：食材下鍋前務必吸乾水分，能防止油花飛濺並迅速鎖住肉質與時蔬的鮮甜汁水。' : 'Chef Tip: Always pat ingredients completely dry before cooking to seal in flavor and avoid splattering.',
      };
    };

    plan.push([makeDish(b, 'breakfast'), makeDish(l, 'lunch'), makeDish(d, 'dinner')]);
  }

  return plan;
}