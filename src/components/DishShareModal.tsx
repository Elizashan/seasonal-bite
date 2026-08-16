import { useEffect, useRef, useState } from 'react';
import { X, Download, Leaf, Link2, Check } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import type { Dish, Lang } from '@/types/recipe';
import { tr } from '@/lib/i18n';
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from './SocialIcons';

interface DishShareModalProps {
  dish: Dish;
  lang: Lang;
  onClose: () => void;
}

const BRAND = 'SeasonalBite';
const BRAND_SUB = '時·食';

export default function DishShareModal({ dish, lang, onClose }: DishShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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

  function buildShareText(): string {
    const ingredients = dish.ingredients
      .map((i) => `${i.amount_g}g ${i.name[lang]}`)
      .join('、');
    return `${BRAND} ${BRAND_SUB} — ${dish.name[lang]}\n${tr('ingredients', lang)}: ${ingredients}`;
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(buildShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener,noreferrer');
  }

  function shareFacebook() {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
      '_blank',
      'noopener,noreferrer',
    );
  }

  function shareInstagram() {
    downloadImage();
  }

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  async function captureCard(): Promise<HTMLCanvasElement | null> {
    if (!cardRef.current) return null;
    return html2canvas(cardRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#FDFBF7',
    });
  }

  async function downloadImage() {
    setDownloading(true);
    try {
      const canvas = await captureCard();
      if (canvas) {
        const link = document.createElement('a');
        link.download = `${dish.slug}-seasonalbite.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
    } catch {
      // ignore
    }
    setDownloading(false);
  }

  async function downloadPdf() {
    setDownloading(true);
    try {
      const canvas = await captureCard();
      if (canvas) {
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 595;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
        const pageHeight = pdf.internal.pageSize.getHeight();
        if (imgHeight <= pageHeight) {
          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        } else {
          let remaining = imgHeight;
          let position = 0;
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          remaining -= pageHeight;
          while (remaining > 0) {
            position -= pageHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            remaining -= pageHeight;
          }
        }
        pdf.save(`${dish.slug}-seasonalbite.pdf`);
      }
    } catch {
      // ignore
    }
    setDownloading(false);
  }

  const shareButtons: { label: string; onClick: () => void; Icon: typeof WhatsAppIcon }[] = [
    { label: 'WhatsApp', onClick: shareWhatsApp, Icon: WhatsAppIcon },
    { label: 'Instagram', onClick: shareInstagram, Icon: InstagramIcon },
    { label: 'Facebook', onClick: shareFacebook, Icon: FacebookIcon },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-3xl bg-cream-50 shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between border-b border-cream-200 bg-white px-6 py-4">
          <h2 className="font-serif text-xl font-bold text-forest-700">{tr('shareDish', lang)}</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-forest-400 transition hover:bg-cream-100 active:scale-90"
            aria-label={tr('close', lang)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide bg-cream-100 p-6">
          {/* Dish card preview */}
          <div
            ref={cardRef}
            className="mx-auto max-w-sm overflow-hidden rounded-2xl border-2 border-cream-200 bg-cream-50 shadow-xl"
            style={{ fontFamily: '"Cormorant Garamond", "LXGW WenKai TC", "Noto Serif TC", "Noto Sans TC", "Noto Sans SC", serif' }}
          >
            <div className="relative h-40 overflow-hidden">
              <img
                src={dish.photo_url}
                alt={dish.name[lang]}
                crossOrigin="anonymous"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-serif text-xl font-bold text-ondark drop-shadow-sm">
                  {dish.name[lang]}
                </h3>
                <p className="whitespace-nowrap text-xs text-ondark-muted">
                  {dish.cuisine} · {dish.prep_time_min}{tr('minutes', lang)}
                </p>
              </div>
            </div>

            <div className="p-5">
              <p className="mb-4 text-sm italic text-timber-400">{dish.description[lang]}</p>

              <div className="mb-4">
                <div className="mb-2 flex items-center gap-1.5">
                  <Leaf className="h-4 w-4 text-forest-400" />
                  <h4 className="font-serif text-sm font-bold text-forest-700">
                    {tr('ingredients', lang)}
                  </h4>
                </div>
                <div className="space-y-1.5">
                  {dish.ingredients.map((ing, idx) => (
                    <div
                      key={idx}
                      className="flex items-baseline justify-between border-b border-dashed border-cream-200 pb-1.5"
                    >
                      <span className="text-sm text-forest-600">{ing.name[lang]}</span>
                      <span className="whitespace-nowrap font-serif text-sm font-bold text-gold-600">
                        {ing.amount_g}{tr('grams', lang)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="mb-2 font-serif text-sm font-bold text-forest-700">
                  {tr('preparation', lang)}
                </h4>
                <ol className="space-y-1.5">
                  {dish.steps.map((step, idx) => (
                    <li key={idx} className="flex gap-2.5">
                      <span className="font-serif text-sm font-bold text-gold-500">{idx + 1}.</span>
                      <span className="text-sm leading-relaxed text-forest-600">{step[lang]}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="mt-5 flex items-center justify-center gap-1.5 border-t border-cream-200 pt-3">
                <Leaf className="h-3.5 w-3.5 text-forest-400" />
                <span className="font-serif text-xs italic text-timber-300">
                  {BRAND} {BRAND_SUB}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-cream-200 bg-white px-6 py-5">
          <div className="flex flex-wrap items-center gap-3">
            {shareButtons.map(({ label, onClick, Icon }) => (
              <button
                key={label}
                type="button"
                onClick={onClick}
                disabled={downloading}
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

            <button
              type="button"
              onClick={downloadImage}
              disabled={downloading}
              className="ml-auto flex h-11 items-center gap-2 rounded-full bg-forest-500 px-5 text-sm font-bold text-cream-50 shadow-md transition hover:bg-forest-600 active:scale-95 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              {tr('downloadImage', lang)}
            </button>
          </div>

          <button
            type="button"
            onClick={downloadPdf}
            disabled={downloading}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-2.5 text-sm font-bold text-white shadow-md transition hover:bg-gold-600 active:scale-95 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {tr('downloadPdf', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
