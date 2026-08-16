import { Sparkles, ImageIcon, Printer, Wand2 } from 'lucide-react';
import type { DietaryTag, Lang, RestrictionCode, ViewMode } from '@/types/recipe';
import { tr } from '@/lib/i18n';
import RestrictionsDropdown from '@/components/RestrictionsDropdown';

interface FilterBarProps {
  lang: Lang;
  activeTags: Set<DietaryTag>;
  onToggleTag: (tag: DietaryTag) => void;
  selectedRestrictions: Set<RestrictionCode>;
  onToggleRestriction: (code: RestrictionCode) => void;
  onClearRestrictions: () => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onAICreate: () => void;
}

const TAG_KEYS: { tag: DietaryTag; key: string; descKey: string }[] = [
  { tag: 'toddler_friendly', key: 'toddlerFriendly', descKey: 'toddlerDesc' },
  { tag: 'low_sodium', key: 'lowSodium', descKey: 'lowSodium' },
  { tag: 'seasonal_produce', key: 'seasonalProduce', descKey: 'seasonalProduce' },
  { tag: 'high_protein', key: 'highProtein', descKey: 'highProtein' },
  { tag: 'international_flavor', key: 'internationalFlavor', descKey: 'internationalFlavor' },
];

export default function FilterBar({
  lang,
  activeTags,
  onToggleTag,
  selectedRestrictions,
  onToggleRestriction,
  onClearRestrictions,
  viewMode,
  onViewModeChange,
  onAICreate,
}: FilterBarProps) {
  return (
    <div className="relative z-30 overflow-visible rounded-2xl border border-cream-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold-500" />
            <h3 className="text-xs font-bold uppercase tracking-[0.15em] text-timber-400">
              {tr('dietaryFocus', lang)}
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {TAG_KEYS.map(({ tag, key, descKey }) => {
              const active = activeTags.has(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => onToggleTag(tag)}
                  aria-pressed={active}
                  className={`group rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${
                    active
                      ? 'border-forest-500 bg-forest-500 text-cream-50 shadow-md shadow-forest-500/20'
                      : 'border-cream-300 bg-white text-forest-600 hover:border-forest-200 hover:bg-forest-50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {tr(key, lang)}
                    <span
                      className={`text-xs font-normal ${active ? 'text-cream-200' : 'text-timber-300'}`}
                    >
                      {tr(descKey, lang)}
                    </span>
                  </span>
                </button>
              );
            })}
            <RestrictionsDropdown
              lang={lang}
              selected={selectedRestrictions}
              onToggle={onToggleRestriction}
              onClear={onClearRestrictions}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-cream-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex rounded-full bg-cream-100 p-1">
            <button
              type="button"
              onClick={() => onViewModeChange('photo')}
              aria-pressed={viewMode === 'photo'}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
                viewMode === 'photo'
                  ? 'bg-forest-500 text-cream-50 shadow-sm'
                  : 'text-forest-500 hover:text-forest-600'
              }`}
            >
              <ImageIcon className="h-4 w-4" />
              {tr('photoView', lang)}
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('print')}
              aria-pressed={viewMode === 'print'}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
                viewMode === 'print'
                  ? 'bg-forest-500 text-cream-50 shadow-sm'
                  : 'text-forest-500 hover:text-forest-600'
              }`}
            >
              <Printer className="h-4 w-4" />
              {tr('printView', lang)}
            </button>
          </div>

          <button
            type="button"
            onClick={onAICreate}
            className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-gold-500/25 transition-all hover:shadow-xl hover:shadow-gold-500/35 active:scale-95"
          >
            <Wand2 className="h-4 w-4 transition-transform group-hover:rotate-12" />
            {tr('aiCreateDish', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
