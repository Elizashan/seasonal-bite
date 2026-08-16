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

  // 2. 初始化即载入一组 100% 精准配对的 21 餐时令菜单
  const [plan, setPlan] = useState<WeekPlan>(() => generateCleanWeeklyPlan(theme, lang));
  const [hasGenerated, setHasGenerated] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [showExport, setShowExport] = useState<boolean>(false);
  const [showAICreate, setShowAICreate] = useState<boolean>(false);

  useEffect(() => {
    try { localStorage.setItem('seasonal_lang_v5', lang); } catch {}
  }, [lang]);

  useEffect(() => {
    try { localStorage.setItem('seasonal_theme_v5', theme); } catch {}
  }, [theme]);

  // 3. 点击“生成新鮮每週菜單”：100% 触发全新洗牌与即时 UI 重绘
  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setTimeout(() => {
      const freshPlan = generateCleanWeeklyPlan(theme, lang);
      // 解构触发 React 深度渲染
      setPlan([...freshPlan.map((day) => [...day])]);
      setHasGenerated(true);
      setIsGenerating(false);
    }, 180);
  }, [theme, lang]);

  // 4. 单餐重抽（单卡片局部刷新）
  const handleRerollSlot = useCallback(
    (dayIdx: number, mealIdx: number) => {
      const freshPlan = generateCleanWeeklyPlan(theme, lang);
      const candidate = freshPlan[dayIdx]?.[mealIdx];
      if (candidate) {
        setPlan((prev) => {
          const next = prev.map((day) => [...day]);
          if (next[dayIdx]) next[dayIdx][mealIdx] = candidate;
          return next;
        });
      }
    },
    [theme, lang]
  );

  // 5. 自定义菜谱加入菜单
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