// 100% 人工核对的真实美食摄影高清图库（杜绝任何杂乱非食物图）
export const FOOD_IMAGE_MAP: Record<string, string> = {
  // 早餐
  'avocado': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
  'egg': 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80',
  'yogurt': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80',
  'congee': 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80',
  'oatmeal': 'https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?w=800&auto=format&fit=crop&q=80',
  'dumpling': 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80',
  'bagel': 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80',
  'frittata': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
  'truffle_egg': 'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&auto=format&fit=crop&q=80',

  // 鱼类与海鲜
  'seabass': 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&auto=format&fit=crop&q=80',
  'salmon': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80',
  'cod': 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=800&auto=format&fit=crop&q=80',
  'paella': 'https://images.unsplash.com/photo-1515443961218-a51367888e4b?w=800&auto=format&fit=crop&q=80',
  'prawn': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',

  // 肉类主菜
  'lamb': 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&auto=format&fit=crop&q=80',
  'steak': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
  'beef': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80',
  'chicken': 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&auto=format&fit=crop&q=80',
  'curry': 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&auto=format&fit=crop&q=80',

  // 面食、汤品与饭食
  'pasta': 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80',
  'pho': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80',
  'soup': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80',
  'risotto': 'https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=800&auto=format&fit=crop&q=80',
  'bowl': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
};

export function matchCulinaryImage(titleZh: string, titleEn: string, mealType: string): string {
  const combined = `${titleZh} ${titleEn}`.toLowerCase();

  // 严格按顺序精准匹配
  if (/清蒸|鲈鱼|鱸魚|seabass|steamed fish/.test(combined)) return FOOD_IMAGE_MAP.seabass;
  if (/羊排|羊小排|lamb/.test(combined)) return FOOD_IMAGE_MAP.lamb;
  if (/三文鱼|三文魚|鲑鱼|鮭魚|salmon/.test(combined)) return FOOD_IMAGE_MAP.salmon;
  if (/银鳕鱼|銀鱈魚|真鳕鱼|cod/.test(combined)) return FOOD_IMAGE_MAP.cod;
  if (/海鲜饭|西班牙|paella/.test(combined)) return FOOD_IMAGE_MAP.paella;
  if (/牛排|安格斯|肉眼|steak|ribeye/.test(combined)) return FOOD_IMAGE_MAP.steak;
  if (/牛腩|牛肉|beef|bourguignon/.test(combined)) return FOOD_IMAGE_MAP.beef;
  if (/烤春鸡|烤鸡|鸡腿|鸡胸|chicken/.test(combined)) return FOOD_IMAGE_MAP.chicken;
  if (/青咖哩|咖喱|curry/.test(combined)) return FOOD_IMAGE_MAP.curry;
  if (/意面|意大利面|pasta|spaghetti/.test(combined)) return FOOD_IMAGE_MAP.pasta;
  if (/河粉|pho/.test(combined)) return FOOD_IMAGE_MAP.pho;
  if (/炖饭|risotto/.test(combined)) return FOOD_IMAGE_MAP.risotto;
  if (/浓汤|冬阴功|soup|tom yum/.test(combined)) return FOOD_IMAGE_MAP.soup;
  if (/蒸饺|饺子|dumpling/.test(combined)) return FOOD_IMAGE_MAP.dumpling;
  if (/水波蛋|吐司|toast|avocado/.test(combined)) return FOOD_IMAGE_MAP.avocado;
  if (/白米粥|congee|porridge/.test(combined)) return FOOD_IMAGE_MAP.congee;
  if (/优格|酸奶|yogurt/.test(combined)) return FOOD_IMAGE_MAP.yogurt;
  if (/燕麦|oat/.test(combined)) return FOOD_IMAGE_MAP.oatmeal;

  if (mealType === 'breakfast') return FOOD_IMAGE_MAP.avocado;
  return FOOD_IMAGE_MAP.bowl;
}