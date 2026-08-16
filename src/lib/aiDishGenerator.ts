import type { Dish, Lang, RestrictionCode } from '@/types/recipe';
import { CUISINE_OPTIONS } from '@/lib/i18n';
import { ingredientMatchesRestrictions } from '@/lib/restrictions';

interface GenerateParams {
  dishName: string;
  cuisine: string;
  toddlerFriendly: boolean;
  restrictions: Set<RestrictionCode>;
}

const CUISINE_TRANSLATIONS: Record<string, { en: string; zhTW: string; zhCN: string }> = {
  Chinese: { en: 'Chinese', zhTW: '中式', zhCN: '中式' },
  Mediterranean: { en: 'Mediterranean', zhTW: '地中海', zhCN: '地中海' },
  Italian: { en: 'Italian', zhTW: '義式', zhCN: '意式' },
  Korean: { en: 'Korean', zhTW: '韓式', zhCN: '韩式' },
  French: { en: 'French', zhTW: '法式', zhCN: '法式' },
  American: { en: 'American', zhTW: '美式', zhCN: '美式' },
  'Middle Eastern': { en: 'Middle Eastern', zhTW: '中東', zhCN: '中东' },
  Japanese: { en: 'Japanese', zhTW: '日式', zhCN: '日式' },
  Other: { en: 'Home Style', zhTW: '家常', zhCN: '家常' },
};

const CUISINE_PHOTO_QUERIES: Record<string, string> = {
  Chinese: 'chinese home cooking dish',
  Mediterranean: 'mediterranean home cooked meal',
  Italian: 'italian home cooked pasta dish',
  Korean: 'korean home cooked meal',
  French: 'french home cooked bistro dish',
  American: 'american home cooked comfort food',
  'Middle Eastern': 'middle eastern home cooked dish',
  Japanese: 'japanese home cooked meal',
  Other: 'home cooked meal plate',
};

const STOCK_PHOTOS = [
  'https://images.pexels.com/photos/3026808/pexels-photo-3026808.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/1546093/pexels-photo-1546093.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  'https://images.pexels.com/photos/699953/pexels-photo-699953.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
];

function translateDishName(name: string): { en: string; zhTW: string; zhCN: string } {
  const knownTranslations: Record<string, { en: string; zhTW: string; zhCN: string }> = {
    'tomato scrambled eggs': { en: 'Tomato Scrambled Eggs', zhTW: '番茄炒蛋', zhCN: '番茄炒蛋' },
    'mapo tofu': { en: 'Mapo Tofu', zhTW: '麻婆豆腐', zhCN: '麻婆豆腐' },
    'fried rice': { en: 'Egg Fried Rice', zhTW: '蛋炒飯', zhCN: '蛋炒饭' },
    'beef noodle soup': { en: 'Beef Noodle Soup', zhTW: '牛肉麵', zhCN: '牛肉面' },
    'pesto pasta': { en: 'Pesto Pasta', zhTW: '青醬義大利麵', zhCN: '青酱意面' },
    'chicken curry': { en: 'Chicken Curry', zhTW: '雞肉咖哩', zhCN: '鸡肉咖喱' },
    'caesar salad': { en: 'Caesar Salad', zhTW: '凱薩沙拉', zhCN: '凯撒沙拉' },
    'miso soup': { en: 'Miso Soup', zhTW: '味噌湯', zhCN: '味噌汤' },
    'spring rolls': { en: 'Fresh Spring Rolls', zhTW: '生春捲', zhCN: '生春卷' },
    'dumplings': { en: 'Homemade Dumplings', zhTW: '手工水餃', zhCN: '手工水饺' },
  };

  const lower = name.toLowerCase().trim();
  const match = knownTranslations[lower];
  if (match) return match;

  return { en: name, zhTW: name, zhCN: name };
}

function generateDescription(name: string, cuisine: string, toddler: boolean): { en: string; zhTW: string; zhCN: string } {
  const cuisineTr = CUISINE_TRANSLATIONS[cuisine] ?? CUISINE_TRANSLATIONS.Other;
  if (toddler) {
    return {
      en: `A mild, soft ${cuisineTr.en.toLowerCase()} dish — perfect for little ones.`,
      zhTW: `一道溫和軟嫩的${cuisineTr.zhTW}菜色，適合幼兒。`,
      zhCN: `一道温和软嫩的${cuisineTr.zhCN}菜色，适合幼儿。`,
    };
  }
  return {
    en: `A delicious ${cuisineTr.en.toLowerCase()} home-cooked dish, made fresh with seasonal ingredients.`,
    zhTW: `美味的${cuisineTr.zhTW}家常菜色，以時令食材新鮮製作。`,
    zhCN: `美味的${cuisineTr.zhCN}家常菜色，以时令食材新鲜制作。`,
  };
}

function generateIngredients(
  name: string,
  toddler: boolean,
  restrictions: Set<RestrictionCode>,
): { amount_g: number; name: { en: string; zhTW: string; zhCN: string } }[] {
  const all: { amount_g: number; name: { en: string; zhTW: string; zhCN: string } }[] = [
    { amount_g: 150, name: { en: 'Main Ingredient', zhTW: '主食材', zhCN: '主食材' } },
    { amount_g: 50, name: { en: 'Seasonal Vegetables', zhTW: '時令蔬菜', zhCN: '时令蔬菜' } },
    { amount_g: 30, name: { en: 'Aromatics', zhTW: '香料', zhCN: '香料' } },
    { amount_g: 10, name: { en: 'Cooking Oil', zhTW: '食用油', zhCN: '食用油' } },
    { amount_g: 3, name: { en: 'Sea Salt', zhTW: '海鹽', zhCN: '海盐' } },
  ];

  if (!toddler && ingredientMatchesRestrictions({ en: 'Soy Sauce', zhTW: '醬油', zhCN: '酱油' }, restrictions)) {
    all.push({ amount_g: 5, name: { en: 'Soy Sauce', zhTW: '醬油', zhCN: '酱油' } });
  }

  return all.filter((ing) => ingredientMatchesRestrictions(ing.name, restrictions));
}

function generateSteps(toddler: boolean, lang: Lang): { en: string; zhTW: string; zhCN: string }[] {
  if (toddler) {
    return [
      { en: 'Wash and prepare all ingredients, cutting into small soft pieces.', zhTW: '洗淨所有食材，切成小塊軟嫩尺寸。', zhCN: '洗净所有食材，切成小块软嫩尺寸。' },
      { en: 'Heat oil in a pan over low heat.', zhTW: '平底鍋小火熱油。', zhCN: '平底锅小火热油。' },
      { en: 'Cook ingredients gently until very soft, about 8 minutes.', zhTW: '小火慢煮約8分鐘至非常軟爛。', zhCN: '小火慢煮约8分钟至非常软烂。' },
      { en: 'Season with a tiny pinch of salt — no strong spices.', zhTW: '加少許鹽調味，不加強烈香料。', zhCN: '加少许盐调味，不加强烈香料。' },
      { en: 'Serve warm at a child-safe temperature.', zhTW: '放涼至適當溫度後享用。', zhCN: '放凉至适当温度后享用。' },
    ];
  }
  return [
    { en: 'Wash and prepare all ingredients.', zhTW: '洗淨並準備所有食材。', zhCN: '洗净并准备所有食材。' },
    { en: 'Heat oil in a pan over medium heat.', zhTW: '平底鍋中火熱油。', zhCN: '平底锅中火热油。' },
    { en: 'Add aromatics and sauté until fragrant, about 1 minute.', zhTW: '加入香料炒香約1分鐘。', zhCN: '加入香料炒香约1分钟。' },
    { en: 'Add main ingredients and cook through, about 5-7 minutes.', zhTW: '加入主食材炒熟約5-7分鐘。', zhCN: '加入主食材炒熟约5-7分钟。' },
    { en: 'Season with salt and soy sauce, toss well, and serve hot.', zhTW: '加鹽與醬油調味翻炒均勻，趁熱享用。', zhCN: '加盐与酱油调味翻炒均匀，趁热享用。' },
  ];
}

let slugCounter = 0;

export function generateAIDish(params: GenerateParams, lang: Lang): Dish {
  const { dishName, cuisine, toddlerFriendly, restrictions } = params;
  const name = translateDishName(dishName);
  const description = generateDescription(dishName, cuisine, toddlerFriendly);
  const ingredients = generateIngredients(dishName, toddlerFriendly, restrictions);
  const steps = generateSteps(toddlerFriendly, lang);

  const photoQuery = CUISINE_PHOTO_QUERIES[cuisine] ?? CUISINE_PHOTO_QUERIES.Other;
  void photoQuery;
  const photo = STOCK_PHOTOS[Math.floor(Math.random() * STOCK_PHOTOS.length)];

  slugCounter++;
  const slug = `ai-custom-${Date.now()}-${slugCounter}`;

  return {
    id: slug,
    slug,
    season: 'spring',
    meal_type: 'dinner',
    cuisine,
    dietary_tags: toddlerFriendly ? ['toddler_friendly', 'low_sodium'] : ['seasonal_produce'],
    photo_url: photo,
    prep_time_min: toddlerFriendly ? 15 : 20,
    name,
    description,
    ingredients,
    steps,
    created_at: new Date().toISOString(),
  };
}

export { CUISINE_OPTIONS };
