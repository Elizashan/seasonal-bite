/*
# Create dishes table — SeasonalBite Farm Kitchen

## What this does
Rebuilds the recipe data model for the farm-to-table seasonal culinary assistant.
The new `dishes` table stores fully multilingual content (English, 繁體中文, 简体中文),
gram-level ingredients, foolproof step-by-step instructions, dietary tags, cuisine
origin, real food photography URLs, and meal-type classification.

The old `recipes` table remains in place but is no longer used by the frontend.

## New table: dishes
- id            (uuid, primary key)
- slug          (text, unique stable identifier for idempotent seeding)
- season        (text, spring | summer | fall | winter, CHECK enforced)
- meal_type     (text, breakfast | lunch | dinner, CHECK enforced)
- cuisine       (text, cuisine origin e.g. Mediterranean, Chinese, Italian)
- dietary_tags  (text[], tags: toddler_friendly, low_sodium, seasonal_produce, high_protein, international_flavor)
- photo_url     (text, URL to high-resolution real food photography)
- prep_time_min (int, approximate preparation time in minutes)
- name          (jsonb, {"en":"...","zhTW":"...","zhCN":"..."})
- description   (jsonb, {"en":"...","zhTW":"...","zhCN":"..."})
- ingredients   (jsonb, [{"amount_g":150,"name":{"en":"...","zhTW":"...","zhCN":"..."}}, ...])
- steps         (jsonb, [{"en":"...","zhTW":"...","zhCN":"..."}, ...])
- created_at    (timestamptz, defaults to now())

## Security
- Row Level Security ENABLED on dishes.
- Public/shared data (no accounts in this app). Four separate policies allow
  anon + authenticated to SELECT, INSERT, UPDATE, DELETE. USING (true) is
  acceptable because the table holds only public recipe content.

## Important notes
- The seed inserts 24 dishes (8 breakfast, 8 lunch, 8 dinner) across all four
  seasons with full trilingual content.
- ON CONFLICT (slug) DO NOTHING makes the seed idempotent — safe to re-run.
- Dietary tags enable filtering: toddler_friendly (mild & soft), low_sodium,
  seasonal_produce, high_protein, international_flavor.
- Ingredients use strict gram-level amounts for precise cooking.
- Steps are concise and foolproof, optimized for domestic helpers and home cooks.
*/

CREATE TABLE IF NOT EXISTS dishes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  season text NOT NULL CHECK (season IN ('spring','summer','fall','winter')),
  meal_type text NOT NULL CHECK (meal_type IN ('breakfast','lunch','dinner')),
  cuisine text NOT NULL,
  dietary_tags text[] NOT NULL DEFAULT '{}',
  photo_url text NOT NULL,
  prep_time_min int NOT NULL DEFAULT 15,
  name jsonb NOT NULL,
  description jsonb NOT NULL,
  ingredients jsonb NOT NULL DEFAULT '[]'::jsonb,
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_dishes_meal_type ON dishes(meal_type);
CREATE INDEX IF NOT EXISTS idx_dishes_season ON dishes(season);
CREATE INDEX IF NOT EXISTS idx_dishes_dietary_tags ON dishes USING GIN(dietary_tags);

ALTER TABLE dishes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_dishes" ON dishes;
CREATE POLICY "anon_select_dishes" ON dishes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_dishes" ON dishes;
CREATE POLICY "anon_insert_dishes" ON dishes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_dishes" ON dishes;
CREATE POLICY "anon_update_dishes" ON dishes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_dishes" ON dishes;
CREATE POLICY "anon_delete_dishes" ON dishes FOR DELETE
  TO anon, authenticated USING (true);

-- ==================== BREAKFAST (8 dishes) ====================

INSERT INTO dishes (slug, season, meal_type, cuisine, dietary_tags, photo_url, prep_time_min, name, description, ingredients, steps) VALUES
('berry-oatmeal', 'spring', 'breakfast', 'Mediterranean', ARRAY['toddler_friendly','high_protein'], 'https://images.pexels.com/photos/4725751/pexels-photo-4725751.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 10,
 '{"en":"Wild Berry Oatmeal","zhTW":"野莓燕麥粥","zhCN":"野莓燕麦粥"}'::jsonb,
 '{"en":"Creamy oats topped with fresh seasonal berries.","zhTW":"綿滑燕麥佐新鮮時令莓果。","zhCN":"绵滑燕麦佐新鲜时令莓果。"}'::jsonb,
 '[{"amount_g":50,"name":{"en":"Rolled Oats","zhTW":"燕麥片","zhCN":"燕麦片"}},{"amount_g":200,"name":{"en":"Whole Milk","zhTW":"全脂牛奶","zhCN":"全脂牛奶"}},{"amount_g":80,"name":{"en":"Mixed Berries","zhTW":"綜合莓果","zhCN":"综合莓果"}},{"amount_g":10,"name":{"en":"Raw Honey","zhTW":"生蜂蜜","zhCN":"生蜂蜜"}}]'::jsonb,
 '[{"en":"Combine oats and milk in a small saucepan.","zhTW":"將燕麥片與牛奶倒入小鍋中拌勻。","zhCN":"将燕麦片与牛奶倒入小锅中拌匀。"},{"en":"Simmer over low heat for 5 minutes, stirring gently.","zhTW":"小火慢煮5分鐘，輕輕攪拌。","zhCN":"小火慢煮5分钟，轻轻搅拌。"},{"en":"Remove from heat and pour into a bowl.","zhTW":"離火後倒入碗中。","zhCN":"离火后倒入碗中。"},{"en":"Top with fresh berries and a drizzle of honey.","zhTW":"鋪上新鮮莓果，淋上蜂蜜。","zhCN":"铺上新鲜莓果，淋上蜂蜜。"},{"en":"Serve warm.","zhTW":"趁溫熱享用。","zhCN":"趁温热享用。"}]'::jsonb),

('veggie-frittata', 'summer', 'breakfast', 'Italian', ARRAY['high_protein','low_sodium'], 'https://images.pexels.com/photos/14302155/pexels-photo-14302155.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 15,
 '{"en":"Garden Vegetable Frittata","zhTW":"田園蔬菜烘蛋","zhCN":"田园蔬菜烘蛋"}'::jsonb,
 '{"en":"Fluffy baked eggs with seasonal garden vegetables.","zhTW":"蓬鬆烘蛋佐時令田園蔬菜。","zhCN":"蓬松烘蛋佐时令田园蔬菜。"}'::jsonb,
 '[{"amount_g":120,"name":{"en":"Free-Range Eggs","zhTW":"放養雞蛋","zhCN":"散养鸡蛋"}},{"amount_g":60,"name":{"en":"Cherry Tomatoes","zhTW":"小番茄","zhCN":"小番茄"}},{"amount_g":40,"name":{"en":"Fresh Spinach","zhTW":"新鮮菠菜","zhCN":"新鲜菠菜"}},{"amount_g":20,"name":{"en":"Parmesan Cheese","zhTW":"帕馬森起司","zhCN":"帕玛森奶酪"}},{"amount_g":10,"name":{"en":"Olive Oil","zhTW":"橄欖油","zhCN":"橄榄油"}}]'::jsonb,
 '[{"en":"Whisk eggs in a bowl with a pinch of salt.","zhTW":"將雞蛋打入碗中，加少許鹽攪散。","zhCN":"将鸡蛋打入碗中，加少许盐搅散。"},{"en":"Heat olive oil in a non-stick skillet over medium heat.","zhTW":"平底鍋中火熱橄欖油。","zhCN":"平底锅中火热橄榄油。"},{"en":"Add spinach and tomatoes, cook for 2 minutes.","zhTW":"放入菠菜與小番茄，炒2分鐘。","zhCN":"放入菠菜与小番茄，炒2分钟。"},{"en":"Pour in eggs and sprinkle with parmesan.","zhTW":"倒入蛋液，撒上帕馬森起司。","zhCN":"倒入蛋液，撒上帕玛森奶酪。"},{"en":"Cover and cook on low heat for 8 minutes until set.","zhTW":"蓋上鍋蓋小火燜8分鐘至凝固。","zhCN":"盖上锅盖小火焖8分钟至凝固。"},{"en":"Slice and serve warm.","zhTW":"切塊趁熱享用。","zhCN":"切块趁热享用。"}]'::jsonb),

('rice-congee', 'winter', 'breakfast', 'Chinese', ARRAY['toddler_friendly','low_sodium','international_flavor'], 'https://images.pexels.com/photos/5652188/pexels-photo-5652188.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 30,
 '{"en":"Silken Rice Congee","zhTW":"滑嫩白米粥","zhCN":"滑嫩大米粥"}'::jsonb,
 '{"en":"Comforting slow-cooked rice porridge with fresh scallions.","zhTW":"慢熬綿滑白米粥佐新鮮蔥花。","zhCN":"慢熬绵滑大米粥佐新鲜葱花。"}'::jsonb,
 '[{"amount_g":80,"name":{"en":"Jasmine Rice","zhTW":"白米","zhCN":"大米"}},{"amount_g":800,"name":{"en":"Water","zhTW":"清水","zhCN":"清水"}},{"amount_g":15,"name":{"en":"Scallions","zhTW":"蔥花","zhCN":"葱花"}},{"amount_g":5,"name":{"en":"Ginger","zhTW":"薑絲","zhCN":"姜丝"}},{"amount_g":2,"name":{"en":"Sea Salt","zhTW":"海鹽","zhCN":"海盐"}}]'::jsonb,
 '[{"en":"Rinse rice thoroughly under cold water.","zhTW":"將米用清水反覆洗淨。","zhCN":"将米用清水反复洗净。"},{"en":"Combine rice, water, and ginger in a pot.","zhTW":"將米、水與薑絲放入鍋中。","zhCN":"将米、水与姜丝放入锅中。"},{"en":"Bring to a boil, then reduce to very low heat.","zhTW":"大火煮沸後轉極小火。","zhCN":"大火煮沸后转极小火。"},{"en":"Simmer uncovered for 25 minutes, stirring occasionally.","zhTW":"不蓋鍋蓋慢煮25分鐘，偶爾攪拌。","zhCN":"不盖锅盖慢煮25分钟，偶尔搅拌。"},{"en":"Season with a pinch of salt.","zhTW":"加少許鹽調味。","zhCN":"加少许盐调味。"},{"en":"Garnish with scallions and serve hot.","zhTW":"撒上蔥花，趁熱享用。","zhCN":"撒上葱花，趁热享用。"}]'::jsonb),

('avocado-toast', 'spring', 'breakfast', 'Mediterranean', ARRAY['high_protein'], 'https://images.pexels.com/photos/4557722/pexels-photo-4557722.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 10,
 '{"en":"Avocado Toast with Poached Egg","zhTW":"酪梨吐司佐水波蛋","zhCN":"牛油果吐司佐水波蛋"}'::jsonb,
 '{"en":"Crunchy whole-grain toast with creamy avocado and a soft poached egg.","zhTW":"酥脆全穀吐司佐綿密酪梨與滑嫩水波蛋。","zhCN":"酥脆全谷吐司佐绵密牛油果与滑嫩水波蛋。"}'::jsonb,
 '[{"amount_g":60,"name":{"en":"Ripe Avocado","zhTW":"熟酪梨","zhCN":"熟牛油果"}},{"amount_g":50,"name":{"en":"Whole-Grain Bread","zhTW":"全穀麵包","zhCN":"全谷面包"}},{"amount_g":60,"name":{"en":"Free-Range Egg","zhTW":"放養雞蛋","zhCN":"散养鸡蛋"}},{"amount_g":10,"name":{"en":"Lemon Juice","zhTW":"檸檬汁","zhCN":"柠檬汁"}},{"amount_g":5,"name":{"en":"Olive Oil","zhTW":"橄欖油","zhCN":"橄榄油"}}]'::jsonb,
 '[{"en":"Toast the bread until golden and crisp.","zhTW":"將麵包烤至金黃酥脆。","zhCN":"将面包烤至金黄酥脆。"},{"en":"Mash avocado with lemon juice and a pinch of salt.","zhTW":"將酪梨搗泥，加檸檬汁與少許鹽。","zhCN":"将牛油果捣泥，加柠檬汁与少许盐。"},{"en":"Spread avocado mixture evenly on the toast.","zhTW":"將酪梨泥均勻抹在吐司上。","zhCN":"将牛油果泥均匀抹在吐司上。"},{"en":"Poach the egg in simmering water for 3 minutes.","zhTW":"在微沸的水中煮水波蛋3分鐘。","zhCN":"在微沸的水中煮水波蛋3分钟。"},{"en":"Place the egg on top and drizzle with olive oil.","zhTW":"將蛋放在吐司上，淋上橄欖油。","zhCN":"将蛋放在吐司上，淋上橄榄油。"},{"en":"Serve immediately.","zhTW":"立即享用。","zhCN":"立即享用。"}]'::jsonb),

('cottage-pancakes', 'summer', 'breakfast', 'American', ARRAY['high_protein','toddler_friendly'], 'https://images.pexels.com/photos/4692161/pexels-photo-4692161.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 15,
 '{"en":"Cottage Cheese Pancakes","zhTW":"茅屋起司鬆餅","zhCN":"茅屋奶酪松饼"}'::jsonb,
 '{"en":"Soft, protein-rich pancakes with fresh berries.","zhTW":"柔軟高蛋白鬆餅佐新鮮莓果。","zhCN":"柔软高蛋白松饼佐新鲜莓果。"}'::jsonb,
 '[{"amount_g":100,"name":{"en":"Cottage Cheese","zhTW":"茅屋起司","zhCN":"茅屋奶酪"}},{"amount_g":50,"name":{"en":"Whole-Grain Flour","zhTW":"全穀麵粉","zhCN":"全谷面粉"}},{"amount_g":60,"name":{"en":"Free-Range Egg","zhTW":"放養雞蛋","zhCN":"散养鸡蛋"}},{"amount_g":50,"name":{"en":"Fresh Berries","zhTW":"新鮮莓果","zhCN":"新鲜莓果"}},{"amount_g":5,"name":{"en":"Coconut Oil","zhTW":"椰子油","zhCN":"椰子油"}}]'::jsonb,
 '[{"en":"Blend cottage cheese and egg until smooth.","zhTW":"將茅屋起司與雞蛋攪打均勻。","zhCN":"将茅屋奶酪与鸡蛋搅打均匀。"},{"en":"Fold in flour until just combined.","zhTW":"加入麵粉輕輕拌勻。","zhCN":"加入面粉轻轻拌匀。"},{"en":"Heat coconut oil in a non-stick pan over medium-low heat.","zhTW":"平底鍋加椰子油，中小火加熱。","zhCN":"平底锅加椰子油，中小火加热。"},{"en":"Spoon batter into small pancakes and cook 3 minutes per side.","zhTW":"舀入麵糊做成小鬆餅，每面煎3分鐘。","zhCN":"舀入面糊做成小松饼，每面煎3分钟。"},{"en":"Top with fresh berries and serve warm.","zhTW":"鋪上新鮮莓果，趁熱享用。","zhCN":"铺上新鲜莓果，趁热享用。"}]'::jsonb),

('quinoa-buddha-bowl', 'fall', 'breakfast', 'Middle Eastern', ARRAY['high_protein','seasonal_produce'], 'https://images.pexels.com/photos/6978186/pexels-photo-6978186.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 15,
 '{"en":"Quinoa Buddha Bowl","zhTW":"藜麥滿碗早餐","zhCN":"藜麦满碗早餐"}'::jsonb,
 '{"en":"Nutritious quinoa bowl with roasted seasonal vegetables.","zhTW":"營養藜麥碗佐烤時令蔬菜。","zhCN":"营养藜麦碗佐烤时令蔬菜。"}'::jsonb,
 '[{"amount_g":60,"name":{"en":"Quinoa","zhTW":"藜麥","zhCN":"藜麦"}},{"amount_g":100,"name":{"en":"Roasted Sweet Potato","zhTW":"烤地瓜","zhCN":"烤红薯"}},{"amount_g":50,"name":{"en":"Chickpeas","zhTW":"鷹嘴豆","zhCN":"鹰嘴豆"}},{"amount_g":40,"name":{"en":"Fresh Spinach","zhTW":"新鮮菠菜","zhCN":"新鲜菠菜"}},{"amount_g":10,"name":{"en":"Tahini Dressing","zhTW":"芝麻醬","zhCN":"芝麻酱"}}]'::jsonb,
 '[{"en":"Cook quinoa according to package directions.","zhTW":"依包裝指示煮熟藜麥。","zhCN":"依包装指示煮熟藜麦。"},{"en":"Roast sweet potato cubes at 200C for 15 minutes.","zhTW":"地瓜切塊，200度烤15分鐘。","zhCN":"红薯切块，200度烤15分钟。"},{"en":"Warm chickpeas in a pan for 3 minutes.","zhTW":"鷹嘴豆入鍋加熱3分鐘。","zhCN":"鹰嘴豆入锅加热3分钟。"},{"en":"Arrange quinoa, vegetables, and spinach in a bowl.","zhTW":"將藜麥、蔬菜與菠菜擺入碗中。","zhCN":"将藜麦、蔬菜与菠菜摆入碗中。"},{"en":"Drizzle with tahini dressing and serve.","zhTW":"淋上芝麻醬即可享用。","zhCN":"淋上芝麻酱即可享用。"}]'::jsonb),

('steamed-egg-custard', 'winter', 'breakfast', 'Chinese', ARRAY['toddler_friendly','low_sodium','international_flavor'], 'https://images.pexels.com/photos/8054819/pexels-photo-8054819.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 12,
 '{"en":"Silken Steamed Egg Custard","zhTW":"滑嫩蒸蛋","zhCN":"滑嫩蒸蛋"}'::jsonb,
 '{"en":"Velvety steamed egg custard, gentle and nourishing.","zhTW":"滑嫩蒸蛋，溫和滋養。","zhCN":"滑嫩蒸蛋，温和滋养。"}'::jsonb,
 '[{"amount_g":100,"name":{"en":"Free-Range Eggs","zhTW":"放養雞蛋","zhCN":"散养鸡蛋"}},{"amount_g":150,"name":{"en":"Warm Water","zhTW":"溫水","zhCN":"温水"}},{"amount_g":5,"name":{"en":"Soy Sauce","zhTW":"醬油","zhCN":"酱油"}},{"amount_g":5,"name":{"en":"Sesame Oil","zhTW":"麻油","zhCN":"麻油"}},{"amount_g":3,"name":{"en":"Scallions","zhTW":"蔥花","zhCN":"葱花"}}]'::jsonb,
 '[{"en":"Whisk eggs with warm water until completely smooth.","zhTW":"將雞蛋與溫水攪打至完全均勻。","zhCN":"将鸡蛋与温水搅打至完全均匀。"},{"en":"Strain the mixture through a fine sieve into a bowl.","zhTW":"過篩倒入蒸碗中。","zhCN":"过筛倒入蒸碗中。"},{"en":"Cover tightly with heatproof film.","zhTW":"用耐熱保鮮膜封緊。","zhCN":"用耐热保鲜膜封紧。"},{"en":"Steam over medium heat for 10 minutes.","zhTW":"中火蒸10分鐘。","zhCN":"中火蒸10分钟。"},{"en":"Drizzle with soy sauce and sesame oil, garnish with scallions.","zhTW":"淋上醬油與麻油，撒上蔥花。","zhCN":"淋上酱油与麻油，撒上葱花。"}]'::jsonb),

('seasonal-fruit-yogurt', 'summer', 'breakfast', 'Mediterranean', ARRAY['low_sodium','seasonal_produce','toddler_friendly'], 'https://images.pexels.com/photos/4736807/pexels-photo-4736807.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 5,
 '{"en":"Seasonal Fruit Yogurt Parfait","zhTW":"時令水果優格杯","zhCN":"时令水果酸奶杯"}'::jsonb,
 '{"en":"Layered Greek yogurt with fresh seasonal fruit and granola.","zhTW":"希臘優格分層佐新鮮時令水果與穀物。","zhCN":"希腊酸奶分层佐新鲜时令水果与谷物。"}'::jsonb,
 '[{"amount_g":150,"name":{"en":"Greek Yogurt","zhTW":"希臘優格","zhCN":"希腊酸奶"}},{"amount_g":80,"name":{"en":"Seasonal Fruits","zhTW":"時令水果","zhCN":"时令水果"}},{"amount_g":30,"name":{"en":"Granola","zhTW":"穀物麥片","zhCN":"谷物麦片"}},{"amount_g":10,"name":{"en":"Raw Honey","zhTW":"生蜂蜜","zhCN":"生蜂蜜"}}]'::jsonb,
 '[{"en":"Spoon a layer of yogurt into a glass.","zhTW":"舀一層優格放入杯中。","zhCN":"舀一层酸奶放入杯中。"},{"en":"Add a layer of chopped seasonal fruit.","zhTW":"鋪一層切塊時令水果。","zhCN":"铺一层切块时令水果。"},{"en":"Sprinkle with granola.","zhTW":"撒上穀物麥片。","zhCN":"撒上谷物麦片。"},{"en":"Repeat the layers once more.","zhTW":"再重複一次分層。","zhCN":"再重复一次分层。"},{"en":"Top with a drizzle of honey and serve chilled.","zhTW":"淋上蜂蜜，冰涼享用。","zhCN":"淋上蜂蜜，冰凉享用。"}]'::jsonb)

ON CONFLICT (slug) DO NOTHING;

-- ==================== LUNCH (8 dishes) ====================

INSERT INTO dishes (slug, season, meal_type, cuisine, dietary_tags, photo_url, prep_time_min, name, description, ingredients, steps) VALUES
('garden-salad', 'summer', 'lunch', 'Mediterranean', ARRAY['low_sodium','seasonal_produce'], 'https://images.pexels.com/photos/842545/pexels-photo-842545.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 15,
 '{"en":"Garden Fresh Salad","zhTW":"田園鮮蔬沙拉","zhCN":"田园鲜蔬沙拉"}'::jsonb,
 '{"en":"Crisp seasonal greens with grilled chicken and olive oil dressing.","zhTW":"爽脆時令蔬菜佐烤雞與橄欖油醬汁。","zhCN":"爽脆时令蔬菜佐烤鸡与橄榄油酱汁。"}'::jsonb,
 '[{"amount_g":100,"name":{"en":"Mixed Salad Greens","zhTW":"綜合生菜","zhCN":"综合生菜"}},{"amount_g":80,"name":{"en":"Grilled Chicken Breast","zhTW":"烤雞胸肉","zhCN":"烤鸡胸肉"}},{"amount_g":50,"name":{"en":"Cherry Tomatoes","zhTW":"小番茄","zhCN":"小番茄"}},{"amount_g":30,"name":{"en":"Cucumber","zhTW":"小黃瓜","zhCN":"黄瓜"}},{"amount_g":15,"name":{"en":"Olive Oil","zhTW":"橄欖油","zhCN":"橄榄油"}},{"amount_g":5,"name":{"en":"Lemon Juice","zhTW":"檸檬汁","zhCN":"柠檬汁"}}]'::jsonb,
 '[{"en":"Wash and dry the salad greens thoroughly.","zhTW":"將生菜洗淨瀝乾。","zhCN":"将生菜洗净沥干。"},{"en":"Slice cherry tomatoes and cucumber thinly.","zhTW":"小番茄與小黃瓜切薄片。","zhCN":"小番茄与黄瓜切薄片。"},{"en":"Grill chicken breast for 4 minutes per side until cooked through.","zhTW":"雞胸肉每面煎4分鐘至熟透。","zhCN":"鸡胸肉每面煎4分钟至熟透。"},{"en":"Slice the chicken and arrange over the greens.","zhTW":"雞肉切片鋪在生菜上。","zhCN":"鸡肉切片铺在生菜上。"},{"en":"Whisk olive oil and lemon juice, drizzle over the salad.","zhTW":"橄欖油與檸檬汁拌勻淋上。","zhCN":"橄榄油与柠檬汁拌匀淋上。"},{"en":"Toss gently and serve immediately.","zhTW":"輕輕拌勻即可享用。","zhCN":"轻轻拌匀即可享用。"}]'::jsonb),

('steamed-cod-veg', 'spring', 'lunch', 'Chinese', ARRAY['high_protein','low_sodium','toddler_friendly','international_flavor'], 'https://images.pexels.com/photos/33896073/pexels-photo-33896073.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 20,
 '{"en":"Steamed Cod with Seasonal Vegetables","zhTW":"清蒸鱈魚佐時蔬","zhCN":"清蒸鳕鱼佐时蔬"}'::jsonb,
 '{"en":"Delicate steamed cod fillet with crisp seasonal vegetables.","zhTW":"鮮嫩清蒸鱈魚佐爽脆時蔬。","zhCN":"鲜嫩清蒸鳕鱼佐爽脆时蔬。"}'::jsonb,
 '[{"amount_g":150,"name":{"en":"Cod Fillet","zhTW":"鱈魚片","zhCN":"鳕鱼片"}},{"amount_g":100,"name":{"en":"Bok Choy","zhTW":"青江菜","zhCN":"小白菜"}},{"amount_g":20,"name":{"en":"Ginger","zhTW":"薑絲","zhCN":"姜丝"}},{"amount_g":10,"name":{"en":"Scallions","zhTW":"蔥絲","zhCN":"葱丝"}},{"amount_g":10,"name":{"en":"Soy Sauce","zhTW":"蒸魚醬油","zhCN":"蒸鱼酱油"}},{"amount_g":5,"name":{"en":"Sesame Oil","zhTW":"麻油","zhCN":"麻油"}}]'::jsonb,
 '[{"en":"Place cod fillet on a heatproof plate.","zhTW":"將鱈魚片放在蒸盤上。","zhCN":"将鳕鱼片放在蒸盘上。"},{"en":"Top with ginger slices.","zhTW":"鋪上薑絲。","zhCN":"铺上姜丝。"},{"en":"Steam over high heat for 8 minutes.","zhTW":"大火蒸8分鐘。","zhCN":"大火蒸8分钟。"},{"en":"Blanch bok choy in boiling water for 1 minute.","zhTW":"青江菜入沸水燙1分鐘。","zhCN":"小白菜入沸水烫1分钟。"},{"en":"Arrange vegetables around the fish.","zhTW":"將蔬菜擺在魚旁。","zhCN":"将蔬菜摆在鱼旁。"},{"en":"Drizzle with soy sauce and sesame oil, garnish with scallions.","zhTW":"淋上醬油與麻油，撒上蔥絲。","zhCN":"淋上酱油与麻油，撒上葱丝。"}]'::jsonb),

('vegetable-soup-bread', 'fall', 'lunch', 'French', ARRAY['low_sodium','seasonal_produce','toddler_friendly'], 'https://images.pexels.com/photos/17312402/pexels-photo-17312402.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 25,
 '{"en":"Rustic Vegetable Soup","zhTW":"鄉村蔬菜濃湯","zhCN":"乡村蔬菜浓汤"}'::jsonb,
 '{"en":"Hearty farm vegetable soup served with crusty bread.","zhTW":"豐盛農場蔬菜湯佐酥脆麵包。","zhCN":"丰盛农场蔬菜汤佐酥脆面包。"}'::jsonb,
 '[{"amount_g":100,"name":{"en":"Seasonal Root Vegetables","zhTW":"時令根莖蔬菜","zhCN":"时令根茎蔬菜"}},{"amount_g":60,"name":{"en":"Carrots","zhTW":"胡蘿蔔","zhCN":"胡萝卜"}},{"amount_g":50,"name":{"en":"Potatoes","zhTW":"馬鈴薯","zhCN":"土豆"}},{"amount_g":40,"name":{"en":"Leeks","zhTW":"韭蔥","zhCN":"韭葱"}},{"amount_g":500,"name":{"en":"Vegetable Broth","zhTW":"蔬菜高湯","zhCN":"蔬菜高汤"}},{"amount_g":60,"name":{"en":"Whole-Grain Bread","zhTW":"全穀麵包","zhCN":"全谷面包"}}]'::jsonb,
 '[{"en":"Dice all vegetables into small, even cubes.","zhTW":"所有蔬菜切小丁。","zhCN":"所有蔬菜切小丁。"},{"en":"Bring vegetable broth to a boil in a large pot.","zhTW":"蔬菜高湯在大鍋中煮沸。","zhCN":"蔬菜高汤在大锅中煮沸。"},{"en":"Add all vegetables and simmer for 15 minutes.","zhTW":"放入所有蔬菜，煮15分鐘。","zhCN":"放入所有蔬菜，煮15分钟。"},{"en":"Season with a pinch of salt and pepper.","zhTW":"加少許鹽與胡椒調味。","zhCN":"加少许盐与胡椒调味。"},{"en":"Ladle into bowls and serve with crusty bread.","zhTW":"盛入碗中，搭配麵包享用。","zhCN":"盛入碗中，搭配面包享用。"}]'::jsonb),

('chicken-noodle-soup', 'winter', 'lunch', 'American', ARRAY['high_protein','toddler_friendly'], 'https://images.pexels.com/photos/10172749/pexels-photo-10172749.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 25,
 '{"en":"Chicken Noodle Soup","zhTW":"雞肉麵條湯","zhCN":"鸡肉面条汤"}'::jsonb,
 '{"en":"Comforting chicken soup with tender noodles and fresh herbs.","zhTW":"暖身雞肉麵條湯佐新鮮香草。","zhCN":"暖身鸡肉面条汤佐新鲜香草。"}'::jsonb,
 '[{"amount_g":100,"name":{"en":"Shredded Chicken","zhTW":"雞絲","zhCN":"鸡丝"}},{"amount_g":60,"name":{"en":"Whole-Grain Noodles","zhTW":"全穀麵條","zhCN":"全谷面条"}},{"amount_g":50,"name":{"en":"Carrots","zhTW":"胡蘿蔔","zhCN":"胡萝卜"}},{"amount_g":40,"name":{"en":"Celery","zhTW":"芹菜","zhCN":"芹菜"}},{"amount_g":500,"name":{"en":"Chicken Broth","zhTW":"雞高湯","zhCN":"鸡汤"}},{"amount_g":5,"name":{"en":"Fresh Parsley","zhTW":"新鮮荷蘭芹","zhCN":"新鲜欧芹"}}]'::jsonb,
 '[{"en":"Bring chicken broth to a boil in a pot.","zhTW":"雞高湯在鍋中煮沸。","zhCN":"鸡汤在锅中煮沸。"},{"en":"Add sliced carrots and celery, cook for 5 minutes.","zhTW":"加入胡蘿蔔與芹菜片，煮5分鐘。","zhCN":"加入胡萝卜与芹菜片，煮5分钟。"},{"en":"Add noodles and cook according to package directions.","zhTW":"放入麵條，依包裝指示煮熟。","zhCN":"放入面条，依包装指示煮熟。"},{"en":"Stir in shredded chicken and heat through.","zhTW":"加入雞絲拌勻加熱。","zhCN":"加入鸡丝拌匀加热。"},{"en":"Garnish with fresh parsley and serve hot.","zhTW":"撒上荷蘭芹，趁熱享用。","zhCN":"撒上欧芹，趁热享用。"}]'::jsonb),

('bibimbap-bowl', 'summer', 'lunch', 'Korean', ARRAY['high_protein','international_flavor'], 'https://images.pexels.com/photos/9348489/pexels-photo-9348489.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 25,
 '{"en":"Vegetable Bibimbap Bowl","zhTW":"蔬菜拌飯碗","zhCN":"蔬菜拌饭碗"}'::jsonb,
 '{"en":"Korean rice bowl with seasoned vegetables and spicy sauce.","zhTW":"韓式拌飯佐時令蔬菜與辣醬。","zhCN":"韩式拌饭佐时令蔬菜与辣酱。"}'::jsonb,
 '[{"amount_g":150,"name":{"en":"Steamed Rice","zhTW":"白飯","zhCN":"米饭"}},{"amount_g":60,"name":{"en":"Spinach","zhTW":"菠菜","zhCN":"菠菜"}},{"amount_g":50,"name":{"en":"Carrots","zhTW":"胡蘿蔔","zhCN":"胡萝卜"}},{"amount_g":50,"name":{"en":"Shiitake Mushrooms","zhTW":"香菇","zhCN":"香菇"}},{"amount_g":50,"name":{"en":"Bean Sprouts","zhTW":"豆芽菜","zhCN":"豆芽菜"}},{"amount_g":15,"name":{"en":"Gochujang Sauce","zhTW":"韓式辣醬","zhCN":"韩式辣酱"}},{"amount_g":5,"name":{"en":"Sesame Oil","zhTW":"芝麻油","zhCN":"芝麻油"}}]'::jsonb,
 '[{"en":"Cook rice and keep warm.","zhTW":"煮好白飯保溫。","zhCN":"煮好米饭保温。"},{"en":"Blanch spinach and bean sprouts separately, season with sesame oil.","zhTW":"菠菜與豆芽分別汆燙，拌芝麻油。","zhCN":"菠菜与豆芽分别汆烫，拌芝麻油。"},{"en":"Julienne carrots and saute mushrooms briefly.","zhTW":"胡蘿蔔切絲，香菇快炒。","zhCN":"胡萝卜切丝，香菇快炒。"},{"en":"Arrange rice in a bowl and top with vegetables in sections.","zhTW":"白飯盛碗，蔬菜分區鋪上。","zhCN":"米饭盛碗，蔬菜分区铺上。"},{"en":"Add a spoonful of gochujang in the center.","zhTW":"中間放一匙韓式辣醬。","zhCN":"中间放一匙韩式辣酱。"},{"en":"Mix everything together before eating.","zhTW":"食用前全部拌勻。","zhCN":"食用前全部拌匀。"}]'::jsonb),

('lentil-stew', 'fall', 'lunch', 'Middle Eastern', ARRAY['high_protein','low_sodium'], 'https://images.pexels.com/photos/29850843/pexels-photo-29850843.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 30,
 '{"en":"Warming Lentil Stew","zhTW":"暖身扁豆燉菜","zhCN":"暖身扁豆炖菜"}'::jsonb,
 '{"en":"Protein-rich red lentil stew with aromatic vegetables.","zhTW":"高蛋白紅扁豆燉菜佐芳香蔬菜。","zhCN":"高蛋白红扁豆炖菜佐芳香蔬菜。"}'::jsonb,
 '[{"amount_g":100,"name":{"en":"Red Lentils","zhTW":"紅扁豆","zhCN":"红扁豆"}},{"amount_g":60,"name":{"en":"Diced Carrots","zhTW":"胡蘿蔔丁","zhCN":"胡萝卜丁"}},{"amount_g":50,"name":{"en":"Onion","zhTW":"洋蔥","zhCN":"洋葱"}},{"amount_g":30,"name":{"en":"Celery","zhTW":"芹菜","zhCN":"芹菜"}},{"amount_g":500,"name":{"en":"Vegetable Broth","zhTW":"蔬菜高湯","zhCN":"蔬菜高汤"}},{"amount_g":5,"name":{"en":"Cumin","zhTW":"孜然粉","zhCN":"孜然粉"}}]'::jsonb,
 '[{"en":"Rinse lentils under cold water.","zhTW":"扁豆用清水洗淨。","zhCN":"扁豆用清水洗净。"},{"en":"Saute onion, carrots, and celery for 5 minutes.","zhTW":"洋蔥、胡蘿蔔與芹菜炒5分鐘。","zhCN":"洋葱、胡萝卜与芹菜炒5分钟。"},{"en":"Add lentils, broth, and cumin to the pot.","zhTW":"加入扁豆、高湯與孜然粉。","zhCN":"加入扁豆、高汤与孜然粉。"},{"en":"Simmer covered for 20 minutes until lentils are tender.","zhTW":"蓋鍋蓋燉煮20分鐘至扁豆軟爛。","zhCN":"盖锅盖炖煮20分钟至扁豆软烂。"},{"en":"Season lightly and serve hot.","zhTW":"輕調味後趁熱享用。","zhCN":"轻调味后趁热享用。"}]'::jsonb),

('grilled-salmon-plate', 'spring', 'lunch', 'Mediterranean', ARRAY['high_protein','low_sodium'], 'https://images.pexels.com/photos/14537684/pexels-photo-14537684.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 20,
 '{"en":"Grilled Salmon Plate","zhTW":"香烤鮭魚餐盤","zhCN":"香烤三文鱼餐盘"}'::jsonb,
 '{"en":"Perfectly grilled salmon with lemon and fresh herbs.","zhTW":"完美香烤鮭魚佐檸檬與新鮮香草。","zhCN":"完美香烤三文鱼佐柠檬与新鲜香草。"}'::jsonb,
 '[{"amount_g":150,"name":{"en":"Salmon Fillet","zhTW":"鮭魚片","zhCN":"三文鱼片"}},{"amount_g":80,"name":{"en":"Asparagus","zhTW":"蘆筍","zhCN":"芦笋"}},{"amount_g":50,"name":{"en":"Cherry Tomatoes","zhTW":"小番茄","zhCN":"小番茄"}},{"amount_g":10,"name":{"en":"Olive Oil","zhTW":"橄欖油","zhCN":"橄榄油"}},{"amount_g":10,"name":{"en":"Lemon","zhTW":"檸檬","zhCN":"柠檬"}},{"amount_g":5,"name":{"en":"Fresh Dill","zhTW":"新鮮蒔蘿","zhCN":"新鲜莳萝"}}]'::jsonb,
 '[{"en":"Brush salmon with olive oil and season lightly.","zhTW":"鮭魚刷橄欖油，輕調味。","zhCN":"三文鱼刷橄榄油，轻调味。"},{"en":"Grill skin-side down for 4 minutes.","zhTW":"魚皮朝下烤4分鐘。","zhCN":"鱼皮朝下烤4分钟。"},{"en":"Flip and grill for another 3 minutes.","zhTW":"翻面再烤3分鐘。","zhCN":"翻面再烤3分钟。"},{"en":"Grill asparagus and tomatoes alongside for 5 minutes.","zhTW":"蘆筍與小番茄同時烤5分鐘。","zhCN":"芦笋与小番茄同时烤5分钟。"},{"en":"Plate the salmon with vegetables, lemon, and dill.","zhTW":"鮭魚與蔬菜盛盤，佐檸檬與蒔蘿。","zhCN":"三文鱼与蔬菜盛盘，佐柠檬与莳萝。"}]'::jsonb),

('vegetable-dumplings', 'winter', 'lunch', 'Chinese', ARRAY['toddler_friendly','international_flavor','low_sodium'], 'https://images.pexels.com/photos/32034410/pexels-photo-32034410.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 20,
 '{"en":"Steamed Vegetable Dumplings","zhTW":"清蒸蔬菜餃子","zhCN":"清蒸蔬菜饺子"}'::jsonb,
 '{"en":"Tender steamed dumplings filled with seasonal vegetables.","zhTW":"鮮嫩清蒸蔬菜餃子。","zhCN":"鲜嫩清蒸蔬菜饺子。"}'::jsonb,
 '[{"amount_g":120,"name":{"en":"Dumpling Wrappers","zhTW":"餃子皮","zhCN":"饺子皮"}},{"amount_g":80,"name":{"en":"Napa Cabbage","zhTW":"大白菜","zhCN":"大白菜"}},{"amount_g":50,"name":{"en":"Shiitake Mushrooms","zhTW":"香菇","zhCN":"香菇"}},{"amount_g":30,"name":{"en":"Carrots","zhTW":"胡蘿蔔","zhCN":"胡萝卜"}},{"amount_g":10,"name":{"en":"Sesame Oil","zhTW":"麻油","zhCN":"麻油"}},{"amount_g":10,"name":{"en":"Soy Sauce","zhTW":"醬油","zhCN":"酱油"}}]'::jsonb,
 '[{"en":"Finely chop cabbage, mushrooms, and carrots.","zhTW":"白菜、香菇與胡蘿蔔切碎。","zhCN":"白菜、香菇与胡萝卜切碎。"},{"en":"Mix vegetables with sesame oil and soy sauce.","zhTW":"蔬菜與麻油、醬油拌勻。","zhCN":"蔬菜与麻油、酱油拌匀。"},{"en":"Place filling in center of each wrapper and fold.","zhTW":"餡料放在餃子皮中央，包好。","zhCN":"馅料放在饺子皮中央，包好。"},{"en":"Arrange dumplings in a bamboo steamer.","zhTW":"餃子排入竹蒸籠。","zhCN":"饺子排入竹蒸笼。"},{"en":"Steam over boiling water for 10 minutes.","zhTW":"沸水蒸10分鐘。","zhCN":"沸水蒸10分钟。"},{"en":"Serve hot with dipping sauce.","zhTW":"趁熱搭配醬料享用。","zhCN":"趁热搭配酱料享用。"}]'::jsonb)

ON CONFLICT (slug) DO NOTHING;

-- ==================== DINNER (8 dishes) ====================

INSERT INTO dishes (slug, season, meal_type, cuisine, dietary_tags, photo_url, prep_time_min, name, description, ingredients, steps) VALUES
('roast-chicken-roots', 'fall', 'dinner', 'French', ARRAY['high_protein','seasonal_produce'], 'https://images.pexels.com/photos/21517324/pexels-photo-21517324.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 40,
 '{"en":"Roast Chicken with Root Vegetables","zhTW":"烤雞佐根莖蔬菜","zhCN":"烤鸡佐根茎蔬菜"}'::jsonb,
 '{"en":"Golden roast chicken with caramelized seasonal roots.","zhTW":"金黃烤雞佐焦糖化時令根莖蔬菜。","zhCN":"金黄烤鸡佐焦糖化时令根茎蔬菜。"}'::jsonb,
 '[{"amount_g":300,"name":{"en":"Chicken Thighs","zhTW":"雞腿","zhCN":"鸡腿"}},{"amount_g":100,"name":{"en":"Carrots","zhTW":"胡蘿蔔","zhCN":"胡萝卜"}},{"amount_g":80,"name":{"en":"Parsnips","zhTW":"歐洲防風草","zhCN":"欧洲防风草"}},{"amount_g":60,"name":{"en":"Red Onion","zhTW":"紅洋蔥","zhCN":"红洋葱"}},{"amount_g":15,"name":{"en":"Olive Oil","zhTW":"橄欖油","zhCN":"橄榄油"}},{"amount_g":5,"name":{"en":"Fresh Rosemary","zhTW":"新鮮迷迭香","zhCN":"新鲜迷迭香"}}]'::jsonb,
 '[{"en":"Preheat oven to 200 degrees Celsius.","zhTW":"烤箱預熱至200度。","zhCN":"烤箱预热至200度。"},{"en":"Chop root vegetables into even chunks.","zhTW":"根莖蔬菜切均勻塊狀。","zhCN":"根茎蔬菜切均匀块状。"},{"en":"Toss vegetables with olive oil and rosemary.","zhTW":"蔬菜與橄欖油、迷迭香拌勻。","zhCN":"蔬菜与橄榄油、迷迭香拌匀。"},{"en":"Place chicken on top and season with salt and pepper.","zhTW":"雞腿放在蔬菜上，灑鹽與胡椒。","zhCN":"鸡腿放在蔬菜上，撒盐与胡椒。"},{"en":"Roast for 35 minutes until chicken is golden and cooked through.","zhTW":"烤35分鐘至雞肉金黃熟透。","zhCN":"烤35分钟至鸡肉金黄熟透。"},{"en":"Rest for 5 minutes before serving.","zhTW":"靜置5分鐘後享用。","zhCN":"静置5分钟后享用。"}]'::jsonb),

('salmon-roasted-veg', 'summer', 'dinner', 'Mediterranean', ARRAY['high_protein','low_sodium'], 'https://images.pexels.com/photos/12431192/pexels-photo-12431192.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 25,
 '{"en":"Grilled Salmon with Roasted Vegetables","zhTW":"烤鮭魚佐烤蔬菜","zhCN":"烤三文鱼佐烤蔬菜"}'::jsonb,
 '{"en":"Flaky grilled salmon with colorful roasted summer vegetables.","zhTW":"鮮嫩烤鮭魚佐繽紛烤夏季蔬菜。","zhCN":"鲜嫩烤三文鱼佐缤纷烤夏季蔬菜。"}'::jsonb,
 '[{"amount_g":180,"name":{"en":"Salmon Fillet","zhTW":"鮭魚片","zhCN":"三文鱼片"}},{"amount_g":80,"name":{"en":"Zucchini","zhTW":"櫛瓜","zhCN":"西葫芦"}},{"amount_g":60,"name":{"en":"Bell Peppers","zhTW":"甜椒","zhCN":"甜椒"}},{"amount_g":50,"name":{"en":"Cherry Tomatoes","zhTW":"小番茄","zhCN":"小番茄"}},{"amount_g":15,"name":{"en":"Olive Oil","zhTW":"橄欖油","zhCN":"橄榄油"}},{"amount_g":10,"name":{"en":"Lemon","zhTW":"檸檬","zhCN":"柠檬"}}]'::jsonb,
 '[{"en":"Preheat oven to 200 degrees Celsius.","zhTW":"烤箱預熱至200度。","zhCN":"烤箱预热至200度。"},{"en":"Chop zucchini and bell peppers into chunks.","zhTW":"櫛瓜與甜椒切塊。","zhCN":"西葫芦与甜椒切块。"},{"en":"Toss vegetables with olive oil and roast for 15 minutes.","zhTW":"蔬菜拌橄欖油烤15分鐘。","zhCN":"蔬菜拌橄榄油烤15分钟。"},{"en":"Add salmon to the tray, season with lemon.","zhTW":"鮭魚放入烤盤，加檸檬調味。","zhCN":"三文鱼放入烤盘，加柠檬调味。"},{"en":"Roast for another 10 minutes until salmon is just cooked.","zhTW":"再烤10分鐘至鮭魚剛熟。","zhCN":"再烤10分钟至三文鱼刚熟。"},{"en":"Serve immediately with roasted vegetables.","zhTW":"搭配烤蔬菜立即享用。","zhCN":"搭配烤蔬菜立即享用。"}]'::jsonb),

('steamed-fish-herbs', 'spring', 'dinner', 'Chinese', ARRAY['high_protein','low_sodium','international_flavor'], 'https://images.pexels.com/photos/11830203/pexels-photo-11830203.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 20,
 '{"en":"Steamed Fish with Fresh Herbs","zhTW":"清蒸鮮魚佐香草","zhCN":"清蒸鲜鱼佐香草"}'::jsonb,
 '{"en":"Whole steamed fish with ginger, scallion, and cilantro.","zhTW":"清蒸鮮魚佐薑絲、蔥絲與香菜。","zhCN":"清蒸鲜鱼佐姜丝、葱丝与香菜。"}'::jsonb,
 '[{"amount_g":250,"name":{"en":"White Fish Fillet","zhTW":"白肉魚片","zhCN":"白肉鱼片"}},{"amount_g":20,"name":{"en":"Ginger","zhTW":"薑絲","zhCN":"姜丝"}},{"amount_g":15,"name":{"en":"Scallions","zhTW":"蔥絲","zhCN":"葱丝"}},{"amount_g":10,"name":{"en":"Cilantro","zhTW":"香菜","zhCN":"香菜"}},{"amount_g":10,"name":{"en":"Soy Sauce","zhTW":"蒸魚醬油","zhCN":"蒸鱼酱油"}},{"amount_g":10,"name":{"en":"Sesame Oil","zhTW":"麻油","zhCN":"麻油"}}]'::jsonb,
 '[{"en":"Place fish fillet on a heatproof plate.","zhTW":"魚片放在蒸盤上。","zhCN":"鱼片放在蒸盘上。"},{"en":"Scatter ginger over the fish.","zhTW":"薑絲鋪在魚上。","zhCN":"姜丝铺在鱼上。"},{"en":"Steam over high heat for 10 minutes.","zhTW":"大火蒸10分鐘。","zhCN":"大火蒸10分钟。"},{"en":"Top with scallions and cilantro.","zhTW":"撒上蔥絲與香菜。","zhCN":"撒上葱丝与香菜。"},{"en":"Heat sesame oil until smoking, pour over the herbs.","zhTW":"麻油燒至冒煙，淋在香草上。","zhCN":"麻油烧至冒烟，淋在香草上。"},{"en":"Drizzle with soy sauce and serve.","zhTW":"淋上醬油即可上桌。","zhCN":"淋上酱油即可上桌。"}]'::jsonb),

('hearty-veg-soup', 'winter', 'dinner', 'French', ARRAY['low_sodium','seasonal_produce','toddler_friendly'], 'https://images.pexels.com/photos/1703272/pexels-photo-1703272.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 30,
 '{"en":"Hearty Winter Vegetable Soup","zhTW":"豐盛冬季蔬菜湯","zhCN":"丰盛冬季蔬菜汤"}'::jsonb,
 '{"en":"Rich, warming soup with winter squash, potatoes, and kale.","zhTW":"濃郁暖身蔬菜湯佐冬季南瓜、馬鈴薯與羽衣甘藍。","zhCN":"浓郁暖身蔬菜汤佐冬季南瓜、土豆与羽衣甘蓝。"}'::jsonb,
 '[{"amount_g":100,"name":{"en":"Winter Squash","zhTW":"冬季南瓜","zhCN":"冬季南瓜"}},{"amount_g":80,"name":{"en":"Potatoes","zhTW":"馬鈴薯","zhCN":"土豆"}},{"amount_g":50,"name":{"en":"Kale","zhTW":"羽衣甘藍","zhCN":"羽衣甘蓝"}},{"amount_g":40,"name":{"en":"Carrots","zhTW":"胡蘿蔔","zhCN":"胡萝卜"}},{"amount_g":500,"name":{"en":"Vegetable Broth","zhTW":"蔬菜高湯","zhCN":"蔬菜高汤"}},{"amount_g":10,"name":{"en":"Olive Oil","zhTW":"橄欖油","zhCN":"橄榄油"}}]'::jsonb,
 '[{"en":"Peel and dice squash, potatoes, and carrots.","zhTW":"南瓜、馬鈴薯與胡蘿蔔去皮切丁。","zhCN":"南瓜、土豆与胡萝卜去皮切丁。"},{"en":"Heat olive oil in a pot and saute vegetables for 5 minutes.","zhTW":"鍋中熱橄欖油，蔬菜炒5分鐘。","zhCN":"锅中热橄榄油，蔬菜炒5分钟。"},{"en":"Add broth, bring to a boil, then simmer for 20 minutes.","zhTW":"加入高湯煮沸後燉煮20分鐘。","zhCN":"加入高汤煮沸后炖煮20分钟。"},{"en":"Stir in chopped kale and cook for 3 minutes.","zhTW":"加入羽衣甘藍煮3分鐘。","zhCN":"加入羽衣甘蓝煮3分钟。"},{"en":"Season lightly and serve hot.","zhTW":"輕調味後趁熱享用。","zhCN":"轻调味后趁热享用。"}]'::jsonb),

('cod-seasonal-veg', 'fall', 'dinner', 'Mediterranean', ARRAY['high_protein','low_sodium','toddler_friendly'], 'https://images.pexels.com/photos/28191271/pexels-photo-28191271.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 25,
 '{"en":"Baked Cod with Seasonal Vegetables","zhTW":"烘烤鱈魚佐時蔬","zhCN":"烘烤鳕鱼佐时蔬"}'::jsonb,
 '{"en":"Tender baked cod with roasted autumn vegetables.","zhTW":"鮮嫩烘烤鱈魚佐烤秋季蔬菜。","zhCN":"鲜嫩烘烤鳕鱼佐烤秋季蔬菜。"}'::jsonb,
 '[{"amount_g":180,"name":{"en":"Cod Fillet","zhTW":"鱈魚片","zhCN":"鳕鱼片"}},{"amount_g":80,"name":{"en":"Butternut Squash","zhTW":"奶油南瓜","zhCN":"奶油南瓜"}},{"amount_g":60,"name":{"en":"Brussels Sprouts","zhTW":"球芽甘藍","zhCN":"球芽甘蓝"}},{"amount_g":40,"name":{"en":"Red Onion","zhTW":"紅洋蔥","zhCN":"红洋葱"}},{"amount_g":15,"name":{"en":"Olive Oil","zhTW":"橄欖油","zhCN":"橄榄油"}},{"amount_g":5,"name":{"en":"Fresh Thyme","zhTW":"新鮮百里香","zhCN":"新鲜百里香"}}]'::jsonb,
 '[{"en":"Preheat oven to 200 degrees Celsius.","zhTW":"烤箱預熱至200度。","zhCN":"烤箱预热至200度。"},{"en":"Toss squash, sprouts, and onion with olive oil and thyme.","zhTW":"南瓜、甘藍與洋蔥拌橄欖油和百里香。","zhCN":"南瓜、甘蓝与洋葱拌橄榄油和百里香。"},{"en":"Roast vegetables for 15 minutes.","zhTW":"蔬菜烤15分鐘。","zhCN":"蔬菜烤15分钟。"},{"en":"Place cod on top, drizzle with more olive oil.","zhTW":"鱈魚放在蔬菜上，淋橄欖油。","zhCN":"鳕鱼放在蔬菜上，淋橄榄油。"},{"en":"Bake for another 10 minutes until cod flakes easily.","zhTW":"再烤10分鐘至鱈魚鬆散。","zhCN":"再烤10分钟至鳕鱼松散。"},{"en":"Serve immediately.","zhTW":"立即享用。","zhCN":"立即享用。"}]'::jsonb),

('pasta-fresh-tomato', 'summer', 'dinner', 'Italian', ARRAY['seasonal_produce','international_flavor'], 'https://images.pexels.com/photos/17906500/pexels-photo-17906500.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 20,
 '{"en":"Pasta with Fresh Tomato Sauce","zhTW":"新鮮番茄義大利麵","zhCN":"新鲜番茄意面"}'::jsonb,
 '{"en":"Al dente pasta with ripe summer tomatoes and basil.","zhTW":"彈牙義大利麵佐熟成夏季番茄與羅勒。","zhCN":"弹牙意面佐熟成夏季番茄与罗勒。"}'::jsonb,
 '[{"amount_g":120,"name":{"en":"Whole-Grain Pasta","zhTW":"全穀義大利麵","zhCN":"全谷意面"}},{"amount_g":150,"name":{"en":"Ripe Tomatoes","zhTW":"熟番茄","zhCN":"熟番茄"}},{"amount_g":20,"name":{"en":"Fresh Basil","zhTW":"新鮮羅勒","zhCN":"新鲜罗勒"}},{"amount_g":15,"name":{"en":"Olive Oil","zhTW":"橄欖油","zhCN":"橄榄油"}},{"amount_g":20,"name":{"en":"Parmesan Cheese","zhTW":"帕馬森起司","zhCN":"帕玛森奶酪"}},{"amount_g":10,"name":{"en":"Garlic","zhTW":"大蒜","zhCN":"大蒜"}}]'::jsonb,
 '[{"en":"Cook pasta in salted boiling water until al dente.","zhTW":"義大利麵入鹽水煮至彈牙。","zhCN":"意面入盐水煮至弹牙。"},{"en":"Blanch tomatoes, peel, and crush roughly.","zhTW":"番茄汆燙去皮，粗壓碎。","zhCN":"番茄汆烫去皮，粗压碎。"},{"en":"Saute garlic in olive oil, add tomatoes, simmer 10 minutes.","zhTW":"大蒜入橄欖油炒香，加番茄燉10分鐘。","zhCN":"大蒜入橄榄油炒香，加番茄炖10分钟。"},{"en":"Toss pasta with the tomato sauce.","zhTW":"義大利麵與番茄醬拌勻。","zhCN":"意面与番茄酱拌匀。"},{"en":"Top with torn basil and parmesan.","zhTW":"撒上羅勒與帕馬森起司。","zhCN":"撒上罗勒与帕玛森奶酪。"},{"en":"Serve immediately.","zhTW":"立即享用。","zhCN":"立即享用。"}]'::jsonb),

('chicken-rice-bowl', 'winter', 'dinner', 'Korean', ARRAY['high_protein','toddler_friendly','international_flavor'], 'https://images.pexels.com/photos/6645977/pexels-photo-6645977.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 30,
 '{"en":"Chicken and Rice Bowl","zhTW":"雞肉飯碗","zhCN":"鸡肉饭碗"}'::jsonb,
 '{"en":"Tender braised chicken over steamed rice with sesame vegetables.","zhTW":"嫩燉雞肉佐白飯與芝麻蔬菜。","zhCN":"嫩炖鸡肉佐米饭与芝麻蔬菜。"}'::jsonb,
 '[{"amount_g":150,"name":{"en":"Chicken Thigh","zhTW":"雞腿肉","zhCN":"鸡腿肉"}},{"amount_g":150,"name":{"en":"Steamed Rice","zhTW":"白飯","zhCN":"米饭"}},{"amount_g":60,"name":{"en":"Spinach","zhTW":"菠菜","zhCN":"菠菜"}},{"amount_g":50,"name":{"en":"Carrots","zhTW":"胡蘿蔔","zhCN":"胡萝卜"}},{"amount_g":10,"name":{"en":"Soy Sauce","zhTW":"醬油","zhCN":"酱油"}},{"amount_g":5,"name":{"en":"Sesame Oil","zhTW":"芝麻油","zhCN":"芝麻油"}},{"amount_g":5,"name":{"en":"Sesame Seeds","zhTW":"芝麻粒","zhCN":"芝麻粒"}}]'::jsonb,
 '[{"en":"Cook rice and keep warm.","zhTW":"煮好白飯保溫。","zhCN":"煮好米饭保温。"},{"en":"Cut chicken into bite-size pieces.","zhTW":"雞肉切小塊。","zhCN":"鸡肉切小块。"},{"en":"Braise chicken with soy sauce and water for 15 minutes.","zhTW":"雞肉與醬油、水燉煮15分鐘。","zhCN":"鸡肉与酱油、水炖煮15分钟。"},{"en":"Blanch spinach, season with sesame oil.","zhTW":"菠菜汆燙，拌芝麻油。","zhCN":"菠菜汆烫，拌芝麻油。"},{"en":"Julienne carrots and saute briefly.","zhTW":"胡蘿蔔切絲快炒。","zhCN":"胡萝卜切丝快炒。"},{"en":"Serve rice topped with chicken and vegetables, sprinkle sesame seeds.","zhTW":"白飯上鋪雞肉與蔬菜，撒芝麻粒。","zhCN":"米饭上铺鸡肉与蔬菜，撒芝麻粒。"}]'::jsonb),

('veg-stirfry-rice', 'spring', 'dinner', 'Chinese', ARRAY['low_sodium','seasonal_produce','international_flavor'], 'https://images.pexels.com/photos/10695972/pexels-photo-10695972.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 20,
 '{"en":"Vegetable Stir-Fry with Rice","zhTW":"蔬菜炒飯","zhCN":"蔬菜炒饭"}'::jsonb,
 '{"en":"Quick stir-fried seasonal vegetables with fluffy steamed rice.","zhTW":"快炒時令蔬菜佐蓬鬆白飯。","zhCN":"快炒时令蔬菜佐蓬松米饭。"}'::jsonb,
 '[{"amount_g":150,"name":{"en":"Steamed Rice","zhTW":"白飯","zhCN":"米饭"}},{"amount_g":80,"name":{"en":"Seasonal Vegetables","zhTW":"時令蔬菜","zhCN":"时令蔬菜"}},{"amount_g":50,"name":{"en":"Tofu","zhTW":"豆腐","zhCN":"豆腐"}},{"amount_g":30,"name":{"en":"Snow Peas","zhTW":"荷蘭豆","zhCN":"荷兰豆"}},{"amount_g":10,"name":{"en":"Soy Sauce","zhTW":"醬油","zhCN":"酱油"}},{"amount_g":10,"name":{"en":"Sesame Oil","zhTW":"麻油","zhCN":"麻油"}}]'::jsonb,
 '[{"en":"Cook rice and let cool slightly.","zhTW":"煮好白飯稍微放涼。","zhCN":"煮好米饭稍微放凉。"},{"en":"Dice tofu and chop vegetables into bite-size pieces.","zhTW":"豆腐切丁，蔬菜切小塊。","zhCN":"豆腐切丁，蔬菜切小块。"},{"en":"Heat oil in a wok over high heat.","zhTW":"炒鍋大火熱油。","zhCN":"炒锅大火热油。"},{"en":"Stir-fry vegetables and tofu for 4 minutes.","zhTW":"蔬菜與豆腐快炒4分鐘。","zhCN":"蔬菜与豆腐快炒4分钟。"},{"en":"Add rice, soy sauce, and sesame oil, toss well.","zhTW":"加入白飯、醬油與麻油翻炒均勻。","zhCN":"加入米饭、酱油与麻油翻炒均匀。"},{"en":"Serve hot.","zhTW":"趁熱享用。","zhCN":"趁热享用。"}]'::jsonb)

ON CONFLICT (slug) DO NOTHING;
