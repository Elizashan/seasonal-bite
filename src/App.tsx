import { useCallback, useEffect, useState } from 'react';
import { Sprout, Share2 } from 'lucide-react';
import type {
  DietaryTag,
  Dish,
  Lang,
  RestrictionCode,
  ThemeMode,
  ViewMode,
  WeekPlan,
} from '@/types/recipe';
import { tr } from '@/lib/i18n';
import { generateCleanWeeklyPlan } from '@/lib/recipeRegistry';
import Navbar from '@/components/Navbar';
import FilterBar from '@/components/FilterBar';
import WeeklyGrid from '@/components/WeeklyGrid';
import RecipeModal from '@/components/RecipeModal';
import ExportModal from '@/components/ExportModal';
import AIDishModal from '@/components/AIDishModal';
import Background from '@/components/Background';

const VALID_SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const;

// ============================================================
// 🆕 AI 菜单生成函数（替换 generateCleanWeeklyPlan）
// ============================================================
const generateWeeklyMenuWithAI = async (
  theme: ThemeMode,
  lang: Lang,  // ✅ 改为 Lang 类型
  restrictions: Set<RestrictionCode> = new Set()  // ✅ 使用正确的类型
): Promise<WeekPlan> => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '你的备用Key';

  const languageInstruction =
    lang === 'en'
      ? 'Return all dish names and ingredients in English.'
      : 'Return dish names in Traditional Chinese (zh-TW), ingredients in Traditional Chinese with English in parentheses.';

  const restrictionText =
    restrictions.size > 0
      ? `Dietary restrictions: ${Array.from(restrictions).join(', ')}. Ensure all dishes comply.`
      : 'No dietary restrictions.';

  const prompt = `You are a professional chef. Generate a complete 7-day meal plan (breakfast, lunch, dinner for each day) for a family. Theme: ${theme} season.

${restrictionText}

For each dish, provide:
- name_en: English name
- name_zh: Chinese name (Traditional)
- meal_type: "breakfast", "lunch", or "dinner"
- cuisine: cuisine style (e.g., Cantonese, Italian, French)
- prep_time: estimated time (e.g., "20 mins")
- calories: approximate calories (e.g., "350 kcal")
- ingredients: array of {name: string, amount: string with unit}
- instructions: array of strings (step-by-step, 4-6 steps)
- chef_tips: one practical tip for home cooks

Return ONLY valid JSON in this exact structure:
{
  "week": [
    [ // Day 0 (Monday)
      { "name_en": "...", "name_zh": "...", "meal_type": "breakfast", ... },
      { "name_en": "...", "name_zh": "...", "meal_type": "lunch", ... },
      { "name_en": "...", "name_zh": "...", "meal_type": "dinner", ... }
    ],
    // ... repeat for days 1-6
  ]
}

${languageInstruction}`;

  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/interactions?key=' + API_KEY, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'gemini-3.6-flash',
        input: prompt,
        response_format: [{ type: 'text', mime_type: 'application/json' }],
      }),
    });

    const data = await response.json();
    const modelOutput = data.steps?.find((step: any) => step.type === 'model_output');
    if (!modelOutput || !modelOutput.content) throw new Error('No model_output');
    const text = modelOutput.content[0]?.text;
    if (!text) throw new Error('No text');
    const parsed = JSON.parse(text);

    // 转换为与当前 WeekPlan 兼容的格式
    return parsed.week.map((day: any[]) =>
      day.map((dish: any) => ({
        id: `ai-${Date.now()}-${Math.random()}`,
        slug: `ai-${Date.now()}-${Math.random()}`,
        title: {
          en: dish.name_en,
          zhCN: dish.name_zh,
          zhTW: dish.name_zh,
          zh: dish.name_zh,
        },
        title_zh: dish.name_zh,
        title_en: dish.name_en,
        season: theme,
        meal_type: dish.meal_type || 'dinner',
        cuisine: dish.cuisine || 'Home Cooking',
        prep_time: dish.prep_time || '20 mins',
        calories: dish.calories || '350 kcal',
        image_url: `https://source.unsplash.com/featured/400x300/?${encodeURIComponent(dish.name_en)}`,
        dietary_tags: Array.isArray(dish.dietary_tags) ? dish.dietary_tags : [],
        ingredients: dish.ingredients || [],
        instructions: dish.instructions
          ? dish.instructions.map((step: string, idx: number) => ({
              step: idx + 1,
              text: step,
            }))
          : [],
        chef_tips: dish.chef_tips || 'Enjoy your meal!',
      }))
    );
  } catch (error) {
    console.error('AI 生成失败，使用静态数据', error);
    // 降级方案：如果 AI 失败，使用原来的静态数据
    return generateCleanWeeklyPlan(theme, lang);
  }
};

export default function App() {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      return (localStorage.getItem('seasonal_lang_v5') as Lang) || 'zhTW';
    } catch {
      return 'zhTW';
    }
  });

  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('seasonal_theme_v5');
      return VALID_SEASONS.includes(saved as any) ? (saved as ThemeMode) : 'spring';
    } catch {
      return 'spring';
    }
  });

  const [activeTags, setActiveTags] = useState<Set<DietaryTag>>(new Set(['seasonal_produce']));
  const [selectedRestrictions, setSelectedRestrictions] = useState<Set<RestrictionCode>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('photo');

  // 1. 彻底清除导致旧图片错位的历史脏缓存
  useEffect(() => {
    try {
      localStorage.removeItem('seasonal_weekly_plan');
      localStorage.removeItem('seasonal_weekly_plan_v2');
      localStorage.removeItem('seasonal_weekly_plan_v3');
      localStorage.removeItem('seasonal_weekly_plan_v4');
      localStorage.removeItem('seasonal_plan_clean_v3');
    } catch {}
  }, []);

  // 🆕 2. 初始化状态：空计划，加载中
  const [plan, setPlan] = useState<WeekPlan>([]);
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(true); // 初始为 true

  // 🆕 3. 初始加载 AI 菜单（依赖主题、语言、限制）
  useEffect(() => {
    const loadInitialMenu = async () => {
      setIsGenerating(true);
      try {
        const newPlan = await generateWeeklyMenuWithAI(theme, lang, selectedRestrictions);
        setPlan(newPlan);
        setHasGenerated(true);
      } catch (error) {
        console.error('Initial load failed:', error);
        // 降级到静态数据
        setPlan(generateCleanWeeklyPlan(theme, lang));
        setHasGenerated(true);
      } finally {
        setIsGenerating(false);
      }
    };
    loadInitialMenu();
  }, [theme, lang, selectedRestrictions]); // 当主题、语言或限制变化时重新加载

  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [showExport, setShowExport] = useState<boolean>(false);
  const [showAICreate, setShowAICreate] = useState<boolean>(false);

  useEffect(() => {
    try { localStorage.setItem('seasonal_lang_v5', lang); } catch {}
  }, [lang]);

  useEffect(() => {
    try { localStorage.setItem('seasonal_theme_v5', theme); } catch {}
  }, [theme]);

  // 🆕 4. 点击“生成新鮮每週菜單”：调用 AI 重新生成
  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      const newPlan = await generateWeeklyMenuWithAI(theme, lang, selectedRestrictions);
      // 解构触发 React 深度渲染
      setPlan([...newPlan.map((day) => [...day])]);
      setHasGenerated(true);
    } catch (error) {
      console.error('Generate failed:', error);
      // 降级
      setPlan(generateCleanWeeklyPlan(theme, lang).map(day => [...day]));
      setHasGenerated(true);
    } finally {
      setIsGenerating(false);
    }
  }, [theme, lang, selectedRestrictions]);

  // 🆕 5. 单餐重抽（重新生成整个计划并替换对应餐）
  const handleRerollSlot = useCallback(
    async (dayIdx: number, mealIdx: number) => {
      setIsGenerating(true);
      try {
        const newPlan = await generateWeeklyMenuWithAI(theme, lang, selectedRestrictions);
        const candidate = newPlan[dayIdx]?.[mealIdx];
        if (candidate) {
          setPlan((prev) => {
            const next = prev.map((day) => [...day]);
            if (next[dayIdx]) next[dayIdx][mealIdx] = candidate;
            return next;
          });
        }
      } catch (error) {
        console.error('Reroll failed:', error);
        // 降级：使用静态数据
        const fallback = generateCleanWeeklyPlan(theme, lang);
        const candidate = fallback[dayIdx]?.[mealIdx];
        if (candidate) {
          setPlan((prev) => {
            const next = prev.map((day) => [...day]);
            if (next[dayIdx]) next[dayIdx][mealIdx] = candidate;
            return next;
          });
        }
      } finally {
        setIsGenerating(false);
      }
    },
    [theme, lang, selectedRestrictions]
  );

  // 6. 自定义菜谱加入菜单（未变）
  const handleAddAIDish = useCallback(async (dish: Dish, dayIdx: number, mealIdx: number) => {
    const mealTypes = ['breakfast', 'lunch', 'dinner'] as const;
    const mealType = mealTypes[mealIdx];
    const customized: Dish = { ...dish, meal_type: mealType, season: theme };

    setPlan((prev) => {
      const newPlan = prev.map((day) => [...day]);
      if (newPlan[dayIdx]) newPlan[dayIdx][mealIdx] = customized;
      return newPlan;
    });
    setHasGenerated(true);
  }, [theme]);

  const toggleTag = useCallback((tag: DietaryTag) => {
    setActiveTags((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }, []);

  const toggleRestriction = useCallback((code: RestrictionCode) => {
    setSelectedRestrictions((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }, []);

  const clearRestrictions = useCallback(() => {
    setSelectedRestrictions(new Set());
  }, []);

  return (
    <div className={`theme-${theme} relative min-h-screen bg-cream-50`}>
      <Background theme={theme} />
      <div className="relative z-10">
        <Navbar lang={lang} onLangChange={setLang} theme={theme} onThemeChange={setTheme} />

        {/* 顶部标题区 */}
        <section className="relative overflow-hidden border-b border-cream-200 bg-gradient-to-b from-cream-100 to-cream-50">
          <div className="relative mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-50 px-4 py-1.5">
              <Sprout className="h-4 w-4 text-forest-500" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-forest-500">
                {tr('artisanalMenu', lang)}
              </span>
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-forest-600 sm:text-5xl lg:text-6xl">
              {tr('brand', lang)} <span className="text-forest-300">|</span>{' '}
              <span className="text-gold-500" style={{ fontFamily: '"LXGW WenKai TC", "Noto Serif TC", serif' }}>
                {tr('brandSub', lang)}
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl font-serif text-lg italic text-timber-400">
              {tr('tagline', lang)}
            </p>
          </div>
        </section>

        {/* 主体交互区 */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8">
            <FilterBar
              lang={lang}
              activeTags={activeTags}
              onToggleTag={toggleTag}
              selectedRestrictions={selectedRestrictions}
              onToggleRestriction={toggleRestriction}
              onClearRestrictions={clearRestrictions}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onAICreate={() => setShowAICreate(true)}
            />
          </div>

          {hasGenerated && (
            <div className="mb-6 flex justify-center">
              <button
                type="button"
                onClick={() => setShowExport(true)}
                className="flex items-center gap-2.5 rounded-full border-2 border-forest-500 bg-white px-6 py-3 font-serif text-base font-bold text-forest-600 shadow-sm transition hover:bg-forest-50 active:scale-95"
              >
                <Share2 className="h-5 w-5" />
                {tr('export', lang)}
              </button>
            </div>
          )}

          <WeeklyGrid
            lang={lang}
            plan={plan}
            viewMode={viewMode}
            isGenerating={isGenerating}
            onGenerate={handleGenerate}
            onRerollSlot={handleRerollSlot}
            onSelectDish={setSelectedDish}
          />
        </main>

        {/* 页脚 */}
        <footer className="border-t border-cream-200 bg-white py-8">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="font-serif text-sm text-timber-400">
              {tr('brand', lang)} | <span style={{ fontFamily: '"LXGW WenKai TC", "Noto Serif TC", serif' }}>{tr('brandSub', lang)}</span> — {tr('freshFromFarm', lang)}
            </p>
          </div>
        </footer>

        {/* 详情与操作弹窗 */}
        {selectedDish && (
          <RecipeModal dish={selectedDish} lang={lang} onClose={() => setSelectedDish(null)} />
        )}
        {showExport && (
          <ExportModal lang={lang} plan={plan} onClose={() => setShowExport(false)} />
        )}
        {showAICreate && (
          <AIDishModal
            lang={lang}
            theme={theme}
            restrictions={selectedRestrictions}
            onClose={() => setShowAICreate(false)}
            onAddDish={handleAddAIDish}
          />
        )}
      </div>
    </div>
  );
}