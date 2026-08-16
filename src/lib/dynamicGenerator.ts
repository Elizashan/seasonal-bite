import type { Dish, Lang, RestrictionCode, ThemeMode } from '@/types/recipe';
import { matchCulinaryImage } from './imageLibrary';

// 洗牌算法：确保每次点击生成都产生完全不同的组合
function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export async function generateSeasonalWeeklyPlan(
  season: ThemeMode,
  lang: Lang,
  restrictions: Set<RestrictionCode>
): Promise<Dish[][]> {
  const isZh = lang !== 'en';
  const restrictionArray = Array.from(restrictions);

  let list: any[] = [];

  try {
    const response = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ season, lang, restrictions: restrictionArray }),
    });

    if (response.ok) {
      const result = await response.json();
      if (Array.isArray(result.dishes) && result.dishes.length >= 21) {
        list = result.dishes;
      }
    }
  } catch (err) {
    console.warn('API fetch warning:', err);
  }

  // 若未从云端拿到 21 道，直接启动本地高品质菜谱库并随机打乱
  if (list.length < 21) {
    return getRandomizedPlan(season, lang);
  }

  const formatted: Dish[] = list.map((item, idx) => {
    const tZh = item.title_zh || '時令料理';
    const tEn = item.title_en || 'Seasonal Dish';
    const mType = item.meal_type || (idx % 3 === 0 ? 'breakfast' : idx % 3 === 1 ? 'lunch' : 'dinner');

    return {
      id: `dish-ai-${Date.now()}-${idx}-${Math.random()}`,
      slug: `seasonal-${season}-${idx}-${Date.now()}`,
      title: { en: tEn, zhCN: tZh, zhTW: tZh, zh: tZh },
      title_zh: tZh,
      title_en: tEn,
      season,
      meal_type: mType,
      cuisine: item.cuisine || (mType === 'breakfast' ? 'Light Healthy' : 'Michelin Home Style'),
      prep_time: item.prep_time || '20 mins',
      calories: item.calories || '360 kcal',
      image_url: matchCulinaryImage(tZh, tEn, mType),
      dietary_tags: ['seasonal_produce'],
      ingredients: [
        { name: isZh ? `${tZh} 精選主食材` : `${tEn} Prime Ingredient`, amount: '220g' },
        { name: isZh ? '當季新鮮時蔬' : 'Seasonal Greens', amount: '100g' },
        { name: isZh ? '特級初榨橄欖油' : 'Olive Oil', amount: '1.5湯匙 (20ml)' },
        { name: isZh ? '天然海鹽與黑胡椒' : 'Sea Salt & Pepper', amount: isZh ? '海鹽1茶匙, 胡椒少許' : '1 tsp Salt, pinch pepper' },
      ],
      instructions: [
        { step: 1, text: isZh ? `【食材預備】：將 ${tZh} 主料與配菜洗淨並徹底擦乾水分。` : `Clean and pat dry all ingredients for ${tEn}.` },
        { step: 2, text: isZh ? '【熱鍋溫油】：平底鍋開中火預熱 1 分鐘，下油潤鍋。' : 'Preheat pan over medium heat with oil.' },
        { step: 3, text: isZh ? '【精準烹調】：主料煎炒至微黃鎖汁，加入配菜翻炒 2~3 分鐘。' : 'Cook until tender and nicely browned.' },
        { step: 4, text: isZh ? '【調味盛盤】：出鍋前撒上海鹽與黑胡椒提鮮，裝盤溫熱享用。' : 'Season with sea salt and pepper, serve warm.' },
      ],
      chef_tips: isZh ? '食材下鍋前務必吸乾水分，能防止油花飛濺並迅速鎖住鮮甜肉汁。' : 'Pat ingredients dry before cooking to seal in flavors.',
    };
  });

  const plan: Dish[][] = [];
  for (let d = 0; d < 7; d++) {
    plan.push([formatted[d * 3], formatted[d * 3 + 1], formatted[d * 3 + 2]]);
  }
  return plan;
}

function getRandomizedPlan(season: ThemeMode, lang: Lang): Dish[][] {
  const isZh = lang !== 'en';

  const breakfastPool = [
    { zh: '牛油果水波蛋全麥吐司', en: 'Avocado Poached Egg Toast' },
    { zh: '翡翠薺菜鮮蝦滑蛋卷', en: 'Spring Prawn Omelette' },
    { zh: '時令草莓希臘優格碗', en: 'Strawberry Greek Yogurt Bowl' },
    { zh: '菠菜乳清芝士帕尼尼', en: 'Spinach Ricotta Panini' },
    { zh: '低卡奇亞籽野莓燕麥杯', en: 'Chia Berry Overnight Oats' },
    { zh: '滑嫩白米瑤柱粥佐溏心蛋', en: 'Silky Scallop Congee with Egg' },
    { zh: '田園嫩蘆筍烘蛋餅', en: 'Garden Asparagus Frittata' },
    { zh: '煙熏三文魚全麥貝果', en: 'Smoked Salmon Sourdough Bagel' },
    { zh: '黑松露野菌滑蛋吐司', en: 'Truffle Mushroom Scramble' },
  ];

  const lunchPool = [
    { zh: '鮮甜蔥薑清蒸春鱸魚', en: 'Cantonese Steamed Seabass' },
    { zh: '嫩蘆筍鮮蝦全麥意大利麵', en: 'Asparagus & Prawn Spaghetti' },
    { zh: '春筍黑椒安格斯牛柳粒', en: 'Bamboo Black Pepper Beef' },
    { zh: '越式鮮牛肉清湯河粉', en: 'Vietnamese Beef Pho' },
    { zh: '地中海烤三文魚藜麥暖碗', en: 'Mediterranean Salmon Quinoa Bowl' },
    { zh: '日式鮮鯛魚高湯茶泡飯', en: 'Japanese Sea Bream Ochazuke' },
    { zh: '嫩菠菜炙烤香草雞胸溫沙拉', en: 'Grilled Herb Chicken Salad' },
    { zh: '彩椒藜麥嫩烤雞胸碗', en: 'Rainbow Quinoa Grilled Chicken Bowl' },
    { zh: '牛肝菌黑松露燉飯', en: 'Porcini Truffle Risotto' },
  ];

  const dinnerPool = [
    { zh: '法式迷迭香烤春雞佐蘆筍', en: 'Rosemary Roast Chicken' },
    { zh: '西班牙藏紅花海鮮燉飯', en: 'Spanish Saffron Seafood Paella' },
    { zh: '香煎安格斯肉眼牛排佐蘆筍', en: 'Angus Ribeye with Asparagus' },
    { zh: '清蒸大西洋真鱈魚柳', en: 'Steamed Atlantic Cod Fillet' },
    { zh: '泰式香茅大蝦冬陰功湯', en: 'Tom Yum Prawn Soup' },
    { zh: '意式香草烤嫩羊小排', en: 'Italian Herb Roasted Lamb Chops' },
    { zh: '香煎三文魚佐黑松露時蔬', en: 'Salmon with Black Truffle Greens' },
    { zh: '勃艮第紅酒慢燉牛腩', en: 'Slow-Cooked Beef Bourguignon' },
    { zh: '京都白味噌焗銀鱈魚', en: 'Kyoto Saikyo Miso Baked Black Cod' },
  ];

  // 每次调用都打乱池子顺序
  const shuffledB = shuffleArray(breakfastPool);
  const shuffledL = shuffleArray(lunchPool);
  const shuffledD = shuffleArray(dinnerPool);

  const plan: Dish[][] = [];
  for (let day = 0; day < 7; day++) {
    const make = (item: { zh: string; en: string }, mType: 'breakfast' | 'lunch' | 'dinner'): Dish => ({
      id: `dish-${season}-${mType}-${day}-${Date.now()}-${Math.random()}`,
      slug: `seasonal-${season}-${mType}-${day}-${Date.now()}`,
      title: { en: item.en, zhCN: item.zh, zhTW: item.zh, zh: item.zh },
      title_zh: item.zh,
      title_en: item.en,
      season,
      meal_type: mType,
      cuisine: mType === 'breakfast' ? 'Light Healthy' : 'Michelin Home Style',
      prep_time: '20 mins',
      calories: '380 kcal',
      image_url: matchCulinaryImage(item.zh, item.en, mType),
      dietary_tags: ['seasonal_produce'],
      ingredients: [
        { name: isZh ? `${item.zh} 精選食材` : `${item.en} Prime Ingredient`, amount: '220g' },
        { name: isZh ? '當季新鮮配菜' : 'Seasonal Vegetables', amount: '100g' },
        { name: isZh ? '特級橄欖油' : 'Cooking Oil', amount: '1.5湯匙 (20ml)' },
        { name: isZh ? '海鹽與現磨黑胡椒' : 'Sea Salt & Pepper', amount: '適量' },
      ],
      instructions: [
        { step: 1, text: isZh ? `【食材預備】：將 ${item.zh} 所需食材洗淨並擦乾水分。` : `Clean and pat dry ingredients for ${item.en}.` },
        { step: 2, text: isZh ? '【熱鍋溫油】：鍋具開中小火預熱 1 分鐘，下油潤鍋。' : 'Preheat pan over medium heat for 1 min with oil.' },
        { step: 3, text: isZh ? '【精準烹調】：主料煎炒至變色熟透，加入配菜翻炒 2~3 分鐘。' : 'Cook until browned, toss with vegetables for 2-3 mins.' },
        { step: 4, text: isZh ? '【調味盛盤】：出鍋前撒上海鹽與黑胡椒提味，趁熱裝盤享用。' : 'Season with sea salt and pepper, serve warm.' },
      ],
      chef_tips: isZh ? '食材下鍋前務必吸乾水分，能防止油花飛濺並鎖住鮮甜汁水。' : 'Pat ingredients dry before cooking to seal in flavors.',
    });

    plan.push([
      make(shuffledB[day % shuffledB.length], 'breakfast'),
      make(shuffledL[day % shuffledL.length], 'lunch'),
      make(shuffledD[day % shuffledD.length], 'dinner'),
    ]);
  }

  return plan;
}