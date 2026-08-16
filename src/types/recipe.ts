export type Lang = 'en' | 'zhCN' | 'zhTW';
export type ThemeMode = 'spring' | 'summer' | 'autumn' | 'winter';
export type ViewMode = 'photo' | 'compact' | 'simple';

export type DietaryTag =
  | 'vegetarian'
  | 'vegan'
  | 'gluten_free'
  | 'dairy_free'
  | 'keto_friendly'
  | 'high_protein'
  | 'low_calorie'
  | 'low_sodium'
  | 'toddler_friendly'
  | 'seasonal_produce'
  | 'international_flavor'
  | string;

export type RestrictionCode =
  | 'no_pork'
  | 'no_beef'
  | 'no_poultry'
  | 'no_seafood'
  | 'no_dairy'
  | 'no_eggs'
  | 'no_nuts'
  | 'no_gluten'
  | 'no_soy'
  | 'no_shellfish';

export interface LocalizedText {
  en?: string;
  zhCN?: string;
  zhTW?: string;
  zh?: string;
  [key: string]: string | undefined;
}

export interface Ingredient {
  name: string | LocalizedText;
  amount: string;
  amount_g?: number;
}

export interface Instruction {
  step: number;
  text: string | LocalizedText;
}

export interface Dish {
  id?: string;
  slug: string;
  title?: string | LocalizedText;
  title_zh?: string;
  title_en?: string;
  name?: string | LocalizedText;
  description?: string | LocalizedText;
  season: ThemeMode | 'all' | string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | string;
  cuisine: string;
  prep_time: string;
  calories: string;
  image_url: string;
  dietary_tags?: DietaryTag[];
  dietaryTags?: DietaryTag[];
  ingredients: Ingredient[];
  instructions: Instruction[];
  chef_tips?: string;
}

export type WeekPlan = (Dish | null)[][];