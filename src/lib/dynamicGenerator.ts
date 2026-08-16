import type { Dish, Lang, RestrictionCode, ThemeMode } from '@/types/recipe';
import { matchCulinaryImage } from './imageLibrary';

export async function generateSeasonalWeeklyPlan(
  season: ThemeMode,
  lang: Lang,
  restrictions: Set<RestrictionCode>
): Promise<Dish[][]> {
  const isZh = lang !== 'en';
  const restrictionArray = Array.from(restrictions);

  try {
    const response = await fetch('/api/generate-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ season, lang, restrictions: restrictionArray }),
    });

    if (response.ok) {
      const result = await response.json();
      const list = result.dishes;

      if (Array.isArray(list) && list.length >= 21) {
        const formatted: Dish[] = list.map((item, idx) => {
          const tZh = item.title_zh || '時令佳餚';
          const tEn = item.title_en || 'Seasonal Dish';
          const mType = item.meal_type || (idx % 3 === 0 ? 'breakfast' : idx % 3 === 1 ? 'lunch' : 'dinner');
          const mainIng = item.main_ingredient || (isZh ? '時令主料' : 'Prime Ingredient');

          return {
            id: `dish-ai-${Date.now()}-${idx}`,
            slug: `seasonal-${season}-${idx}-${Date.now()}`,
            title: { en: tEn, zhCN: tZh, zhTW: tZh, zh: tZh },
            title_zh: tZh,
            title_en: tEn,
            season,
            meal_type: mType,
            cuisine: item.cuisine || (mType === 'breakfast' ? 'Light Gourmet' : 'Home Style'),
            prep_time: item.prep_time || '20 mins',
            calories: item.calories || '360 kcal',
            image_url: matchCulinaryImage(tZh, tEn, mType),
            dietary_tags: ['seasonal_produce'],
            ingredients: [
              { name: isZh ? `${mainIng}` : `${mainIng}`, amount: '220g' },
              { name: isZh ? '當季時蔬配菜' : 'Seasonal Fresh Vegetables', amount: '100g' },
              { name: isZh ? '特級初榨橄欖油 / 烹調油' : 'Olive Oil / Cooking Oil', amount: '1.5湯匙 (20ml)' },
              { name: isZh ? '天然海鹽與現磨黑胡椒' : 'Sea Salt & Crushed Pepper', amount: isZh ? '海鹽1茶匙(4g), 胡椒少許' : '1 tsp Sea Salt, pinch of pepper' },
            ],
            instructions: [
              { step: 1, text: isZh ? `【食材預備】：將 ${tZh} 所需的主料與配菜洗淨，徹底擦乾水分，分切成均勻適口形狀。` : `Clean and thoroughly pat dry ${tEn} ingredients. Cut uniformly.` },
              { step: 2, text: isZh ? '【熱鍋溫油】：平底鍋開中火預熱 1 分鐘，倒入食用油潤鍋，油溫微熱時下入主食材。' : 'Preheat skillet over medium heat for 1 min, add oil and begin searing main ingredients.' },
              { step: 3, text: isZh ? '【精準烹調】：主料煎炒至表面金黃鎖汁，加入當季配菜一同翻炒 2~3 分鐘至斷生。' : 'Cook until browned and tender, adding seasonal sides to toss for 2-3 mins.' },
              { step: 4, text: isZh ? '【調味盛盤】：出鍋前均勻撒上海鹽與現磨黑胡椒，關火靜置 1 分鐘後裝盤溫熱享用。' : 'Season evenly with sea salt and black pepper, rest 1 min and serve warm.' },
            ],
            chef_tips: isZh ? '主廚技巧：食材下鍋前務必徹底擦乾水分，防止油花飛濺並迅速鎖住食材的天然汁水。' : 'Chef Tip: Pat ingredients completely dry before cooking to seal in flavors and avoid oil splattering.',
          };
        });

        const plan: Dish[][] = [];
        for (let d = 0; d < 7; d++) {
          plan.push([formatted[d * 3], formatted[d * 3 + 1], formatted[d * 3 + 2]]);
        }
        return plan;
      }
    }
  } catch (e) {
    console.warn('API error, smoothly using instant seasonal plan:', e);
  }

  // 兜底保障
  return getInstantSeasonalPlan(season, lang);
}

function getInstantSeasonalPlan(season: ThemeMode, lang: Lang): Dish[][] {
  const isZh = lang !== 'en';
  const bList = ['牛油果水波蛋全麥吐司', '翡翠薺菜鮮蝦滑蛋卷', '時令草莓希臘優格碗', '菠菜乳清芝士帕尼尼', '低卡奇亞籽野莓燕麥杯', '滑嫩白米瑤柱粥佐溏心蛋', '田園嫩蘆筍烘蛋餅'];
  const bEn = ['Avocado Poached Egg Toast', 'Spring Prawn Omelette', 'Strawberry Greek Yogurt Bowl', 'Spinach Ricotta Panini', 'Chia Berry Overnight Oats', 'Silky Scallop Congee with Egg', 'Garden Asparagus Frittata'];

  const lList = ['鮮甜蔥薑清蒸春鱸魚', '嫩蘆筍鮮蝦全麥意大利麵', '春筍黑椒安格斯牛柳粒', '越式鮮牛肉清湯河粉', '地中海烤三文魚藜麥暖碗', '日式鮮鯛魚高湯茶泡飯', '嫩菠菜炙烤香草雞胸溫沙拉'];
  const lEn = ['Cantonese Steamed Seabass', 'Asparagus & Prawn Spaghetti', 'Bamboo Black Pepper Beef', 'Vietnamese Beef Pho', 'Mediterranean Salmon Quinoa Bowl', 'Japanese Sea Bream Ochazuke', 'Grilled Herb Chicken Salad'];

  const dList = ['法式迷迭香烤春雞佐蘆筍', '西班牙藏紅花海鮮燉飯', '香煎安格斯肉眼牛排佐蘆筍', '清蒸大西洋真鱈魚柳', '泰式香茅大蝦冬陰功湯', '意式香草烤嫩羊小排', '香煎三文魚佐黑松露時蔬'];
  const dEn = ['Rosemary Roast Chicken', 'Spanish Saffron Seafood Paella', 'Angus Ribeye with Asparagus', 'Steamed Atlantic Cod Fillet', 'Tom Yum Prawn Soup', 'Italian Herb Roasted Lamb Chops', 'Salmon with Black Truffle Greens'];

  const plan: Dish[][] = [];
  for (let day = 0; day < 7; day++) {
    const make = (titleZh: string, titleEn: string, mType: 'breakfast' | 'lunch' | 'dinner'): Dish => ({
      id: `dish-instant-${season}-${mType}-${day}-${Date.now()}`,
      slug: `seasonal-${season}-${mType}-${day}`,
      title: { en: titleEn, zhCN: titleZh, zhTW: titleZh, zh: titleZh },
      title_zh: titleZh,
      title_en: titleEn,
      season,
      meal_type: mType,
      cuisine: mType === 'breakfast' ? 'Western Healthy' : 'Michelin Home Style',
      prep_time: '20 mins',
      calories: '380 kcal',
      image_url: matchCulinaryImage(titleZh, titleEn, mType),
      dietary_tags: ['seasonal_produce'],
      ingredients: [
        { name: isZh ? `${titleZh} 主料` : `${titleEn} Prime Ingredient`, amount: '220g' },
        { name: isZh ? '當季新鮮配菜' : 'Seasonal Vegetables', amount: '100g' },
        { name: isZh ? '特級橄欖油 / 烹調油' : 'Cooking Oil', amount: '1.5湯匙 (20ml)' },
        { name: isZh ? '天然海鹽與現磨黑胡椒' : 'Sea Salt & Pepper', amount: '鹽1茶匙(4g), 胡椒少許' },
      ],
      instructions: [
        { step: 1, text: isZh ? `【食材預備】：將 ${titleZh} 的主料與配菜洗淨並擦乾水分。` : `Clean and pat dry all ingredients for ${titleEn}.` },
        { step: 2, text: isZh ? '【熱鍋溫油】：平底鍋開中小火預熱 1 分鐘，下油潤鍋。' : 'Preheat skillet over medium heat for 1 min with oil.' },
        { step: 3, text: isZh ? '【精準烹調】：主料煎炒至變色熟透，加入配菜翻炒 2~3 分鐘。' : 'Cook main ingredients until browned, toss with vegetables for 2-3 mins.' },
        { step: 4, text: isZh ? '【調味盛盤】：出鍋前撒上海鹽與黑胡椒提味，趁熱裝盤享用。' : 'Season with sea salt and black pepper, serve warmly.' },
      ],
      chef_tips: isZh ? '食材下鍋前務必吸乾水分，能防止油花飛濺並鎖住鮮甜汁水。' : 'Always pat ingredients completely dry before cooking to seal in flavors.',
    });

    plan.push([
      make(bList[day], bEn[day], 'breakfast'),
      make(lList[day], lEn[day], 'lunch'),
      make(dList[day], dEn[day], 'dinner'),
    ]);
  }
  return plan;
}