import React from 'react';
import { X, Clock, Flame, Utensils, ChefHat, ShoppingBag, Lightbulb } from 'lucide-react';
import type { Dish, Lang } from '@/types/recipe';
import { getSafeTitle } from './MealCard';

interface RecipeModalProps {
  dish: Dish;
  lang: Lang;
  onClose: () => void;
}

export default function RecipeModal({ dish, lang, onClose }: RecipeModalProps) {
  const title = getSafeTitle(dish, lang);
  const isZh = lang !== 'en';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-forest-950/45 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative my-8 w-full max-w-2xl overflow-hidden rounded-3xl border border-cream-200 bg-white shadow-2xl">
        <div className="relative h-60 w-full sm:h-72 bg-cream-100">
          <img src={dish.image_url} alt={title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
          
          <button
            onClick={onClose}
            type="button"
            className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition hover:bg-black/60 active:scale-95"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <h2 className="font-serif text-2xl font-bold sm:text-3xl drop-shadow-md">{title}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-cream-100 font-medium">
              <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full backdrop-blur">
                <Clock className="h-4 w-4 text-gold-300" />
                {dish.prep_time}
              </span>
              <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full backdrop-blur">
                <Flame className="h-4 w-4 text-gold-300" />
                {dish.calories}
              </span>
              <span className="flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-full backdrop-blur">
                <Utensils className="h-4 w-4 text-gold-300" />
                {dish.cuisine}
              </span>
            </div>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* 精准用量明细 */}
          <div>
            <div className="flex items-center gap-2 text-forest-700 font-serif font-bold text-lg border-b border-cream-200 pb-2">
              <ShoppingBag className="h-5 w-5 text-gold-500" />
              <span>{isZh ? '食材用量明細（精確克數/份量）' : 'Ingredients & Exact Measures'}</span>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {dish.ingredients.map((ing, idx) => {
                const name = typeof ing.name === 'object' ? (ing.name[lang] || ing.name.zhCN || ing.name.en || '食材') : ing.name;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-cream-50/80 px-4 py-2.5 border border-cream-200/60"
                  >
                    <span className="font-serif text-sm font-medium text-forest-900">{name}</span>
                    <span className="font-serif text-xs font-bold text-forest-700 bg-forest-50 px-2 py-0.5 rounded-md border border-forest-200/50">{ing.amount}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 新手保姆级烹饪步骤 */}
          <div>
            <div className="flex items-center gap-2 text-forest-700 font-serif font-bold text-lg border-b border-cream-200 pb-2">
              <ChefHat className="h-5 w-5 text-gold-500" />
              <span>{isZh ? '新手保姆級烹飪步驟' : 'Step-by-Step Cooking Guide'}</span>
            </div>
            <div className="mt-4 space-y-3">
              {dish.instructions.map((inst, idx) => {
                const stepText = typeof inst.text === 'object' ? (inst.text[lang] || inst.text.zhCN || inst.text.en || '') : inst.text;
                return (
                  <div key={idx} className="flex items-start gap-3 rounded-2xl bg-cream-50/50 p-4 border border-cream-200/60">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-forest-600 font-serif text-xs font-bold text-white shadow-sm">
                      {inst.step}
                    </div>
                    <p className="font-serif text-sm leading-relaxed text-forest-900">
                      {stepText}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 新手技巧 */}
          {dish.chef_tips && (
            <div className="flex items-start gap-3 rounded-2xl bg-gold-50/80 p-4 border border-gold-200/60 text-forest-900">
              <Lightbulb className="h-5 w-5 shrink-0 text-gold-600 mt-0.5" />
              <p className="font-serif text-xs leading-relaxed text-forest-800">
                {dish.chef_tips}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}