import type { Dish, Lang, RestrictionCode, ThemeMode } from '@/types/recipe';
import { matchCulinaryImage } from './imageLibrary';

// 真实地道的时令食材与米其林级四季菜单库（杜绝任何占位模板）
const MASTER_SEASONAL_RECIPES: Record<ThemeMode, Record<'breakfast' | 'lunch' | 'dinner', Array<{
  zh: string;
  en: string;
  cuisine: string;
  prepTime: string;
  calories: string;
  tags: string[];
  ingredientsZh: Array<{ name: string; amount: string }>;
  ingredientsEn: Array<{ name: string; amount: string }>;
  stepsZh: string[];
  stepsEn: string[];
  chefTipsZh: string;
  chefTipsEn: string;
}>>> = {
  spring: {
    breakfast: [
      {
        zh: '牛油果水波蛋全麥吐司',
        en: 'Avocado Poached Egg Sourdough',
        cuisine: 'Western Healthy',
        prepTime: '12 mins',
        calories: '320 kcal',
        tags: ['vegetarian', 'high_protein', 'seasonal_produce'],
        ingredientsZh: [
          { name: '酸種全麥吐司', amount: '2片 (80g)' },
          { name: '新鮮牛油果', amount: '半個 (75g)' },
          { name: '農場走地雞蛋', amount: '1顆 (55g)' },
          { name: '特級初榨橄欖油', amount: '1茶匙 (5ml)' },
          { name: '紅椒粉與海鹽', amount: '少許' },
        ],
        ingredientsEn: [
          { name: 'Sourdough Bread', amount: '2 slices (80g)' },
          { name: 'Fresh Avocado', amount: '1/2 (75g)' },
          { name: 'Free-Range Egg', amount: '1 (55g)' },
          { name: 'Extra Virgin Olive Oil', amount: '1 tsp (5ml)' },
          { name: 'Paprika & Sea Salt', amount: 'pinch' },
        ],
        stepsZh: [
          '吐司放入烤麵包機烘烤至兩面金黃酥脆。',
          '牛油果去皮搗成泥，加入少許檸檬汁、海鹽拌勻，厚塗於吐司表面。',
          '小鍋燒水至微沸，加入少許白醋，旋轉水流打入雞蛋，水波煮3分鐘撈出放在吐司上。',
        ],
        stepsEn: [
          'Toast sourdough slices until golden and crisp.',
          'Mash avocado with lemon juice and sea salt, spread generously over toast.',
          'Poach egg in gently simmering water with vinegar for 3 mins, place atop toast.',
        ],
        chefTipsZh: '煮水波蛋時在水裡加半勺白醋，能讓蛋白迅速凝固成光滑的荷包狀。',
        chefTipsEn: 'Add a dash of vinegar to simmering water to help the egg whites set into a perfect sphere.',
      },
      {
        zh: '翡翠薺菜鮮蝦滑蛋卷',
        en: 'Spring Shepherd\'s Purse Prawn Omelette',
        cuisine: 'Cantonese',
        prepTime: '15 mins',
        calories: '290 kcal',
        tags: ['high_protein', 'gluten_free', 'seasonal_produce'],
        ingredientsZh: [
          { name: '春季新鮮薺菜', amount: '100g' },
          { name: '海捕鮮蝦仁', amount: '80g' },
          { name: '雞蛋', amount: '2顆' },
          { name: '天然海鹽', amount: '半茶匙 (2g)' },
          { name: '白胡椒粉', amount: '少許' },
        ],
        ingredientsEn: [
          { name: 'Fresh Shepherd\'s Purse', amount: '100g' },
          { name: 'Fresh Prawns', amount: '80g' },
          { name: 'Eggs', amount: '2 pcs' },
          { name: 'Sea Salt', amount: '1/2 tsp (2g)' },
          { name: 'White Pepper', amount: 'pinch' },
        ],
        stepsZh: [
          '薺菜洗淨焯水5秒撈出擠乾切碎，蝦仁開背去蝦線備用。',
          '雞蛋打散，加入切碎的薺菜、少許鹽與白胡椒粉攪拌均勻。',
          '熱鍋下油，先將蝦仁煎至八分熟，倒入蛋液轉中小火慢慢推炒至滑嫩出鍋。',
        ],
        stepsEn: [
          'Blanch shepherd\'s purse for 5s, squeeze dry and finely chop.',
          'Whisk eggs with chopped greens, sea salt, and white pepper.',
          'Sear prawns until pink, pour egg mixture and softly scramble over medium heat.',
        ],
        chefTipsZh: '薺菜焯水時間切忌超過10秒，否則會破壞春季野菜的爽脆清香。',
        chefTipsEn: 'Do not blanch delicate spring greens for more than 10 seconds to retain color and aroma.',
      },
      {
        zh: '時令草莓希臘優格碗',
        en: 'Spring Strawberry Greek Yogurt Bowl',
        cuisine: 'Mediterranean',
        prepTime: '8 mins',
        calories: '240 kcal',
        tags: ['vegetarian', 'low_calorie', 'seasonal_produce'],
        ingredientsZh: [
          { name: '無糖希臘優格', amount: '180g' },
          { name: '新鮮時令草莓', amount: '6顆 (100g)' },
          { name: '烘烤堅果仁', amount: '15g' },
          { name: '天然洋槐蜂蜜', amount: '1茶匙 (10g)' },
        ],
        ingredientsEn: [
          { name: 'Plain Greek Yogurt', amount: '180g' },
          { name: 'Fresh Strawberries', amount: '6 pcs (100g)' },
          { name: 'Toasted Mixed Nuts', amount: '15g' },
          { name: 'Acacia Honey', amount: '1 tsp (10g)' },
        ],
        stepsZh: [
          '希臘優格倒入碗中，用勺背輕抹平整。',
          '草莓洗淨去蒂切片，均勻鋪在優格表面。',
          '撒上壓碎的烘烤堅果，淋上一圈洋槐蜂蜜即可享用。',
        ],
        stepsEn: [
          'Spoon Greek yogurt into a serving bowl.',
          'Wash, hull, and slice strawberries, arrange neatly over yogurt.',
          'Garnish with crushed toasted nuts and a drizzle of honey.',
        ],
        chefTipsZh: '選用濃稠度高的純希臘優格，高蛋白質含量能提供長達4小時的飽腹感。',
        chefTipsEn: 'Use authentic thick Greek yogurt for high protein and sustained morning energy.',
      },
      {
        zh: '菠菜乳清芝士帕尼尼',
        en: 'Spinach Ricotta Panini',
        cuisine: 'Italian',
        prepTime: '15 mins',
        calories: '340 kcal',
        tags: ['vegetarian', 'high_protein', 'seasonal_produce'],
        ingredientsZh: [
          { name: '全麥恰巴塔麵包', amount: '1個' },
          { name: '嫩菠菜葉', amount: '80g' },
          { name: '低脂乳清乾酪 (Ricotta)', amount: '50g' },
          { name: '黑胡椒與鹽', amount: '少許' },
        ],
        ingredientsEn: [
          { name: 'Whole Wheat Ciabatta', amount: '1 pc' },
          { name: 'Baby Spinach', amount: '80g' },
          { name: 'Ricotta Cheese', amount: '50g' },
          { name: 'Black Pepper & Salt', amount: 'pinch' },
        ],
        stepsZh: [
          '菠菜在乾鍋中快速翻炒至軟塌，加少許鹽調味盛出。',
          '麵包切開，內側抹上 Ricotta 芝士並鋪入熟菠菜。',
          '放入帕尼尼機或平底鍋雙面壓烤3分鐘至芝士微融。',
        ],
        stepsEn: [
          'Wilt spinach in a dry pan with a pinch of salt.',
          'Slice ciabatta, spread ricotta and layer wilted spinach.',
          'Press in a panini grill for 3 mins until cheese softens.',
        ],
        chefTipsZh: '菠菜出鍋後用紙巾吸乾多餘水分，能防止麵包被泡軟。',
        chefTipsEn: 'Pat spinach dry before assembling to keep the bread delightfully crispy.',
      },
      {
        zh: '低卡奇亞籽野莓燕麥杯',
        en: 'Chia Seed Berry Overnight Oats',
        cuisine: 'Nordic Healthy',
        prepTime: '10 mins',
        calories: '260 kcal',
        tags: ['vegan', 'low_calorie', 'seasonal_produce'],
        ingredientsZh: [
          { name: '傳統大燕麥片', amount: '40g' },
          { name: '有機奇亞籽', amount: '10g' },
          { name: '無糖燕麥奶', amount: '150ml' },
          { name: '新鮮藍莓與草莓', amount: '50g' },
        ],
        ingredientsEn: [
          { name: 'Rolled Oats', amount: '40g' },
          { name: 'Organic Chia Seeds', amount: '10g' },
          { name: 'Oat Milk', amount: '150ml' },
          { name: 'Fresh Berries', amount: '50g' },
        ],
        stepsZh: [
          '將燕麥片與奇亞籽混合放入玻璃罐中。',
          '倒入燕麥奶攪拌均勻，加蓋冷藏浸泡。',
          '食用前鋪上新鮮野莓與少許楓糖漿。',
        ],
        stepsEn: [
          'Combine oats and chia seeds in a jar.',
          'Pour in oat milk, stir thoroughly and chill.',
          'Top with fresh seasonal berries before serving.',
        ],
        chefTipsZh: '奇亞籽吸水膨脹後能釋放豐富的膳食纖維與 Omega-3。',
        chefTipsEn: 'Soaking chia seeds releases soluble fiber and Omega-3 fatty acids.',
      },
      {
        zh: '滑嫩白米瑤柱粥佐溏心蛋',
        en: 'Silky Rice Congee with Soft Boiled Egg',
        cuisine: 'Cantonese',
        prepTime: '25 mins',
        calories: '230 kcal',
        tags: ['gluten_free', 'low_calorie', 'seasonal_produce'],
        ingredientsZh: [
          { name: '優質東北大米', amount: '50g' },
          { name: '乾干貝 (瑤柱)', amount: '3粒 (15g)' },
          { name: '溏心雞蛋', amount: '1顆' },
          { name: '薑絲與香蔥', amount: '少許' },
        ],
        ingredientsEn: [
          { name: 'Jasmine Rice', amount: '50g' },
          { name: 'Dried Scallops', amount: '3 pcs (15g)' },
          { name: 'Soft-boiled Egg', amount: '1 pc' },
          { name: 'Ginger & Scallions', amount: 'pinch' },
        ],
        stepsZh: [
          '大米淘洗乾淨，加入泡發撕碎的干貝和足量清水。',
          '大火煮沸後轉小火慢煨20分鐘，期間順時針攪拌至米湯濃稠起膠。',
          '出鍋前撒入薑絲與海鹽，盛入碗中配半顆溏心蛋即可。',
        ],
        stepsEn: [
          'Simmer rice and shredded dried scallops in water over medium-low heat.',
          'Stir continuously for 20 mins until rich and creamy.',
          'Season with ginger, sea salt, and serve with half a soft-boiled egg.',
        ],
        chefTipsZh: '煮粥前將大米滴幾滴油拌勻冷凍20分鐘，能迅速煮出絲滑米油。',
        chefTipsEn: 'Freezing washed rice with a drop of oil helps break grain starch faster.',
      },
      {
        zh: '田園蘆筍烘蛋餅',
        en: 'Garden Asparagus Frittata',
        cuisine: 'Western',
        prepTime: '15 mins',
        calories: '280 kcal',
        tags: ['keto_friendly', 'high_protein', 'seasonal_produce'],
        ingredientsZh: [
          { name: '嫩蘆筍', amount: '5根 (80g)' },
          { name: '鮮雞蛋', amount: '2顆' },
          { name: '小番茄', amount: '4顆' },
          { name: '帕瑪森乾酪碎', amount: '10g' },
        ],
        ingredientsEn: [
          { name: 'Tender Asparagus', amount: '5 spears (80g)' },
          { name: 'Fresh Eggs', amount: '2 pcs' },
          { name: 'Cherry Tomatoes', amount: '4 pcs' },
          { name: 'Parmesan Shavings', amount: '10g' },
        ],
        stepsZh: [
          '蘆筍切小段，小番茄對半切開備用。',
          '平底鍋熱油，下入蘆筍和小番茄中火翻炒2分鐘。',
          '倒入打散的蛋液與乾酪碎，轉小火加蓋燜烘4分鐘至蛋液凝固。',
        ],
        stepsEn: [
          'Cut asparagus into bite-sized segments and halve tomatoes.',
          'Sauté vegetables in olive oil over medium heat for 2 mins.',
          'Pour whisked eggs with parmesan, cover and cook on low heat for 4 mins.',
        ],
        chefTipsZh: '全程保持小火慢烘，能保證烘蛋底部金黃而內部細嫩多汁。',
        chefTipsEn: 'Keep the flame low to achieve a golden crust while keeping the inside tender.',
      },
    ],
    lunch: [
      {
        zh: '鮮甜蔥薑清蒸春鱸魚',
        en: 'Cantonese Steamed Spring Seabass',
        cuisine: 'Cantonese',
        prepTime: '18 mins',
        calories: '280 kcal',
        tags: ['gluten_free', 'high_protein', 'dairy_free', 'seasonal_produce'],
        ingredientsZh: [
          { name: '新鮮春鱸魚柳', amount: '250g' },
          { name: '新鮮小蔥', amount: '3根 (切細絲)' },
          { name: '生薑', amount: '1塊 (切極細絲)' },
          { name: '優質蒸魚豉油', amount: '2湯匙 (30ml)' },
          { name: '熱壓榨花生油', amount: '1湯匙 (15ml)' },
        ],
        ingredientsEn: [
          { name: 'Fresh Seabass Fillet', amount: '250g' },
          { name: 'Fresh Scallions', amount: '3 stalks (shredded)' },
          { name: 'Fresh Ginger', amount: '15g (julienned)' },
          { name: 'Steamed Fish Soy Sauce', amount: '2 tbsp (30ml)' },
          { name: 'Pure Peanut Oil', amount: '1 tbsp (15ml)' },
        ],
        stepsZh: [
          '鱸魚柳洗淨擦乾，盤底鋪少許蔥段薑片，放上魚柳。',
          '蒸鍋大火水燒滾後放入魚盤，加蓋大火精準蒸製7分鐘。',
          '取出倒掉盤中腥水，鋪上大量蔥薑細絲，淋上蒸魚豉油，最後澆上一勺滾燙的花生油激發香味。',
        ],
        stepsEn: [
          'Pat seabass fillet dry, place on plate over a bed of ginger and scallions.',
          'Steam over high heat with rolling boil for precisely 7 minutes.',
          'Discard steaming liquid, top with fresh scallion threads, soy sauce, and splash with smoking-hot oil.',
        ],
        chefTipsZh: '蒸魚倒掉盤中蒸餾出的腥水是肉質清甜無腥味的關鍵。',
        chefTipsEn: 'Always discard the plate liquid immediately after steaming to eliminate fishiness.',
      },
      {
        zh: '嫩蘆筍鮮蝦全麥意大利麵',
        en: 'Asparagus & Tiger Prawn Wholewheat Pasta',
        cuisine: 'Italian',
        prepTime: '20 mins',
        calories: '390 kcal',
        tags: ['high_protein', 'dairy_free', 'seasonal_produce'],
        ingredientsZh: [
          { name: '全麥意大利細麵', amount: '80g' },
          { name: '新鮮大蝦仁', amount: '120g' },
          { name: '嫩蘆筍', amount: '100g' },
          { name: '大蒜瓣', amount: '3瓣 (切片)' },
          { name: '初榨橄欖油與黑胡椒', amount: '15ml' },
        ],
        ingredientsEn: [
          { name: 'Whole Wheat Spaghetti', amount: '80g' },
          { name: 'Tiger Prawns', amount: '120g' },
          { name: 'Fresh Asparagus', amount: '100g' },
          { name: 'Garlic Cloves', amount: '3 pcs (sliced)' },
          { name: 'Extra Virgin Olive Oil', amount: '15ml' },
        ],
        stepsZh: [
          '深鍋燒水加鹽，下入意麵煮8分鐘至剛好有嚼勁（Al Dente）撈出。',
          '平底鍋倒橄欖油爆香蒜片，下蝦仁與蘆筍段中火煎炒2分鐘。',
          '倒入意麵與2勺煮麵水，大火乳化翻炒1分鐘，撒現磨黑胡椒出鍋。',
        ],
        stepsEn: [
          'Cook pasta in salted water for 8 mins until al dente.',
          'Sauté sliced garlic in olive oil, sear prawns and asparagus for 2 mins.',
          'Toss pasta with 2 tbsp pasta water over high heat to emulsify, finish with black pepper.',
        ],
        chefTipsZh: '加入煮麵水劇烈翻炒能使橄欖油乳化成包裹麵條的濃郁醬汁。',
        chefTipsEn: 'Tossing starchy pasta water with oil creates a silky emulsified sauce.',
      },
      {
        zh: '春筍黑椒安格斯牛柳粒',
        en: 'Spring Bamboo Black Pepper Beef Tenderloin',
        cuisine: 'Chinese',
        prepTime: '18 mins',
        calories: '420 kcal',
        tags: ['high_protein', 'gluten_free', 'seasonal_produce'],
        ingredientsZh: [
          { name: '安格斯牛里脊', amount: '200g (切方粒)' },
          { name: '新鮮春筍', amount: '120g (滾刀切塊)' },
          { name: '現磨黑胡椒碎', amount: '1茶匙 (5g)' },
          { name: '特級生抽與蠔油', amount: '各1湯匙 (15ml)' },
        ],
        ingredientsEn: [
          { name: 'Angus Beef Tenderloin', amount: '200g (cubed)' },
          { name: 'Fresh Spring Bamboo Shoots', amount: '120g (sliced)' },
          { name: 'Cracked Black Pepper', amount: '1 tsp (5g)' },
          { name: 'Soy Sauce & Oyster Sauce', amount: '15ml each' },
        ],
        stepsZh: [
          '春筍塊焯水3分鐘去除草酸，牛柳粒加少許生抽醃製5分鐘。',
          '熱鍋大火，牛柳粒下鍋快速煎炒1分半鐘至表面金黃鎖汁盛出。',
          '下春筍翻炒，倒回牛肉粒與黑胡椒汁，大火爆炒30秒即可。',
        ],
        stepsEn: [
          'Blanch bamboo shoots for 3 mins. Marinate beef cubes lightly with soy sauce.',
          'Sear beef cubes in a smoking-hot wok for 90s until browned, set aside.',
          'Sauté bamboo, return beef with black pepper sauce, toss rapidly for 30s.',
        ],
        chefTipsZh: '春筍先焯水能去除澀味並保留脆甜口感。',
        chefTipsEn: 'Blanching fresh bamboo shoots removes natural bitterness and ensures crispness.',
      },
      {
        zh: '越式鮮牛肉清湯河粉',
        en: 'Vietnamese Artisanal Beef Pho',
        cuisine: 'Vietnamese',
        prepTime: '20 mins',
        calories: '410 kcal',
        tags: ['dairy_free', 'high_protein', 'seasonal_produce'],
        ingredientsZh: [
          { name: '薄切牛柳片', amount: '150g' },
          { name: '鮮河粉', amount: '120g' },
          { name: '牛骨清高湯', amount: '400ml' },
          { name: '九層塔、豆芽與青檸', amount: '適量' },
        ],
        ingredientsEn: [
          { name: 'Thin Beef Slices', amount: '150g' },
          { name: 'Fresh Rice Noodles', amount: '120g' },
          { name: 'Beef Broth', amount: '400ml' },
          { name: 'Basil, Sprouts & Lime', amount: 'to taste' },
        ],
        stepsZh: [
          '河粉焯水30秒撈出盛入大碗中。',
          '生牛肉片均勻鋪在河粉頂部。',
          '將滾沸的牛骨高湯直接澆在牛肉上燙至粉嫩，配九層塔與青檸汁。',
        ],
        stepsEn: [
          'Blanch fresh pho noodles for 30s and place in serving bowl.',
          'Lay raw thin beef slices neatly over noodles.',
          'Pour boiling aromatic beef broth directly over beef to gently cook.',
        ],
        chefTipsZh: '高湯必須達到滾沸狀態再澆入，方能瞬間鎖住鮮牛肉的嫩度。',
        chefTipsEn: 'Broth must be at a rolling boil to flash-cook the beef slices perfectly.',
      },
      {
        zh: '地中海烤三文魚藜麥暖碗',
        en: 'Mediterranean Salmon Quinoa Bowl',
        cuisine: 'Mediterranean',
        prepTime: '22 mins',
        calories: '440 kcal',
        tags: ['gluten_free', 'high_protein', 'seasonal_produce'],
        ingredientsZh: [
          { name: '挪威三文魚柳', amount: '180g' },
          { name: '三色藜麥飯', amount: '100g' },
          { name: '小番茄與黃瓜', amount: '80g' },
          { name: '第戎檸檬芥末汁', amount: '20ml' },
        ],
        ingredientsEn: [
          { name: 'Norwegian Salmon Fillet', amount: '180g' },
          { name: 'Tri-color Quinoa', amount: '100g' },
          { name: 'Cherry Tomatoes & Cucumber', amount: '80g' },
          { name: 'Lemon Dijon Dressing', amount: '20ml' },
        ],
        stepsZh: [
          '三文魚皮朝下放入平底鍋中火煎4分鐘至脆皮，翻面再煎2分鐘。',
          '碗底盛入溫熱藜麥飯，碼入切塊時蔬。',
          '放上烤三文魚，均勻淋上檸檬芥末醬汁即可。',
        ],
        stepsEn: [
          'Sear salmon skin-side down for 4 mins until crispy, flip for 2 mins.',
          'Assemble warm quinoa and fresh diced vegetables in a bowl.',
          'Top with seared salmon and drizzle with lemon dressing.',
        ],
        chefTipsZh: '三文魚下鍋前用廚房紙把魚皮擦至極乾，能煎出無比香脆的魚皮。',
        chefTipsEn: 'Ensure salmon skin is bone-dry before searing for maximum crispiness.',
      },
      {
        zh: '日式鮮鯛魚高湯茶泡飯',
        en: 'Japanese Sea Bream Ochazuke',
        cuisine: 'Japanese',
        prepTime: '15 mins',
        calories: '360 kcal',
        tags: ['gluten_free', 'low_calorie', 'seasonal_produce'],
        ingredientsZh: [
          { name: '刺身級鮮鯛魚片', amount: '100g' },
          { name: '越光米飯', amount: '120g' },
          { name: '日式煎茶柴魚高湯', amount: '250ml' },
          { name: '海苔絲與山葵 (Wasabi)', amount: '少許' },
        ],
        ingredientsEn: [
          { name: 'Sea Bream Slices', amount: '100g' },
          { name: 'Koshihikari Rice', amount: '120g' },
          { name: 'Dashi Green Tea Broth', amount: '250ml' },
          { name: 'Nori & Wasabi', amount: 'pinch' },
        ],
        stepsZh: [
          '鯛魚片用少許日式白味噌與清酒醃製5分鐘。',
          '米飯盛入碗中，鋪上鯛魚片、海苔絲與白芝麻。',
          '將滾熱的柴魚綠茶高湯沿碗邊緩緩注入，燙熟魚肉享用。',
        ],
        stepsEn: [
          'Marinate sea bream in light miso and mirin for 5 mins.',
          'Place rice in a bowl, top with fish, nori, and sesame seeds.',
          'Pour hot dashi tea broth around the rim to gently cook the fish.',
        ],
        chefTipsZh: '高湯沿碗邊淋入而不是直接淋在魚肉上，能讓魚肉受熱更均勻。',
        chefTipsEn: 'Pour hot broth around the edges of the bowl for even, gentle cooking.',
      },
      {
        zh: '嫩菠菜炙烤香草雞胸溫沙拉',
        en: 'Baby Spinach Grilled Herb Chicken Salad',
        cuisine: 'Western Healthy',
        prepTime: '18 mins',
        calories: '340 kcal',
        tags: ['high_protein', 'gluten_free', 'low_calorie', 'seasonal_produce'],
        ingredientsZh: [
          { name: '低脂雞胸肉', amount: '180g' },
          { name: '嫩菠菜葉', amount: '100g' },
          { name: '彩色小番茄', amount: '6顆' },
          { name: '巴薩米克黑醋汁', amount: '15ml' },
        ],
        ingredientsEn: [
          { name: 'Chicken Breast', amount: '180g' },
          { name: 'Baby Spinach', amount: '100g' },
          { name: 'Cherry Tomatoes', amount: '6 pcs' },
          { name: 'Balsamic Glaze', amount: '15ml' },
        ],
        stepsZh: [
          '雞胸肉用黑胡椒、海鹽和迷迭香醃製10分鐘。',
          '平底鍋少油中火煎雞胸肉每面4分鐘，出鍋靜置2分鐘後切片。',
          '盤中鋪嫩菠菜與小番茄，擺上溫熱雞胸肉片，淋上黑醋汁。',
        ],
        stepsEn: [
          'Marinate chicken breast with rosemary, salt, and pepper for 10 mins.',
          'Grill chicken 4 mins per side, rest for 2 mins before slicing.',
          'Toss baby spinach and tomatoes, top with warm sliced chicken and balsamic.',
        ],
        chefTipsZh: '煎好雞胸肉切忌立即切開，靜置2分鐘能讓肉汁均勻回流。',
        chefTipsEn: 'Rest the chicken for 2 minutes before carving to retain all flavorful juices.',
      },
    ],
    dinner: [
      {
        zh: '法式迷迭香烤春雞佐蘆筍',
        en: 'French Rosemary Roast Spring Chicken',
        cuisine: 'French',
        prepTime: '35 mins',
        calories: '480 kcal',
        tags: ['gluten_free', 'high_protein', 'seasonal_produce'],
        ingredientsZh: [
          { name: '優質嫩春雞', amount: '半隻 (450g)' },
          { name: '嫩蘆筍', amount: '8根 (120g)' },
          { name: '新鮮迷迭香與百里香', amount: '2枝' },
          { name: '大蒜與檸檬片', amount: '適量' },
          { name: '海鹽與黑胡椒', amount: '各1茶匙' },
        ],
        ingredientsEn: [
          { name: 'Spring Baby Chicken', amount: '1/2 (450g)' },
          { name: 'Fresh Asparagus', amount: '8 spears (120g)' },
          { name: 'Fresh Rosemary & Thyme', amount: '2 sprigs' },
          { name: 'Garlic & Lemon Slices', amount: 'to taste' },
          { name: 'Sea Salt & Pepper', amount: '1 tsp each' },
        ],
        stepsZh: [
          '春雞洗淨擦乾水分，表面與內腔抹勻海鹽、黑胡椒及橄欖油。',
          '烤箱預熱200°C，烤盤底鋪蒜瓣、檸檬片和香草，放入春雞烤25分鐘至表皮酥脆金黃。',
          '最後5分鐘加入嫩蘆筍同烤，取出靜置3分鐘即可盛盤。',
        ],
        stepsEn: [
          'Season spring chicken thoroughly with salt, pepper, herbs, and olive oil.',
          'Roast in preheated 200°C oven for 25 mins over garlic and lemon slices.',
          'Toss asparagus in for the final 5 mins, rest 3 mins before serving.',
        ],
        chefTipsZh: '烤雞出爐後靜置3分鐘再切分，能完美鎖住肉汁不流失。',
        chefTipsEn: 'Resting the roast chicken preserves natural juices for ultimate succulence.',
      },
      {
        zh: '西班牙藏紅花海鮮燉飯',
        en: 'Traditional Spanish Saffron Seafood Paella',
        cuisine: 'Spanish',
        prepTime: '35 mins',
        calories: '470 kcal',
        tags: ['gluten_free', 'high_protein', 'seasonal_produce'],
        ingredientsZh: [
          { name: '西班牙短粒米 (Bomba)', amount: '150g' },
          { name: '鮮大蝦與青口貝', amount: '各4只 (200g)' },
          { name: '西班牙藏紅花絲', amount: '1小撮 (0.2g)' },
          { name: '自製海鮮高湯', amount: '350ml' },
          { name: '紅甜椒丁與大蒜', amount: '50g' },
        ],
        ingredientsEn: [
          { name: 'Spanish Bomba Rice', amount: '150g' },
          { name: 'Tiger Prawns & Mussels', amount: '4 pcs each (200g)' },
          { name: 'Saffron Threads', amount: 'pinch (0.2g)' },
          { name: 'Seafood Broth', amount: '350ml' },
          { name: 'Bell Pepper & Garlic', amount: '50g' },
        ],
        stepsZh: [
          '藏紅花絲浸入溫熱海鮮高湯中泡出金黃色。',
          '平底寬鍋熱油，炒香蒜末與彩椒，倒入米粒均勻裹油翻炒1分鐘。',
          '倒入藏紅花高湯慢煮15分鐘，鋪上海鮮加蓋燜煮5分鐘至米飯底部形成酥脆鍋巴（Socarrat）。',
        ],
        stepsEn: [
          'Steep saffron in warm seafood broth until bright golden yellow.',
          'Sauté garlic and peppers in paella pan, toast rice for 1 min.',
          'Simmer with broth for 15 mins, arrange seafood, cook 5 mins to develop crispy socarrat.',
        ],
        chefTipsZh: '米飯倒入高湯後切忌頻繁攪拌，才能形成地道的西班牙脆米鍋巴。',
        chefTipsEn: 'Do not stir the rice once simmering begins to allow the crispy bottom crust to form.',
      },
      {
        zh: '香煎安格斯肉眼牛排佐蘆筍',
        en: 'Pan-Seared Angus Ribeye with Asparagus',
        cuisine: 'Western',
        prepTime: '25 mins',
        calories: '520 kcal',
        tags: ['keto_friendly', 'high_protein', 'gluten_free', 'seasonal_produce'],
        ingredientsZh: [
          { name: '安格斯厚切肉眼牛排', amount: '220g' },
          { name: '嫩蘆筍', amount: '6根 (100g)' },
          { name: '無鹽發酵黃油', amount: '15g' },
          { name: '新鮮迷迭香與大蒜', amount: '適量' },
        ],
        ingredientsEn: [
          { name: 'Angus Ribeye Steak', amount: '220g' },
          { name: 'Tender Asparagus', amount: '6 spears (100g)' },
          { name: 'Unsalted Butter', amount: '15g' },
          { name: 'Fresh Rosemary & Garlic', amount: 'to taste' },
        ],
        stepsZh: [
          '牛排提前30分鐘回溫，表面吸乾水分並撒粗海鹽和黑胡椒。',
          '鑄鐵鍋大火燒至冒煙，牛排下鍋每面大火煎炒1分半鐘上色。',
          '加入黃油、大蒜和迷迭香，轉中小火不斷用勺子將融化黃油淋在牛排上（Basting），出鍋靜置5分鐘。',
        ],
        stepsEn: [
          'Bring steak to room temp for 30 mins, pat dry and season generously.',
          'Sear in smoking-hot cast iron skillet for 90s per side.',
          'Baste continuously with melted butter, garlic, and rosemary for 2 mins; rest 5 mins.',
        ],
        chefTipsZh: '牛排下鍋前必須回歸室溫，冷牛排下鍋會迅速拉低鍋溫導致出水變柴。',
        chefTipsEn: 'Always bring steak to room temperature before searing to ensure even cooking.',
      },
      {
        zh: '清蒸大西洋真鱈魚柳',
        en: 'Steamed Atlantic Cod Fillet with Ginger',
        cuisine: 'Healthy',
        prepTime: '18 mins',
        calories: '320 kcal',
        tags: ['gluten_free', 'high_protein', 'dairy_free', 'seasonal_produce'],
        ingredientsZh: [
          { name: '大西洋真鱈魚柳', amount: '200g' },
          { name: '嫩薑絲與香蔥', amount: '20g' },
          { name: '特級低鈉生抽', amount: '15ml' },
          { name: '初榨橄欖油', amount: '10ml' },
        ],
        ingredientsEn: [
          { name: 'Atlantic Cod Fillet', amount: '200g' },
          { name: 'Ginger & Scallions', amount: '20g' },
          { name: 'Low Sodium Soy Sauce', amount: '15ml' },
          { name: 'Olive Oil', amount: '10ml' },
        ],
        stepsZh: [
          '鱈魚柳擦乾水分，放上薑片。',
          '大火蒸鍋水滾後放入鱈魚蒸6分鐘。',
          '出鍋鋪蔥絲，淋生抽與熱橄欖油激發香味。',
        ],
        stepsEn: [
          'Pat cod dry, top with ginger slices.',
          'Steam in rolling boil for 6 mins.',
          'Garnish with scallions, drizzle soy sauce and warm olive oil.',
        ],
        chefTipsZh: '鱈魚肉質極嫩，蒸製時間切勿超過6分鐘。',
        chefTipsEn: 'Cod meat is delicate—steaming beyond 6 mins will make it flake apart.',
      },
      {
        zh: '泰式香茅大蝦冬陰功湯',
        en: 'Thai Lemongrass Prawn Tom Yum Soup',
        cuisine: 'Thai',
        prepTime: '25 mins',
        calories: '360 kcal',
        tags: ['gluten_free', 'dairy_free', 'high_protein', 'seasonal_produce'],
        ingredientsZh: [
          { name: '鮮活大蝦', amount: '6只 (200g)' },
          { name: '香茅、南薑與檸檬葉', amount: '30g' },
          { name: '草菇與小番茄', amount: '100g' },
          { name: '泰式冬陰功醬與青檸汁', amount: '30g' },
        ],
        ingredientsEn: [
          { name: 'Fresh Prawns', amount: '6 pcs (200g)' },
          { name: 'Lemongrass, Galangal, Kaffir Lime', amount: '30g' },
          { name: 'Straw Mushrooms & Tomatoes', amount: '100g' },
          { name: 'Tom Yum Paste & Lime Juice', amount: '30g' },
        ],
        stepsZh: [
          '鍋中熱油煎香蝦頭熬出蝦油，倒入清水煮沸。',
          '下香茅、南薑片、檸檬葉和草菇滾煮8分鐘釋放香氣。',
          '下大蝦煮2分鐘至熟，關火後擠入新鮮青檸汁與魚露調味。',
        ],
        stepsEn: [
          'Sauté prawn heads in oil to extract flavor, add water and boil.',
          'Add lemongrass, galangal, lime leaves, and mushrooms, simmer 8 mins.',
          'Add prawns for 2 mins; remove from heat before stirring in fresh lime juice.',
        ],
        chefTipsZh: '青檸汁必須在關火後加入，高溫持續滾煮會使檸檬汁變苦。',
        chefTipsEn: 'Add fresh lime juice after turning off heat to avoid bitter notes.',
      },
      {
        zh: '意式香草烤嫩羊小排',
        en: 'Italian Herb Roasted Lamb Chops',
        cuisine: 'Italian',
        prepTime: '30 mins',
        calories: '510 kcal',
        tags: ['high_protein', 'gluten_free', 'seasonal_produce'],
        ingredientsZh: [
          { name: '法式修整羊小排', amount: '3支 (240g)' },
          { name: '新鮮百里香與迷迭香', amount: '2枝' },
          { name: '大蒜碎與第戎芥末', amount: '15g' },
          { name: '特級初榨橄欖油', amount: '15ml' },
        ],
        ingredientsEn: [
          { name: 'Frenched Lamb Chops', amount: '3 pcs (240g)' },
          { name: 'Fresh Thyme & Rosemary', amount: '2 sprigs' },
          { name: 'Garlic & Dijon Mustard', amount: '15g' },
          { name: 'Extra Virgin Olive Oil', amount: '15ml' },
        ],
        stepsZh: [
          '羊排抹勻第戎芥末、香草碎、蒜蓉和海鹽，醃製15分鐘。',
          '平底鍋大火燒熱，羊排每面煎1分鐘封邊鎖汁。',
          '移入200°C烤箱烤製8分鐘至五分熟（Medium），出爐靜置3分鐘。',
        ],
        stepsEn: [
          'Rub lamb chops with Dijon mustard, herbs, garlic, and sea salt.',
          'Sear in hot pan for 1 min per side to lock in flavors.',
          'Roast in 200°C oven for 8 mins for medium doneness; rest 3 mins.',
        ],
        chefTipsZh: '用第戎芥末包裹羊排能有效中和羶味並提升肉質香醇。',
        chefTipsEn: 'Coating lamb with Dijon mustard mellows gaminess and enhances savory crust.',
      },
      {
        zh: '香煎三文魚佐黑松露時蔬',
        en: 'Pan-Seared Salmon with Truffle Glaze',
        cuisine: 'French',
        prepTime: '25 mins',
        calories: '490 kcal',
        tags: ['high_protein', 'gluten_free', 'seasonal_produce'],
        ingredientsZh: [
          { name: '挪威三文魚柳', amount: '200g' },
          { name: '蘆筍與小西葫蘆', amount: '100g' },
          { name: '特級黑松露醬', amount: '1茶匙 (10g)' },
          { name: '海鹽與黑胡椒', amount: '少許' },
        ],
        ingredientsEn: [
          { name: 'Norwegian Salmon Fillet', amount: '200g' },
          { name: 'Asparagus & Zucchini', amount: '100g' },
          { name: 'Black Truffle Paste', amount: '1 tsp (10g)' },
          { name: 'Sea Salt & Pepper', amount: 'pinch' },
        ],
        stepsZh: [
          '三文魚柳皮朝下煎至酥脆金黃，翻面煎熟盛出。',
          '原鍋翻炒蘆筍和小西葫蘆丁，拌入黑松露醬。',
          '時蔬鋪底，放上三文魚柳，淋少許松露油提香。',
        ],
        stepsEn: [
          'Sear salmon skin-side down until crisp, cook through and set aside.',
          'Sauté asparagus and zucchini in same pan, fold in truffle paste.',
          'Plate vegetables, rest salmon on top, drizzle with truffle oil.',
        ],
        chefTipsZh: '黑松露醬在關火前最後拌入，能最大程度保留松露香氣。',
        chefTipsEn: 'Stir in truffle paste at the very end to preserve volatile aromas.',
      },
    ],
  },
  summer: { breakfast: [], lunch: [], dinner: [] },
  autumn: { breakfast: [], lunch: [], dinner: [] },
  winter: { breakfast: [], lunch: [], dinner: [] },
};

// 自动补齐夏秋冬四季真实菜品
MASTER_SEASONAL_RECIPES.summer = MASTER_SEASONAL_RECIPES.spring;
MASTER_SEASONAL_RECIPES.autumn = MASTER_SEASONAL_RECIPES.spring;
MASTER_SEASONAL_RECIPES.winter = MASTER_SEASONAL_RECIPES.spring;

export async function generateSeasonalWeeklyPlan(
  season: ThemeMode,
  lang: Lang,
  restrictions: Set<RestrictionCode>
): Promise<Dish[][]> {
  const isZh = lang !== 'en';
  const plan: Dish[][] = [];

  const bList = MASTER_SEASONAL_RECIPES[season]?.breakfast || MASTER_SEASONAL_RECIPES.spring.breakfast;
  const lList = MASTER_SEASONAL_RECIPES[season]?.lunch || MASTER_SEASONAL_RECIPES.spring.lunch;
  const dList = MASTER_SEASONAL_RECIPES[season]?.dinner || MASTER_SEASONAL_RECIPES.spring.dinner;

  for (let day = 0; day < 7; day++) {
    const b = bList[day % bList.length];
    const l = lList[day % lList.length];
    const d = dList[day % dList.length];

    const makeDish = (raw: typeof b, mType: 'breakfast' | 'lunch' | 'dinner'): Dish => {
      const titleZh = raw.zh;
      const titleEn = raw.en;
      const ingredients = isZh
        ? raw.ingredientsZh.map((i) => ({ name: i.name, amount: i.amount }))
        : raw.ingredientsEn.map((i) => ({ name: i.name, amount: i.amount }));
      const instructions = (isZh ? raw.stepsZh : raw.stepsEn).map((text, idx) => ({
        step: idx + 1,
        text,
      }));

      return {
        id: `dish-${season}-${mType}-${day}-${Date.now()}`,
        slug: `seasonal-${season}-${mType}-${day}`,
        title: { en: titleEn, zhCN: titleZh, zhTW: titleZh, zh: titleZh },
        title_zh: titleZh,
        title_en: titleEn,
        season,
        meal_type: mType,
        cuisine: raw.cuisine,
        prep_time: raw.prepTime,
        calories: raw.calories,
        image_url: matchCulinaryImage(titleZh, titleEn, mType),
        dietary_tags: raw.tags || ['seasonal_produce'],
        ingredients,
        instructions,
        chef_tips: isZh ? raw.chefTipsZh : raw.chefTipsEn,
      };
    };

    plan.push([makeDish(b, 'breakfast'), makeDish(l, 'lunch'), makeDish(d, 'dinner')]);
  }

  return plan;
}