export function matchCulinaryImage(titleZh: string, titleEn: string, mealType: string): string {
  const text = `${titleZh} ${titleEn}`.toLowerCase();

  // 1. 鱼类与海鲜
  if (/清蒸|鲈鱼|鱸魚|蒸鱼|蒸魚|seabass|steamed.*fish|cod|鳕鱼|鱈魚/.test(text)) {
    return 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=800&auto=format&fit=crop&q=80';
  }
  if (/鲑鱼|鮭魚|三文鱼|三文魚|salmon/.test(text)) {
    return 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80';
  }
  if (/虾|蝦|prawn|shrimp|seafood|海鲜|海鮮/.test(text)) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80';
  }

  // 2. 肉类主菜
  if (/羊|羊排|lamb|chop/.test(text)) {
    return 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&auto=format&fit=crop&q=80';
  }
  if (/牛排|牛肉|牛腩|beef|steak|bourguignon/.test(text)) {
    return 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80';
  }
  if (/鸡|雞|烤鸡|chicken|curry/.test(text)) {
    return 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=800&auto=format&fit=crop&q=80';
  }
  if (/猪|豬|排骨|pork|ribs/.test(text)) {
    return 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80';
  }

  // 3. 面食与主食
  if (/意面|意大利面|pasta|spaghetti|bolognese/.test(text)) {
    return 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=800&auto=format&fit=crop&q=80';
  }
  if (/面|麵|河粉|拉面|拉麵|pho|ramen|noodle/.test(text)) {
    return 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80';
  }
  if (/炖饭|燉飯|炒饭|炒飯|rice|risotto|paella/.test(text)) {
    return 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&auto=format&fit=crop&q=80';
  }

  // 4. 汤品与早餐
  if (/汤|湯|濃湯|soup|stew|broth/.test(text)) {
    return 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80';
  }
  if (/粥|congee|porridge|oatmeal|燕麦|燕麥/.test(text)) {
    return 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=800&auto=format&fit=crop&q=80';
  }
  if (/酸奶|优格|優格|yogurt|parfait/.test(text)) {
    return 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80';
  }
  if (/蛋|吐司|toast|egg|frittata|omelette|bagel|水波蛋|滑蛋/.test(text)) {
    return 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80';
  }
  if (/饺|餃|dumpling/.test(text)) {
    return 'https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80';
  }

  // 兜底图
  if (mealType === 'breakfast') {
    return 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80';
  }
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80';
}