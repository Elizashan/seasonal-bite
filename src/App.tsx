import { generateSeasonalWeeklyPlan } from '@/lib/dynamicGenerator';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Sprout, Loader2, Share2 } from 'lucide-react';
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
import { detectUserSeason } from '@/lib/season';
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
      return (localStorage.getItem('lang') as Lang) || 'zhTW';
    } catch {
      return 'zhTW';
    }
  });

  // 自动检测用户所在地的真实季节（区分南北半球）
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem('theme');
      if (VALID_SEASONS.includes(saved as any)) return saved as ThemeMode;
      return detectUserSeason();
    } catch {
      return detectUserSeason();
    }
  });

  const [activeTags, setActiveTags] = useState<Set<DietaryTag>>(new Set(['seasonal_produce' as DietaryTag]));
  const [selectedRestrictions, setSelectedRestrictions] = useState<Set<RestrictionCode>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('photo');

  const [plan, setPlan] = useState<WeekPlan>(() => Array.from({ length: 7 }, () => [null, null, null]));
  const [hasGenerated, setHasGenerated] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [showAICreate, setShowAICreate] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('lang', lang); } catch {}
  }, [lang]);

  useEffect(() => {
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  // 点击“生成新鮮每週菜單”：调用 AI 实时生成 21 道时令菜品
  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    try {
      const newPlan = await generateSeasonalWeeklyPlan(theme, lang, selectedRestrictions);
      if (Array.isArray(newPlan) && newPlan.length === 7) {
        // 创建全新引用触发 React 完整重绘
        setPlan([...newPlan]);
        setHasGenerated(true);
        localStorage.setItem('seasonal_weekly_plan', JSON.stringify(newPlan));
      }
    } catch (err) {
      console.error('Failed to generate plan:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [theme, lang, selectedRestrictions]);

  // 首次载入自动根据时令生成第一套菜单
  useEffect(() => {
    handleGenerate();
  }, []);

  const handleRerollSlot = useCallback(
    async (dayIdx: number, mealIdx: number) => {
      const newPlanChunk = await generateSeasonalWeeklyPlan(theme, lang, selectedRestrictions);
      const randomDay = Math.floor(Math.random() * 7);
      const newDish = newPlanChunk[randomDay][mealIdx];

      setPlan((prev) => {
        const next = prev.map((day) => [...day]);
        if (next[dayIdx]) next[dayIdx][mealIdx] = newDish;
        return next;
      });
    },
    [theme, lang, selectedRestrictions],
  );

  const handleAddAIDish = useCallback(async (dish: Dish, dayIdx: number, mealIdx: number) => {
    setPlan((prev) => {
      const newPlan = prev.map((day) => [...day]);
      if (newPlan[dayIdx]) newPlan[dayIdx][mealIdx] = dish;
      return newPlan;
    });
    setHasGenerated(true);
  }, []);

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

        <section className="relative overflow-hidden border-b border-cream-200 bg-gradient-to-b from-cream-100 to-cream-50">
          <div className="relative mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 sm:py-16 lg:px-8">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-forest-200 bg-forest-50 px-4 py-1.5">
              <Sprout className="h-4 w-4 text-forest-500" />
              <span className="text-xs font-bold uppercase tracking-[0.15em] text-forest-500">
                {tr('artisanalMenu', lang)}
              </span>
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-forest-600 sm:text-5xl lg:text-6xl">
              {tr('brand', lang)} <span className="text-forest-300">|</span> <span className="text-gold-500" style={{ fontFamily: '"LXGW WenKai TC", "Noto Serif TC", serif' }}>{tr('brandSub', lang)}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl font-serif text-lg italic text-timber-400">
              {tr('tagline', lang)}
            </p>
          </div>
        </section>

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

        <footer className="border-t border-cream-200 bg-white py-8">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
            <p className="font-serif text-sm text-timber-400">
              {tr('brand', lang)} | <span style={{ fontFamily: '"LXGW WenKai TC", "Noto Serif TC", serif' }}>{tr('brandSub', lang)}</span> — {tr('freshFromFarm', lang)}
            </p>
          </div>
        </footer>

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