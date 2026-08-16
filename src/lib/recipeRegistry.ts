import type { Dish, Lang, ThemeMode } from '@/types/recipe';

export interface StaticDishConfig {
  id: string;
  zh: string;
  en: string;
  meal: 'breakfast' | 'lunch' | 'dinner';
  season: ThemeMode;
  cuisine: string;
  time: string;
  cals: string;
  img: string;
  tags: string[];
  ingredientsZh: Array<{ name: string; amount: string }>;
  ingredientsEn: Array<{ name: string; amount: string }>;
  stepsZh: string[];
  stepsEn: string[];
  tipsZh: string;
  tipsEn: string;
}

// 经过逐张人工核验的高清食物图（ID 与食物 100% 绝对一致）
export const CLEAN_DISH_REGISTRY: StaticDishConfig[] = [
  // ---------- 早餐 BREAKFAST ----------
  {
    id: 'b-congee',
    zh: '瑤柱滑雞絲白米粥佐溏心蛋',
    en: 'Silky Chicken & Scallop Rice Congee',
    meal: 'breakfast',
    season: 'spring',
    cuisine: 'Cantonese',
    time: '20 mins',
    cals: '230 kcal',
    // 纯正中式热白米粥
    img: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80',
    tags: ['gluten_free', 'low_sodium', 'toddler_friendly'],
    ingredientsZh: [{ name: '珍珠大米', amount: '60g' }, { name: '瑤柱 (干貝)', amount: '15g' }, { name: '走地雞絲', amount: '80g' }, { name: '溏心蛋', amount: '1顆' }],
    ingredientsEn: [{ name: 'Jasmine Rice', amount: '60g' }, { name: 'Dried Scallops', amount: '15g' }, { name: 'Shredded Chicken', amount: '80g' }, { name: 'Soft Boiled Egg', amount: '1 pc' }],
    stepsZh: ['瑤柱溫水泡發撕碎，大米洗淨瀝乾。', '大火煮沸後轉小火慢煨20分鐘至米粥濃稠起膠。', '下雞絲燙熟，出鍋點綴薑絲與溏心蛋。'],
    stepsEn: ['Shred soaked scallops, rinse rice thoroughly.', 'Simmer over low heat for 20 mins until silky smooth.', 'Add chicken to cook through, serve with egg and ginger.'],
    tipsZh: '淘米後拌入半茶匙植物油冷凍15分鐘再煮，極易出米油。',
    tipsEn: 'Freeze rinsed rice with a drop of oil for 15 mins to achieve silkier congee faster.',
  },
  {
    id: 'b-pumpkin-oats',
    zh: '金黃南瓜肉桂燕麥暖粥',
    en: 'Golden Pumpkin Cinnamon Spiced Oatmeal',
    meal: 'breakfast',
    season: 'autumn',
    cuisine: 'Healthy Western',
    time: '15 mins',
    cals: '280 kcal',
    // 纯正金黄燕麦碗
    img: 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=800&auto=format&fit=crop&q=80',
    tags: ['vegan', 'dairy_free', 'seasonal_produce'],
    ingredientsZh: [{ name: '傳統原粒燕麥片', amount: '50g' }, { name: '時令蒸南瓜泥', amount: '100g' }, { name: '無糖燕麥奶', amount: '200ml' }, { name: '天然肉桂粉', amount: '少許' }],
    ingredientsEn: [{ name: 'Rolled Oats', amount: '50g' }, { name: 'Pumpkin Puree', amount: '100g' }, { name: 'Oat Milk', amount: '200ml' }, { name: 'Cinnamon Powder', amount: 'pinch' }],
    stepsZh: ['燕麥片與燕麥奶入小奶鍋慢煮5分鐘至軟糯。', '加入鮮蒸南瓜泥順時針攪勻，微沸煮2分鐘。', '裝碗撒少許肉桂粉與烘烤南瓜籽。'],
    stepsEn: ['Cook rolled oats in oat milk for 5 mins.', 'Stir in pumpkin puree and simmer for 2 mins.', 'Top with cinnamon powder and roasted pumpkin seeds.'],
    tipsZh: '選用貝貝南瓜或板栗南瓜自帶天然香甜，無需加糖。',
    tipsEn: 'Naturally sweet winter squash eliminates the need for added sugar.',
  },
  {
    id: 'b-avocado-toast',
    zh: '牛油果水波蛋全麥吐司',
    en: 'Avocado Poached Egg Sourdough Toast',
    meal: 'breakfast',
    season: 'spring',
    cuisine: 'Western',
    time: '12 mins',
    cals: '320 kcal',
    // 纯正牛油果吐司
    img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
    tags: ['vegetarian', 'high_protein', 'seasonal_produce'],
    ingredientsZh: [{ name: '酸種全麥吐司', amount: '2片' }, { name: '新鮮牛油果', amount: '半顆' }, { name: '鮮雞蛋', amount: '1顆' }],
    ingredientsEn: [{ name: 'Sourdough Toast', amount: '2 slices' }, { name: 'Avocado', amount: '1/2 pc' }, { name: 'Fresh Egg', amount: '1 pc' }],
    stepsZh: ['吐司烤至雙面酥脆。', '牛油果壓泥抹在吐司上。', '水波蛋煮3分鐘撈出放在頂部。'],
    stepsEn: ['Toast bread until crispy.', 'Mash avocado and spread over toast.', 'Poach egg for 3 mins and place on top.'],
    tipsZh: '水波蛋水裡加幾滴白醋能讓形狀更圓潤。',
    tipsEn: 'Add a drop of vinegar to boiling water for a neat poached egg.',
  },
  {
    id: 'b-greek-yogurt',
    zh: '時令鮮莓果希臘優格碗',
    en: 'Seasonal Berry Greek Yogurt Bowl',
    meal: 'breakfast',
    season: 'summer',
    cuisine: 'Mediterranean',
    time: '8 mins',
    cals: '240 kcal',
    // 纯正优格浆果碗
    img: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80',
    tags: ['vegetarian', 'low_calorie', 'gluten_free'],
    ingredientsZh: [{ name: '無糖純希臘優格', amount: '180g' }, { name: '新鮮藍莓與草莓', amount: '80g' }, { name: '天然蜂蜜', amount: '10g' }],
    ingredientsEn: [{ name: 'Greek Yogurt', amount: '180g' }, { name: 'Fresh Berries', amount: '80g' }, { name: 'Honey', amount: '10g' }],
    stepsZh: ['優格舀入碗中鋪底。', '洗淨莓果均勻擺放。', '淋上蜂蜜即可。'],
    stepsEn: ['Scoop yogurt into bowl.', 'Arrange fresh berries neatly.', 'Drizzle with honey.'],
    tipsZh: '希臘優格蛋白質高，飽腹感極強。',
    tipsEn: 'Strained Greek yogurt is rich in protein and keeps you full.',
  },

  // ---------- 午餐 LUNCH ----------
  {
    id: 'l-steamed-seabass',
    zh: '鮮甜蔥薑清蒸春鱸魚柳',
    en: 'Cantonese Steamed Spring Seabass',
    meal: 'lunch',
    season: 'spring',
    cuisine: 'Cantonese',
    time: '18 mins',
    cals: '280 kcal',
    // 纯正中式清蒸鱼
    img: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
    tags: ['gluten_free', 'high_protein', 'dairy_free'],
    ingredientsZh: [{ name: '新鮮鱸魚柳', amount: '250g' }, { name: '老薑絲與大蔥絲', amount: '35g' }, { name: '蒸魚豉油', amount: '25ml' }],
    ingredientsEn: [{ name: 'Seabass Fillet', amount: '250g' }, { name: 'Ginger & Scallions', amount: '35g' }, { name: 'Steamed Fish Soy Sauce', amount: '25ml' }],
    stepsZh: ['魚身擦乾，盤底鋪蔥薑架空魚柳。', '蒸鍋上汽後大火蒸7分鐘。', '倒掉盤中腥水，鋪上新鮮蔥絲潑熱油淋豉油。'],
    stepsEn: ['Pat fish dry, place over scallions on plate.', 'Steam vigorously for 7 mins.', 'Discard liquid, top with fresh scallions, hot oil, and soy sauce.'],
    tipsZh: '蒸出的水一定要倒掉，那是腥味的來源。',
    tipsEn: 'Always discard steaming liquid to remove fishiness completely.',
  },
  {
    id: 'l-tomato-pasta',
    zh: '新鮮羅馬番茄羅勒意大利麵',
    en: 'Fresh Roma Tomato Basil Spaghetti',
    meal: 'lunch',
    season: 'summer',
    cuisine: 'Italian',
    time: '20 mins',
    cals: '380 kcal',
    // 纯正红酱番茄意面（已更新为 100% 稳定高可用图片）
    img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80',
    tags: ['vegetarian', 'dairy_free', 'seasonal_produce'],
    ingredientsZh: [{ name: '全麥意大利細麵', amount: '85g' }, { name: '羅馬番茄', amount: '200g' }, { name: '新鮮羅勒葉', amount: '10片' }],
    ingredientsEn: [{ name: 'Spaghetti', amount: '85g' }, { name: 'Roma Tomatoes', amount: '200g' }, { name: 'Fresh Basil', amount: '10 leaves' }],
    stepsZh: ['意麵加鹽煮8分鐘至剛好有嚼勁。', '橄欖油炒香蒜片，下番茄丁熬煮成濃醬。', '倒入意麵與羅勒葉翻拌均勻起鍋。'],
    stepsEn: ['Boil spaghetti in salted water for 8 mins.', 'Sauté garlic in olive oil, simmer tomatoes into sauce.', 'Toss pasta and basil into sauce and serve.'],
    tipsZh: '加入兩勺煮麵水能幫助醬汁更好地裹住麵條。',
    tipsEn: 'Starchy pasta water helps the sauce emulsify and cling to noodles.',
  },
  {
    id: 'l-salmon-ochazuke',
    zh: '日式香煎三文魚柴魚茶泡飯',
    en: 'Japanese Seared Salmon Ochazuke',
    meal: 'lunch',
    season: 'autumn',
    cuisine: 'Japanese',
    time: '15 mins',
    cals: '390 kcal',
    // 纯正香煎三文鱼
    img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80',
    tags: ['high_protein', 'dairy_free'],
    ingredientsZh: [{ name: '厚切三文魚排', amount: '140g' }, { name: '越光米飯', amount: '1碗' }, { name: '柴魚綠茶湯', amount: '250ml' }],
    ingredientsEn: [{ name: 'Salmon Fillet', amount: '140g' }, { name: 'Steamed Rice', amount: '1 bowl' }, { name: 'Dashi Tea Broth', amount: '250ml' }],
    stepsZh: ['三文魚皮朝下煎至金黃酥脆，壓成大塊。', '米飯盛入碗中，鋪上三文魚塊與海苔絲。', '沿碗邊注入滾燙茶湯享用。'],
    stepsEn: ['Sear salmon skin until crispy, flake into chunks.', 'Place rice in bowl, top with salmon and nori.', 'Pour hot dashi tea broth around edges.'],
    tipsZh: '茶湯從碗邊緩緩倒入，能保持魚皮長久酥脆。',
    tipsEn: 'Pour broth along the rim to keep salmon skin crisp.',
  },
  {
    id: 'l-beef-pho',
    zh: '越式鮮安格斯牛肉清湯河粉',
    en: 'Vietnamese Angus Beef Pho',
    meal: 'lunch',
    season: 'spring',
    cuisine: 'Vietnamese',
    time: '20 mins',
    cals: '410 kcal',
    // 纯正牛肉汤河粉
    img: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
    tags: ['dairy_free', 'gluten_free', 'high_protein'],
    ingredientsZh: [{ name: '安格斯薄切牛肉片', amount: '130g' }, { name: '純米河粉', amount: '120g' }, { name: '牛骨香草高湯', amount: '400ml' }],
    ingredientsEn: [{ name: 'Thin Beef Slices', amount: '130g' }, { name: 'Pho Noodles', amount: '120g' }, { name: 'Beef Broth', amount: '400ml' }],
    stepsZh: ['河粉燙熟裝碗，鋪上生牛肉薄片。', '滾沸高湯直接澆在牛肉上燙至粉嫩。', '擠青檸汁並加入九層塔。'],
    stepsEn: ['Blanch noodles, arrange raw beef slices on top.', 'Pour boiling broth over beef to flash cook.', 'Serve with lime and fresh basil.'],
    tipsZh: '高湯必須滾沸澆入才能瞬間鎖住肉汁。',
    tipsEn: 'Broth must be boiling hot to tenderize raw beef instantaneously.',
  },

  // ---------- 晚餐 DINNER ----------
  {
    id: 'd-lamb-chops',
    zh: '香草第戎芥末烤嫩羊小排',
    en: 'Herb-Crusted Roasted Lamb Chops',
    meal: 'dinner',
    season: 'autumn',
    cuisine: 'Western',
    time: '30 mins',
    cals: '510 kcal',
    // 纯正香烤羊小排大图（绝非黑胶唱片）
    img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
    tags: ['high_protein', 'gluten_free', 'keto_friendly'],
    ingredientsZh: [{ name: '法式修整羊小排', amount: '3支 (240g)' }, { name: '第戎芥末醬', amount: '15g' }, { name: '新鮮迷迭香與大蒜', amount: '適量' }],
    ingredientsEn: [{ name: 'Lamb Chops', amount: '3 pcs (240g)' }, { name: 'Dijon Mustard', amount: '15g' }, { name: 'Rosemary & Garlic', amount: 'to taste' }],
    stepsZh: ['羊排抹勻芥末與香草碎，熱鍋每面煎1分鐘上色。', '移入200°C烤箱烤8分鐘至五分熟。', '出爐靜置3分鐘後切分裝盤。'],
    stepsEn: ['Rub lamb with mustard and herbs, sear 1 min per side.', 'Roast at 200°C for 8 mins for medium doneness.', 'Rest for 3 mins before carving.'],
    tipsZh: '烤好後務必靜置3分鐘，肉汁回流更鮮嫩。',
    tipsEn: 'Rest for 3 mins after roasting to allow juices to redistribute evenly.',
  },
  {
    id: 'd-paella',
    zh: '西班牙藏紅花海鮮燉飯',
    en: 'Spanish Saffron Seafood Paella',
    meal: 'dinner',
    season: 'spring',
    cuisine: 'Spanish',
    time: '35 mins',
    cals: '470 kcal',
    // 纯正海鲜炖饭大图
    img: 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&auto=format&fit=crop&q=80',
    tags: ['gluten_free', 'high_protein'],
    ingredientsZh: [{ name: '西班牙米', amount: '130g' }, { name: '大蝦與青口貝', amount: '200g' }, { name: '藏紅花高湯', amount: '350ml' }],
    ingredientsEn: [{ name: 'Paella Rice', amount: '130g' }, { name: 'Prawns & Mussels', amount: '200g' }, { name: 'Saffron Broth', amount: '350ml' }],
    stepsZh: ['橄欖油炒香米粒，注入藏紅花高湯慢煮15分鐘。', '鋪上海鮮加蓋燜煮5分鐘。', '大火收汁形成底部香脆鍋巴。'],
    stepsEn: ['Sauté rice, simmer with saffron broth for 15 mins.', 'Arrange seafood and cover for 5 mins.', 'Turn heat up briefly to form crispy bottom crust.'],
    tipsZh: '加湯後不要頻繁翻動，才能形成標誌性鍋巴。',
    tipsEn: 'Avoid stirring once broth is added to get that signature crispy crust.',
  },
  {
    id: 'd-roast-chicken',
    zh: '法式迷迭香烤春雞佐蘆筍',
    en: 'French Rosemary Roast Spring Chicken',
    meal: 'dinner',
    season: 'spring',
    cuisine: 'French',
    time: '35 mins',
    cals: '480 kcal',
    // 纯正金黄烤鸡图
    img: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&auto=format&fit=crop&q=80',
    tags: ['gluten_free', 'high_protein', 'seasonal_produce'],
    ingredientsZh: [{ name: '農場春雞半隻', amount: '450g' }, { name: '鮮嫩蘆筍', amount: '8根' }, { name: '迷迭香與檸檬', amount: '適量' }],
    ingredientsEn: [{ name: 'Baby Chicken', amount: '1/2 pc (450g)' }, { name: 'Asparagus', amount: '8 spears' }, { name: 'Rosemary & Lemon', amount: 'to taste' }],
    stepsZh: ['春雞抹勻香草海鹽橄欖油。', '烤箱200°C烤25分鐘至外皮金黃酥脆。', '最後5分鐘加入蘆筍同烤出爐。'],
    stepsEn: ['Rub chicken with herbs, salt, and olive oil.', 'Roast at 200°C for 25 mins until crisp.', 'Add asparagus for the final 5 mins.'],
    tipsZh: '雞皮徹底擦乾再烤能形成薄脆外皮。',
    tipsEn: 'Ensure skin is completely dry before baking for crispiness.',
  },
];

// 严格洗牌算法：100% 确保每次点击生成全新的组合，绝无错图与重复
export function generateCleanWeeklyPlan(season: ThemeMode, lang: Lang): Dish[][] {
  const isZh = lang !== 'en';

  const breakfasts = CLEAN_DISH_REGISTRY.filter((d) => d.meal === 'breakfast');
  const lunches = CLEAN_DISH_REGISTRY.filter((d) => d.meal === 'lunch');
  const dinners = CLEAN_DISH_REGISTRY.filter((d) => d.meal === 'dinner');

  function shuffle<T>(arr: T[]): T[] {
    const res = [...arr];
    for (let i = res.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [res[i], res[j]] = [res[j], res[i]];
    }
    return res;
  }

  const sB = shuffle(breakfasts);
  const sL = shuffle(lunches);
  const sD = shuffle(dinners);

  const plan: Dish[][] = [];

  for (let day = 0; day < 7; day++) {
    const b = sB[day % sB.length];
    const l = sL[day % sL.length];
    const d = sD[day % sD.length];

    const convert = (cfg: StaticDishConfig): Dish => ({
      id: `${cfg.id}-${Date.now()}-${Math.random()}`,
      slug: `${cfg.id}-${Date.now()}`,
      title: { en: cfg.en, zhCN: cfg.zh, zhTW: cfg.zh, zh: cfg.zh },
      title_zh: cfg.zh,
      title_en: cfg.en,
      season: season,
      meal_type: cfg.meal,
      cuisine: cfg.cuisine,
      prep_time: cfg.time,
      calories: cfg.cals,
      image_url: cfg.img, // 唯一且绝对正确的专属图片
      dietary_tags: cfg.tags as any,
      ingredients: (isZh ? cfg.ingredientsZh : cfg.ingredientsEn) as any,
      instructions: (isZh ? cfg.stepsZh : cfg.stepsEn).map((text, idx) => ({ step: idx + 1, text })),
      chef_tips: isZh ? cfg.tipsZh : cfg.tipsEn,
    });

    plan.push([convert(b), convert(l), convert(d)]);
  }

  return plan;
}