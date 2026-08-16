import type { ThemeMode } from '@/types/recipe';

export function isSouthernHemisphere(): boolean {
  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const southernKeywords = [
      'Australia', 'Antarctica', 'Auckland', 'Chatham', 'Johannesburg',
      'Santiago', 'Buenos_Aires', 'Sao_Paulo', 'Lima', 'Montevideo',
      'Windhoek', 'Maputo', 'Harare', 'Perth', 'Sydney', 'Melbourne', 'Brisbane'
    ];
    return southernKeywords.some((keyword) => timeZone.includes(keyword));
  } catch {
    return false;
  }
}

export function detectUserSeason(): ThemeMode {
  const month = new Date().getMonth();
  const southern = isSouthernHemisphere();

  if (month >= 2 && month <= 4) return southern ? 'autumn' : 'spring';
  if (month >= 5 && month <= 7) return southern ? 'winter' : 'summer';
  if (month >= 8 && month <= 10) return southern ? 'spring' : 'autumn';
  return southern ? 'summer' : 'winter';
}