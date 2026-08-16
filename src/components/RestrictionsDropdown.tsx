import { useEffect, useRef, useState } from 'react';
import { ShieldCheck, ChevronDown, Check, X } from 'lucide-react';
import type { Lang, RestrictionCode } from '@/types/recipe';
import { RESTRICTIONS, tr } from '@/lib/i18n';

interface RestrictionsDropdownProps {
  lang: Lang;
  selected: Set<RestrictionCode>;
  onToggle: (code: RestrictionCode) => void;
  onClear: () => void;
}

export default function RestrictionsDropdown({
  lang,
  selected,
  onToggle,
  onClear,
}: RestrictionsDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const count = selected.size;
  const isActive = count > 0;

  return (
    <div className="relative z-50" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-95 ${
          isActive
            ? 'border-forest-500 bg-forest-50 text-forest-700 shadow-sm'
            : 'border-cream-300 bg-white text-forest-600 hover:border-forest-200 hover:bg-forest-50'
        }`}
      >
        <ShieldCheck className={`h-4 w-4 ${isActive ? 'text-forest-500' : 'text-timber-400'}`} />
        <span>
          {isActive
            ? `${tr('restSelected', lang)} ${count} ${tr('restCount', lang)}`
            : tr('restDefault', lang)}
        </span>
        {isActive && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-forest-500 px-1.5 text-[11px] font-bold text-cream-50">
            {count}
          </span>
        )}
        <ChevronDown
          className={`h-4 w-4 text-forest-300 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-[100] mt-2 w-72 origin-top-left rounded-2xl border border-stone-200 bg-white p-2 shadow-xl animate-scale-in">
          <div className="mb-1.5 flex items-center justify-between px-2 pt-1">
            <span className="text-xs font-bold uppercase tracking-[0.12em] text-timber-400">
              {tr('restHeading', lang)}
            </span>
            {isActive && (
              <button
                type="button"
                onClick={onClear}
                className="flex items-center gap-1 text-xs font-semibold text-terracotta-500 transition hover:text-terracotta-600"
              >
                <X className="h-3 w-3" />
                {tr('restClearAll', lang)}
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto scrollbar-hide">
            {RESTRICTIONS.map(({ code, key }) => {
              const checked = selected.has(code);
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => onToggle(code)}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left text-sm font-medium transition hover:bg-cream-100"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                      checked
                        ? 'border-forest-500 bg-forest-500 text-cream-50'
                        : 'border-cream-300 bg-white'
                    }`}
                  >
                    {checked && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </span>
                  <span className={checked ? 'text-forest-700' : 'text-forest-600'}>
                    {tr(key, lang)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
