import type { Dish, RestrictionCode } from '@/types/recipe';

export const RESTRICTION_LIST: RestrictionCode[] = [
  'shellfish_free',
  'fish_free',
  'gluten_free',
  'dairy_free',
  'peanut_free',
  'tree_nut_free',
  'soy_free',
  'egg_free',
  'sesame_free',
  'mustard_free',
  'sulfite_free',
  'nightshade_free',
];

const ALLERGEN_KEYWORDS: Record<RestrictionCode, string[]> = {
  shellfish_free: [
    'shrimp', 'prawn', 'crab', 'lobster', 'crayfish', 'oyster', 'clam', 'mussel', 'scallop',
    '蝦', '蟹', '蠔', '牡蠣', '蛤', '蜆', '干貝', '虾', '蚝', '蛤',
  ],
  fish_free: [
    'fish', 'salmon', 'tuna', 'cod', 'mackerel', 'sardine', 'anchovy', 'trout', 'tilapia',
    '魚', '鮭', '鮪', '鱈', '鯖', '沙丁', '鳳尾魚', '鱒', '鱼', '鲑', '吞拿',
  ],
  gluten_free: [
    'wheat', 'flour', 'bread', 'pasta', 'noodle', 'barley', 'rye', 'spelt', 'couscous', 'bulgur',
    'soy sauce', '麥', '麵粉', '麵', '麵包', '義大利麵', '大麥', '黑麥', '醬油',
    '麦', '面粉', '面', '面包', '意面', '大麦', '黑麦', '酱油',
  ],
  dairy_free: [
    'milk', 'cheese', 'butter', 'cream', 'yogurt', 'yoghurt', 'whey', 'casein', 'lactose',
    '牛奶', '乳酪', '起司', '奶油', '鮮奶油', '優格', '起司', '牛乳', '芝士',
    '酸奶', '黄油', '鲜奶油',
  ],
  peanut_free: [
    'peanut', 'groundnut',
    '花生',
  ],
  tree_nut_free: [
    'almond', 'walnut', 'cashew', 'pecan', 'hazelnut', 'pistachio', 'macadamia', 'brazil nut',
    '杏仁', '核桃', '腰果', '夏威夷果', '開心果', '榛果',
    '杏仁', '核桃', '腰果', '开心果', '榛果',
  ],
  soy_free: [
    'soy', 'soya', 'tofu', 'edamame', 'tempeh', 'miso', 'soybean',
    '大豆', '黃豆', '豆腐', '毛豆', '味噌', '豆漿', '豆干',
    '大豆', '黄豆', '豆腐', '毛豆', '味噌', '豆浆',
  ],
  egg_free: [
    'egg', 'egg white', 'egg yolk', 'mayonnaise', 'meringue',
    '蛋', '雞蛋', '蛋白', '蛋黃', '美乃滋', '蛋黄', '鸡蛋',
  ],
  sesame_free: [
    'sesame', 'sesame oil', 'tahini', 'sesame seed',
    '芝麻', '芝麻油', '麻醬',
  ],
  mustard_free: [
    'mustard', 'mustard seed', 'mustard oil', 'dijon',
    '芥末', '芥末醬', '芥菜',
  ],
  sulfite_free: [
    'sulfite', 'sulphite', 'sulfur dioxide', 'sodium metabisulfite', 'wine', 'dried fruit',
    '亞硫酸', '二氧化硫', '酒', '乾果', '亚硫酸', '干果',
  ],
  nightshade_free: [
    'tomato', 'potato', 'eggplant', 'pepper', 'bell pepper', 'chili', 'paprika', 'capsicum',
    '番茄', '馬鈴薯', '茄子', '甜椒', '辣椒', '土豆', '番茄', '辣椒',
  ],
};

export function dishMatchesRestrictions(
  dish: Dish,
  restrictions: Set<RestrictionCode>,
): boolean {
  if (restrictions.size === 0) return true;

  const ingredientText = dish.ingredients
    .map((ing) => `${ing.name.en} ${ing.name.zhTW} ${ing.name.zhCN}`)
    .join(' ')
    .toLowerCase();

  for (const code of restrictions) {
    const keywords = ALLERGEN_KEYWORDS[code];
    for (const kw of keywords) {
      if (ingredientText.includes(kw.toLowerCase())) {
        return false;
      }
    }
  }

  return true;
}

export function ingredientMatchesRestrictions(
  ingredientName: { en: string; zhTW: string; zhCN: string },
  restrictions: Set<RestrictionCode>,
): boolean {
  if (restrictions.size === 0) return true;

  const text = `${ingredientName.en} ${ingredientName.zhTW} ${ingredientName.zhCN}`.toLowerCase();

  for (const code of restrictions) {
    const keywords = ALLERGEN_KEYWORDS[code];
    for (const kw of keywords) {
      if (text.includes(kw.toLowerCase())) {
        return false;
      }
    }
  }

  return true;
}
