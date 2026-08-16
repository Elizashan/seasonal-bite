import React from 'react';
import { Clock, RotateCcw, Utensils } from 'lucide-react';
import type { Dish, Lang, ViewMode } from '@/types/recipe';
import { tr } from '@/lib/i18n';
import { matchCulinaryImage } from '@/lib/imageLibrary';

interface MealCardProps {
  dish: Dish | null;
  lang: Lang;
  viewMode: ViewMode;
  dayIdx: number;
  mealIdx: number;
  onSelect?: (dish: Dish) => void;
  onSelectDish?: (dish: Dish) => void;
  onClick?: (dish: Dish) => void;
  onReroll?: (dayIdx: number, mealIdx: number) => void;
  onRerollSlot?: (dayIdx: number, mealIdx: number) => void;
}

export function getSafeTitle(d: any, lang: Lang): string {
  if (!d) return '';
  if (lang === 'en') {
    return d.title_en || (typeof d.title === 'object' ? d.title?.en : '') || 'Artisanal Dish';
  }
  return d.title_zh || (typeof d.title === 'object' ? (d.title?.zhTW || d.title?.zhCN || d.title?.zh) : '') || '時令料理';
}

export default function MealCard(props: MealCardProps) {
  const { dish, lang, viewMode, dayIdx, mealIdx } = props;

  if (!dish) {
    return (
      <div className="flex h-36 w-full items-center justify-center rounded-2xl border-2 border-dashed border-cream-200 bg-white/40 p-4 text-center">
        <span className="font-serif text-sm text-timber-300">
          {lang === 'en' ? 'Not Scheduled' : '尚未安排'}
        </span>
      </div>
    );
  }

  const d = dish as any;
  const title = getSafeTitle(d, lang);
  const mealType = d.meal_type || 'lunch';

  // 严格使用匹配出的食物高清大图
  const imageUrl = d.image_url && !d.image_url.includes('placeholder')
    ? d.image_url
    : matchCulinaryImage(d.title_zh || '', d.title_en || '', mealType);

  const prepTime = d.prep_time || '20 mins';
  const cuisine = typeof d.cuisine === 'object' ? (d.cuisine[lang] || 'Home Cooking') : (d.cuisine || 'Home Cooking');

  const handleCardClick = () => {
    const fn = props.onSelect || props.onSelectDish || props.onClick;
    if (typeof fn === 'function') fn(dish);
  };

  const handleRerollClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const fn = props.onReroll || props.onRerollSlot;
    if (typeof fn === 'function') fn(dayIdx, mealIdx);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-cream-200 bg-white shadow-sm transition hover:shadow-md cursor-pointer select-none"
    >
      <button
        type="button"
        title={tr('reroll', lang)}
        onClick={handleRerollClick}
        className="absolute right-2 top-2 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 text-forest-700 shadow backdrop-blur transition hover:bg-white active:scale-95"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </button>

      {viewMode === 'photo' && (
        <div className="relative h-28 w-full overflow-hidden bg-cream-100">
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          <div className="absolute bottom-2 left-2 right-8">
            <h4 className="truncate font-serif text-sm font-bold text-white drop-shadow-md">
              {title}
            </h4>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between p-3">
        {viewMode !== 'photo' && (
          <h4 className="mb-2 line-clamp-1 font-serif text-sm font-bold text-forest-800">
            {title}
          </h4>
        )}

        <div className="flex items-center justify-between text-xs text-timber-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {prepTime}
          </span>
          <span className="flex items-center gap-1">
            <Utensils className="h-3 w-3" />
            {cuisine}
          </span>
        </div>

        {Array.isArray(d.dietary_tags) && d.dietary_tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {d.dietary_tags.slice(0, 2).map((tag: any, idx: number) => (
              <span
                key={idx}
                className="rounded-md bg-forest-50 px-1.5 py-0.5 text-[10px] font-medium text-forest-600 border border-forest-100"
              >
                {typeof tag === 'string' ? tag : 'Healthy'}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}