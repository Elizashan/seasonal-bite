import type { ThemeMode } from '@/types/recipe';

interface BackgroundProps {
  theme: ThemeMode;
}

const SEASON_CONFIG: Record<
  ThemeMode,
  { image: string; overlay: string; opacity: string }
> = {
  spring: {
    image:
      'https://images.pexels.com/photos/37507631/pexels-photo-37507631.jpeg?auto=compress&cs=tinysrgb&w=1600',
    overlay: '250 252 248',
    opacity: '0.92',
  },
  summer: {
    image:
      'https://images.pexels.com/photos/11679739/pexels-photo-11679739.jpeg?auto=compress&cs=tinysrgb&w=1600',
    overlay: '219 225 204',
    opacity: '0.90',
  },
  autumn: {
    image:
      'https://images.pexels.com/photos/25478458/pexels-photo-25478458.jpeg?auto=compress&cs=tinysrgb&w=1600',
    overlay: '252 247 236',
    opacity: '0.91',
  },
  winter: {
    image:
      'https://images.pexels.com/photos/9974693/pexels-photo-9974693.jpeg?auto=compress&cs=tinysrgb&w=1600',
    overlay: '241 240 241',
    opacity: '0.93',
  },
};

export default function Background({ theme }: BackgroundProps) {
  const config = SEASON_CONFIG[theme];

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Real farm/garden background image */}
      <div
        className="absolute inset-0 bg-cover bg-fixed bg-center"
        style={{
          backgroundImage: `url('${config.image}')`,
        }}
      />
      {/* Translucent overlay so content stays readable */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: `rgb(${config.overlay} / ${config.opacity})`,
        }}
      />
    </div>
  );
}
