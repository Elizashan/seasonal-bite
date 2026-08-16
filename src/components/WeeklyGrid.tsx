import React from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import type { Dish, Lang, ViewMode, WeekPlan } from '@/types/recipe';
import { tr } from '@/lib/i18n';
import MealCard from './MealCard';

interface WeeklyGridProps {
  lang: Lang;
  plan: WeekPlan;
  viewMode: ViewMode;
  isGenerating: boolean;
  onGenerate: () => void;
  onRerollSlot: (dayIdx: number, mealIdx: number) => void;
  onSelectDish: (dish: Dish) => void;
}

export default function WeeklyGrid({
  lang,
  plan,
  viewMode,
  isGenerating,
  onGenerate,
  onRerollSlot,
  onSelectDish,
}: WeeklyGridProps) {
  const daysOfWeek = [
    { en: 'Monday', zh: '星期一' },
    { en: 'Tuesday', zh: '星期二' },
    { en: 'Wednesday', zh: '星期三' },
    { en: 'Thursday', zh: '星期四' },
    { en: 'Friday', zh: '星期五' },
    { en: 'Saturday', zh: '星期六' },
    { en: 'Sunday', zh: '星期日' },
  ];

  const mealLabels = [
    { en: 'BREAKFAST', zh: '早餐' },
    { en: 'LUNCH', zh: '午餐' },
    { en: 'DINNER', zh: '晚餐' },
  ];

  return (
    <div className="space-y-6">
      {/* 顶部主操作按钮 */}
      <div className="flex justify-center">
        <button
          type="button"
          disabled={isGenerating}
          onClick={onGenerate}
          className="flex items-center gap-2.5 rounded-full bg-timber-300/80 px-8 py-3.5 font-serif text-base font-bold text-forest-900 shadow-md backdrop-blur transition hover:bg-timber-300 active:scale-95 disabled:opacity-50"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>{tr('generating', lang)}</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" />
              <span>{tr('generatePlan', lang)}</span>
            </>
          )}
        </button>
      </div>

      {/* 7天菜单网格 */}
      <div className="space-y-4">
        {daysOfWeek.map((dayObj, dayIdx) => {
          const dayPlan = plan[dayIdx] || [null, null, null];
          return (
            <div
              key={dayIdx}
              className="rounded-3xl border border-cream-200 bg-white/70 p-4 shadow-sm backdrop-blur sm:p-6"
            >
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-timber-400 font-serif text-xs font-bold text-white">
                  {dayIdx + 1}
                </span>
                <h3 className="font-serif text-base font-bold text-forest-800">
                  {lang === 'en' ? dayObj.en : dayObj.zh}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {mealLabels.map((mealLabel, mealIdx) => (
                  <div key={mealIdx} className="space-y-1.5">
                    <span className="font-serif text-xs font-bold uppercase tracking-wider text-timber-400">
                      {lang === 'en' ? mealLabel.en : mealLabel.zh}
                    </span>
                    <MealCard
                      dish={dayPlan[mealIdx]}
                      lang={lang}
                      viewMode={viewMode}
                      dayIdx={dayIdx}
                      mealIdx={mealIdx}
                      onSelect={onSelectDish}
                      onSelectDish={onSelectDish}
                      onReroll={onRerollSlot}
                      onRerollSlot={onRerollSlot}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}