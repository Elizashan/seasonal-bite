import { useEffect, useRef, useState } from 'react';
import { Globe, ChevronDown, Check, Leaf, Flower2, Sun, Wheat, Snowflake } from 'lucide-react';
import type { Lang, ThemeMode } from '@/types/recipe';
import { LANGUAGES, THEMES, tr } from '@/lib/i18n';

interface NavbarProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
}

const THEME_ICONS: Record<string, typeof Leaf> = {
  Flower2,
  Sun,
  Wheat,
  Snowflake,
};

export default function Navbar({ lang, onLangChange, theme, onThemeChange }: NavbarProps) {
  const [langOpen, setLangOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const themeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) setThemeOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === lang)!;
  const currentTheme = THEMES.find((t) => t.code === theme)!;
  const CurrentThemeIcon = THEME_ICONS[currentTheme.emoji] ?? Leaf;

  return (
    <header className="sticky top-0 z-40 border-b border-cream-200 bg-cream-50/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Dual-language logo */}
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-500 text-cream-50 shadow-sm">
            <Leaf className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-serif text-xl font-bold tracking-tight text-forest-600">
              {tr('brand', lang)}
            </span>
            <span className="text-forest-300">|</span>
            <span
              className="text-lg font-bold tracking-wide text-timber-400"
              style={{
                fontFamily: '"LXGW WenKai TC", "Noto Serif TC", serif',
              }}
            >
              {tr('brandSub', lang)}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Season theme switcher */}
          <div className="relative" ref={themeRef}>
            <button
              type="button"
              onClick={() => setThemeOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-cream-300 bg-white px-3.5 py-2 text-sm font-semibold text-forest-600 transition hover:border-forest-200 hover:bg-forest-50 active:scale-95"
              aria-expanded={themeOpen}
              aria-label={tr('theme', lang)}
            >
              <CurrentThemeIcon className="h-4 w-4 text-forest-400" />
              <span className="hidden sm:inline">{tr(currentTheme.key, lang)}</span>
              <ChevronDown
                className={`h-4 w-4 text-forest-300 transition-transform ${themeOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {themeOpen && (
              <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-cream-200 bg-white p-1.5 shadow-xl animate-scale-in">
                {THEMES.map((th) => {
                  const Icon = THEME_ICONS[th.emoji] ?? Leaf;
                  return (
                    <button
                      key={th.code}
                      type="button"
                      onClick={() => {
                        onThemeChange(th.code);
                        setThemeOpen(false);
                      }}
                      className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-cream-100"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-forest-400" />
                        <span className="text-forest-600">{tr(th.key, lang)}</span>
                      </div>
                      {th.code === theme && <Check className="h-4 w-4 text-gold-500" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Language switcher */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-cream-300 bg-white px-4 py-2 text-sm font-semibold text-forest-600 transition hover:border-forest-200 hover:bg-forest-50 active:scale-95"
              aria-expanded={langOpen}
              aria-label={tr('language', lang)}
            >
              <Globe className="h-4 w-4 text-forest-400" />
              <span>{currentLang.native}</span>
              <ChevronDown
                className={`h-4 w-4 text-forest-300 transition-transform ${langOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-52 origin-top-right rounded-2xl border border-cream-200 bg-white p-1.5 shadow-xl animate-scale-in">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => {
                      onLangChange(l.code);
                      setLangOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition hover:bg-cream-100"
                  >
                    <div>
                      <div className="text-forest-600">{l.native}</div>
                      <div className="text-xs font-medium text-timber-400">{l.label}</div>
                    </div>
                    {l.code === lang && <Check className="h-4 w-4 text-gold-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
