import React, { useState } from 'react';
import { X, Sparkles, Loader2 } from 'lucide-react';
import type { Dish, Lang, RestrictionCode, ThemeMode } from '@/types/recipe';
import { matchCulinaryImage } from '@/lib/imageLibrary';

interface AIDishModalProps {
  lang: Lang;
  theme: ThemeMode;
  restrictions: Set<RestrictionCode>;
  onClose: () => void;
  onAddDish: (dish: Dish, dayIdx: number, mealIdx: number) => Promise<void>;
}

export default function AIDishModal({ lang, theme, restrictions, onClose, onAddDish }: AIDishModalProps) {
  const [dishPrompt, setDishPrompt] = useState('');
  const [dayIdx, setDayIdx] = useState(0);
  const [mealIdx, setMealIdx] = useState(1);
  const [loading, setLoading] = useState(false);

  const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const daysZh = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishPrompt.trim()) return;

    setLoading(true);
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const currentMeal = mealTypes[mealIdx];
    const isZh = lang !== 'en';

    let customDish: Dish = {
      id: `custom-${Date.now()}`,
      slug: `custom-${Date.now()}`,
      title: { en: dishPrompt, zhCN: dishPrompt, zhTW: dishPrompt, zh: dishPrompt },
      title_zh: dishPrompt,
      title_en: dishPrompt,
      season: theme,
      meal_type: currentMeal,
      prep_time: '20 mins',
      calories: '350 kcal',
      cuisine: 'Home Cooking',
      image_url: matchCulinaryImage(dishPrompt, dishPrompt, currentMeal),
      dietary_tags: ['seasonal_produce'],
      ingredients: [
        { name: isZh ? `${dishPrompt} 主食材` : `${dishPrompt} Prime Ingredient`, amount: '250g' },
        { name: isZh ? '當季時令配菜' : 'Seasonal Fresh Produce', amount: '100g' },
        { name: isZh ? '特級初榨橄欖油 / 食用油' : 'Cooking Oil / Olive Oil', amount: '1.5湯匙 (20ml)' },
        { name: isZh ? '食用鹽與調味料' : 'Sea Salt & Seasonings', amount: '適量' },
      ],
      instructions: [
        { step: 1, text: isZh ? `將 ${dishPrompt} 清洗乾淨並擦乾水分，切成適口均勻大小。` : `Clean and thoroughly pat dry ${dishPrompt}, cutting into portions.` },
        { step: 2, text: isZh ? '平底鍋中火預熱1分鐘，倒入食用油均勻潤鍋。' : 'Preheat pan over medium heat for 1 min, adding cooking oil.' },
        { step: 3, text: isZh ? '下入主料與配菜煸炒熟透，加調味料翻勻盛盤。' : 'Add ingredients, cook until tender, season well and serve.' },
      ],
      chef_tips: isZh ? '注意控制火候，食材下鍋前擦乾水分能鎖住肉汁。' : 'Pat ingredients dry before cooking to seal in natural flavor.',
    };

    if (apiKey) {
      try {
        const prompt = `You are a professional chef. Create a novice-friendly recipe for "${dishPrompt}".
Target Meal: ${currentMeal}
Dietary Restrictions: ${Array.from(restrictions).join(', ') || 'None'}.
Return JSON only:
{
  "title_zh": "${dishPrompt}",
  "title_en": "Authentic English Recipe Name",
  "prep_time": "20 mins",
  "calories": "350 kcal",
  "cuisine": "Chinese",
  "ingredients": [
    {"name": "食材名称", "amount": "精确克数如 200g / 1汤匙"}
  ],
  "instructions": [
    {"step": 1, "text": "详细步骤说明（含火候与时间）"}
  ],
  "chef_tips": "新手避坑要点"
}`;
        const res = await fetch(
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

        if (res.ok) {
          const data = await res.json();
          const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (raw) {
            const parsed = JSON.parse(raw);
            const tZh = parsed.title_zh || dishPrompt;
            const tEn = parsed.title_en || dishPrompt;
            customDish = {
              id: `custom-${Date.now()}`,
              slug: `custom-${Date.now()}`,
              title: { en: tEn, zhCN: tZh, zhTW: tZh, zh: tZh },
              title_zh: tZh,
              title_en: tEn,
              season: theme,
              meal_type: currentMeal,
              cuisine: parsed.cuisine || 'Home Cooking',
              prep_time: parsed.prep_time || '20 mins',
              calories: parsed.calories || '350 kcal',
              image_url: matchCulinaryImage(tZh, tEn, currentMeal),
              dietary_tags: ['seasonal_produce'],
              ingredients: Array.isArray(parsed.ingredients) ? parsed.ingredients : customDish.ingredients,
              instructions: Array.isArray(parsed.instructions) ? parsed.instructions : customDish.instructions,
              chef_tips: parsed.chef_tips || customDish.chef_tips,
            };
          }
        }
      } catch {}
    }

    await onAddDish(customDish, dayIdx, mealIdx);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl border border-cream-200 bg-white p-6 shadow-2xl sm:p-8">
        <button
          onClick={onClose}
          type="button"
          className="absolute right-5 top-5 rounded-full p-2 text-timber-400 hover:bg-cream-100 hover:text-forest-600 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold-100 text-gold-600">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-serif text-xl font-bold text-forest-700">
              {lang === 'en' ? 'AI Recipe Creator' : 'AI 智能定製菜譜'}
            </h2>
            <p className="text-xs text-timber-400">
              {lang === 'en' ? 'Enter any dish name to generate full authentic details' : '輸入任何菜名，即時生成專屬食材與烹飪步驟'}
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="mt-6 space-y-4">
          <div>
            <label className="block font-serif text-sm font-semibold text-forest-700">
              {lang === 'en' ? 'Dish Name or Idea' : '菜名或烹飪靈感'}
            </label>
            <input
              type="text"
              required
              value={dishPrompt}
              onChange={(e) => setDishPrompt(e.target.value)}
              placeholder={lang === 'en' ? 'e.g., Steamed Seabass with Scallions' : '例如：清蒸鱸魚、意式番茄肉醬麵'}
              className="mt-1 w-full rounded-xl border border-cream-300 bg-cream-50/50 px-4 py-2.5 text-sm text-forest-800 placeholder-timber-300 focus:border-forest-500 focus:outline-none focus:ring-1 focus:ring-forest-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-serif text-sm font-semibold text-forest-700">
                {lang === 'en' ? 'Day of Week' : '安排到星期'}
              </label>
              <select
                value={dayIdx}
                onChange={(e) => setDayIdx(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-cream-300 bg-cream-50/50 px-3 py-2 text-sm text-forest-800 focus:border-forest-500 focus:outline-none"
              >
                {(lang === 'en' ? daysOfWeek : daysZh).map((day, idx) => (
                  <option key={idx} value={idx}>{day}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-serif text-sm font-semibold text-forest-700">
                {lang === 'en' ? 'Meal Time' : '餐別'}
              </label>
              <select
                value={mealIdx}
                onChange={(e) => setMealIdx(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-cream-300 bg-cream-50/50 px-3 py-2 text-sm text-forest-800 focus:border-forest-500 focus:outline-none"
              >
                <option value={0}>{lang === 'en' ? 'Breakfast' : '早餐'}</option>
                <option value={1}>{lang === 'en' ? 'Lunch' : '午餐'}</option>
                <option value={2}>{lang === 'en' ? 'Dinner' : '晚餐'}</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !dishPrompt.trim()}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-forest-500 py-3 font-serif font-bold text-cream-50 transition hover:bg-forest-600 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{lang === 'en' ? 'Generating Recipe...' : 'AI 正在調配精確食譜...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 text-gold-300" />
                <span>{lang === 'en' ? 'Create & Add to Plan' : '生成並加入菜單'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}