import { useEffect, useRef, useState } from 'react';
import { X, Download, Leaf, Link2, Check, Calendar, BookOpen } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { Dish, Lang, WeekPlan } from '@/types/recipe';
import { DAY_KEYS, MEAL_KEYS, tr } from '@/lib/i18n';
import { WhatsAppIcon, InstagramIcon, FacebookIcon, XIcon, WeChatIcon } from './SocialIcons';

interface ExportModalProps {
  lang: Lang;
  plan: WeekPlan;
  onClose: () => void;
}

const BRAND = 'SeasonalBite';
const BRAND_SUB = '時·食';
const CARD_FONT = 'Inter, "Noto Sans TC", "Noto Sans SC", sans-serif';
const CARD_SERIF = '"Cormorant Garamond", "LXGW WenKai TC", "Noto Serif TC", "Noto Sans TC", "Noto Sans SC", serif';

export default function ExportModal({ lang, plan, onClose }: ExportModalProps) {
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const bookletRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  function shareURL(platform: string) {
    const url = window.location.href;
    const text = encodeURIComponent(`${BRAND} ${BRAND_SUB} — ${tr('artisanalMenu', lang)}`);
    const map: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${text}%20${encodeURIComponent(url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      x: `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(url)}`,
    };
    if (platform === 'instagram' || platform === 'wechat') {
      copyLink();
      return;
    }
    window.open(map[platform], '_blank', 'noopener,noreferrer');
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const allDishes: { dish: Dish; dayIdx: number; mealIdx: number }[] = [];
  plan.forEach((day, dayIdx) => {
    day.forEach((dish, mealIdx) => {
      if (dish) allDishes.push({ dish, dayIdx, mealIdx });
    });
  });

  async function captureElement(
    el: HTMLDivElement,
    scale = 2,
  ): Promise<{ canvas: HTMLCanvasElement; imgData: string } | null> {
    const canvas = await html2canvas(el, {
      scale,
      useCORS: true,
      backgroundColor: '#FDFBF7',
    });
    return { canvas, imgData: canvas.toDataURL('image/jpeg', 0.92) };
  }

  async function downloadSummary() {
    if (!summaryRef.current) return;
    setGenerating(true);
    try {
      const result = await captureElement(summaryRef.current, 3);
      if (!result) return;
      const { imgData, canvas } = result;
      const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const imgH = (canvas.height * pageW) / canvas.width;
      if (imgH <= pageH) {
        pdf.addImage(imgData, 'JPEG', 0, 0, pageW, imgH);
      } else {
        pdf.addImage(imgData, 'JPEG', 0, 0, pageW, imgH);
      }
      pdf.save('SeasonalBite-Weekly-Summary.pdf');
    } catch {
      // ignore
    }
    setGenerating(false);
  }

  async function downloadBooklet() {
    if (!bookletRef.current) return;
    setGenerating(true);
    try {
      const cards = bookletRef.current.querySelectorAll<HTMLDivElement>('[data-pdf-card]');
      const pdf = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait' });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const cardW = pageW - margin * 2;
      let firstPage = true;

      for (let i = 0; i < cards.length; i++) {
        const result = await captureElement(cards[i], 2);
        if (!result) continue;
        const { canvas, imgData } = result;
        const imgH = (canvas.height * cardW) / canvas.width;

        if (!firstPage) pdf.addPage();
        firstPage = false;

        if (imgH <= pageH - margin * 2) {
          pdf.addImage(imgData, 'JPEG', margin, margin, cardW, imgH);
        } else {
          // Card taller than one page — split cleanly across page boundaries
          let heightLeft = imgH;
          let position = margin;
          pdf.addImage(imgData, 'JPEG', margin, position, cardW, imgH);
          heightLeft -= pageH - margin * 2;
          while (heightLeft > 0) {
            pdf.addPage();
            position = margin - (imgH - heightLeft);
            pdf.addImage(imgData, 'JPEG', margin, position, cardW, imgH);
            heightLeft -= pageH - margin * 2;
          }
        }
      }

      pdf.save('SeasonalBite-Full-Recipe-Booklet.pdf');
    } catch {
      // ignore
    }
    setGenerating(false);
  }

  const shareButtons: { platform: string; label: string; Icon: typeof WhatsAppIcon }[] = [
    { platform: 'whatsapp', label: 'WhatsApp', Icon: WhatsAppIcon },
    { platform: 'instagram', label: 'Instagram', Icon: InstagramIcon },
    { platform: 'facebook', label: 'Facebook', Icon: FacebookIcon },
    { platform: 'x', label: 'X', Icon: XIcon },
    { platform: 'wechat', label: 'WeChat', Icon: WeChatIcon },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-cream-50 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between border-b border-cream-200 bg-white px-6 py-4">
          <h2 className="font-serif text-xl font-bold text-forest-700">
            {tr('export', lang)}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-forest-400 transition hover:bg-cream-100 active:scale-90"
            aria-label={tr('close', lang)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Two download options */}
        <div className="grid gap-4 border-b border-cream-200 bg-white px-6 py-5 sm:grid-cols-2">
          <button
            type="button"
            onClick={downloadSummary}
            disabled={generating || allDishes.length === 0}
            className="group flex flex-col items-start gap-2 rounded-2xl border-2 border-cream-200 bg-cream-50 p-5 text-left transition hover:border-forest-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-forest-500 text-cream-50">
              <Calendar className="h-5 w-5" />
            </span>
            <span className="font-serif text-base font-bold text-forest-700">
              {tr('downloadSummary', lang)}
            </span>
            <span className="text-xs text-timber-400">{tr('summaryDesc', lang)}</span>
          </button>

          <button
            type="button"
            onClick={downloadBooklet}
            disabled={generating || allDishes.length === 0}
            className="group flex flex-col items-start gap-2 rounded-2xl border-2 border-cream-200 bg-cream-50 p-5 text-left transition hover:border-forest-200 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-500 text-white">
              <BookOpen className="h-5 w-5" />
            </span>
            <span className="font-serif text-base font-bold text-forest-700">
              {tr('downloadBooklet', lang)}
            </span>
            <span className="text-xs text-timber-400">{tr('bookletDesc', lang)}</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide bg-cream-100 p-6">
          {/* === Summary Grid (hidden, for PDF capture) === */}
          <div style={{ position: 'absolute', left: -9999, top: 0 }}>
            <div
              ref={summaryRef}
              data-pdf-card
              className="bg-white"
              style={{ width: '794px', fontFamily: CARD_FONT }}
            >
              <SummaryGridContent lang={lang} plan={plan} />
            </div>
          </div>

          {/* === Booklet cards (hidden, for PDF capture) === */}
          <div style={{ position: 'absolute', left: -9999, top: 0 }}>
            <div ref={bookletRef} className="space-y-4" style={{ width: '794px' }}>
              {/* Page 1: summary grid */}
              <div data-pdf-card className="bg-white" style={{ width: '794px', fontFamily: CARD_FONT }}>
                <SummaryGridContent lang={lang} plan={plan} />
              </div>
              {/* Per-dish cards */}
              {allDishes.map(({ dish, dayIdx, mealIdx }, idx) => (
                <DishCardContent
                  key={idx}
                  dish={dish}
                  lang={lang}
                  dayIdx={dayIdx}
                  mealIdx={mealIdx}
                />
              ))}
            </div>
          </div>

          {/* Visible preview: summary grid */}
          <div className="mx-auto max-w-md">
            <p className="mb-3 text-center text-xs font-bold uppercase tracking-[0.15em] text-timber-400">
              {tr('downloadSummary', lang)}
            </p>
            <div
              className="overflow-hidden rounded-2xl border-2 border-cream-200 bg-white shadow-lg"
              style={{ fontFamily: CARD_FONT }}
            >
              <SummaryGridContent lang={lang} plan={plan} />
            </div>
          </div>
        </div>

        {/* Share actions */}
        <div className="border-t border-cream-200 bg-white px-6 py-5">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-timber-400">
            {tr('shareVia', lang)}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {shareButtons.map(({ platform, label, Icon }) => (
              <button
                key={platform}
                type="button"
                onClick={() => shareURL(platform)}
                disabled={generating}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-cream-100 text-forest-600 transition hover:bg-forest-500 hover:text-cream-50 active:scale-90 disabled:opacity-50"
                aria-label={label}
                title={label}
              >
                <Icon className="h-5 w-5" />
              </button>
            ))}

            <button
              type="button"
              onClick={copyLink}
              className="flex h-11 items-center gap-2 rounded-full bg-cream-100 px-4 text-sm font-bold text-forest-600 transition hover:bg-forest-500 hover:text-cream-50 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-gold-500" />
                  {tr('copied', lang)}
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" />
                  {tr('copyLink', lang)}
                </>
              )}
            </button>

            {generating && (
              <span className="ml-auto flex items-center gap-2 text-sm font-semibold text-timber-400">
                <Download className="h-4 w-4 animate-bounce" />
                {tr('generating', lang)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Summary Grid — single-page 7-day overview ===== */
function SummaryGridContent({ lang, plan }: { lang: Lang; plan: WeekPlan }) {
  return (
    <div className="p-8" style={{ color: '#1B4332' }}>
      {/* Brand header */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="flex items-center gap-2">
          <Leaf className="h-6 w-6" style={{ color: '#1B4332' }} />
          <h1 className="font-serif text-3xl font-bold" style={{ color: '#1B4332' }}>
            {BRAND}
          </h1>
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.25em]" style={{ color: '#B89354' }}>
          {BRAND_SUB}
        </p>
        <div className="my-3 h-px w-full" style={{ background: 'linear-gradient(to right, transparent, #E5A516, transparent)' }} />
        <p className="font-serif text-sm italic" style={{ color: '#B89354' }}>
          {tr('freshFromFarm', lang)}
        </p>
      </div>

      {/* 7-day grid */}
      <div className="space-y-2">
        {plan.map((day, dayIdx) => (
          <div
            key={dayIdx}
            className="flex items-stretch gap-2 rounded-lg border p-2"
            style={{ borderColor: '#E8DFCE' }}
          >
            <div
              className="flex w-20 shrink-0 flex-col items-center justify-center rounded-md py-1.5"
              style={{ background: '#1B4332' }}
            >
              <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: '#FDFBF7' }}>
                Day {dayIdx + 1}
              </span>
              <span className="font-serif text-xs font-bold" style={{ color: '#FDFBF7' }}>
                {tr(DAY_KEYS[dayIdx], lang)}
              </span>
            </div>
            <div className="flex flex-1 gap-2">
              {day.map((dish, mealIdx) => (
                <div
                  key={mealIdx}
                  className="flex-1 rounded-md border p-1.5"
                  style={{ borderColor: '#E8DFCE', background: '#FDFBF7' }}
                >
                  <div className="mb-0.5 text-[8px] font-bold uppercase tracking-wide" style={{ color: '#B89354' }}>
                    {tr(MEAL_KEYS[mealIdx], lang)}
                  </div>
                  <div className="font-serif text-xs font-bold leading-tight" style={{ color: '#1B4332' }}>
                    {dish ? dish.name[lang] : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer watermark — exactly one */}
      <div className="mt-6 flex items-center justify-center gap-1.5 border-t pt-3" style={{ borderColor: '#E8DFCE' }}>
        <Leaf className="h-3 w-3" style={{ color: '#1B4332' }} />
        <span className="font-serif text-[10px] italic" style={{ color: '#B89354' }}>
          {BRAND} {BRAND_SUB}
        </span>
      </div>
    </div>
  );
}

/* ===== Dish Card — one full recipe per card ===== */
function DishCardContent({
  dish,
  lang,
  dayIdx,
  mealIdx,
}: {
  dish: Dish;
  lang: Lang;
  dayIdx: number;
  mealIdx: number;
}) {
  return (
    <div
      data-pdf-card
      className="overflow-hidden rounded-2xl border-2 bg-white"
      style={{ borderColor: '#E8DFCE', fontFamily: CARD_FONT }}
    >
      {/* Photo header */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={dish.photo_url}
          alt={dish.name[lang]}
          crossOrigin="anonymous"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.15), transparent)' }} />
        <div
          className="absolute left-3 top-3 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
          style={{ background: 'rgba(27,67,50,0.9)', color: '#FDFBF7' }}
        >
          {tr(DAY_KEYS[dayIdx], lang)} · {tr(MEAL_KEYS[mealIdx], lang)}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-serif text-xl font-bold" style={{ color: '#FDFBF7' }}>
            {dish.name[lang]}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-5" style={{ color: '#1B4332' }}>
        <p className="mb-4 text-sm italic" style={{ color: '#B89354' }}>
          {dish.description[lang]}
        </p>

        {/* Ingredients */}
        <div className="mb-4">
          <div className="mb-2 flex items-center gap-1.5 border-b pb-1.5" style={{ borderColor: '#E8DFCE' }}>
            <Leaf className="h-4 w-4" style={{ color: '#1B4332' }} />
            <h4 className="font-serif text-sm font-bold uppercase tracking-wide">
              {tr('ingredients', lang)}
            </h4>
          </div>
          <div className="space-y-1">
            {dish.ingredients.map((ing, iIdx) => (
              <div
                key={iIdx}
                className="flex items-baseline justify-between border-b border-dotted pb-1"
                style={{ borderColor: '#F2EBDE' }}
              >
                <span className="text-sm">{ing.name[lang]}</span>
                <span className="whitespace-nowrap font-serif text-sm font-bold" style={{ color: '#E5A516' }}>
                  {ing.amount_g}{tr('grams', lang)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Steps */}
        <div>
          <h4 className="mb-2 border-b pb-1.5 font-serif text-sm font-bold uppercase tracking-wide" style={{ borderColor: '#E8DFCE' }}>
            {tr('steps', lang)}
          </h4>
          <ol className="space-y-1.5">
            {dish.steps.map((step, sIdx) => (
              <li key={sIdx} className="flex gap-2.5">
                <span className="font-serif text-sm font-bold" style={{ color: '#E5A516' }}>
                  {sIdx + 1}.
                </span>
                <span className="text-sm leading-relaxed">{step[lang]}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Single footer watermark */}
        <div className="mt-4 flex items-center justify-center gap-1.5 border-t pt-2.5" style={{ borderColor: '#E8DFCE' }}>
          <Leaf className="h-3 w-3" style={{ color: '#1B4332' }} />
          <span className="font-serif text-[10px] italic" style={{ color: '#B89354' }}>
            {BRAND} {BRAND_SUB}
          </span>
        </div>
      </div>
    </div>
  );
}
