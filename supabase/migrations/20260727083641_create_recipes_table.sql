/*
# Create recipes table for SeasonalBite

## What this does
SeasonalBite is a kid-friendly seasonal recipe finder for parents cooking with
4-year-olds. It stores a curated set of simple, age-appropriate recipes organized
by season. There are no user accounts — every visitor browses the same shared
recipe collection, so the table is intentionally public-readable.

## New table: recipes
- id           (uuid, primary key)
- title        (text, name of the dish, e.g. "Strawberry Yogurt Cups")
- season       (text, one of 'spring' | 'summer' | 'fall' | 'winter', enforced by CHECK)
- emoji        (text, a single emoji shown on the recipe card)
- description  (text, one-line kid-friendly summary)
- ingredients  (text[], list of ingredients shown before the steps)
- steps        (jsonb, ordered array of { text, emoji } step cards in simple English)
- prep_time_min(int, approximate hands-on time in minutes)
- created_at   (timestamptz, defaults to now)

A UNIQUE constraint on (title, season) makes the seed insert idempotent so the
migration is safe to re-run after a timeout without creating duplicate recipes.

## Security
- Row Level Security is ENABLED on recipes.
- Because this is a no-account, single-tenant app, the data is intentionally
  public/shared. Four separate policies allow anon + authenticated to SELECT,
  INSERT, UPDATE, and DELETE. SELECT is intentionally open (USING (true)) so the
  anon-key frontend can read the shared recipe list. Write policies are also open
  to keep the seed and any future admin tooling simple; this is acceptable because
  the table holds only public recipe content, no private user data.
*/

CREATE TABLE IF NOT EXISTS recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  season text NOT NULL CHECK (season IN ('spring','summer','fall','winter')),
  emoji text NOT NULL,
  description text NOT NULL,
  ingredients text[] NOT NULL DEFAULT '{}',
  steps jsonb NOT NULL DEFAULT '[]'::jsonb,
  prep_time_min int NOT NULL DEFAULT 15,
  created_at timestamptz DEFAULT now(),
  UNIQUE (title, season)
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_recipes" ON recipes;
CREATE POLICY "anon_select_recipes" ON recipes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_recipes" ON recipes;
CREATE POLICY "anon_insert_recipes" ON recipes FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_recipes" ON recipes;
CREATE POLICY "anon_update_recipes" ON recipes FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_recipes" ON recipes;
CREATE POLICY "anon_delete_recipes" ON recipes FOR DELETE
  TO anon, authenticated USING (true);

-- Seed data: simple, age-appropriate recipes for each season.
-- Steps use one short English sentence each with a guiding emoji.
INSERT INTO recipes (title, season, emoji, description, ingredients, steps, prep_time_min) VALUES
-- SPRING
('Strawberry Yogurt Cups', 'spring', '🍓', 'Sweet strawberries folded into creamy yogurt.',
  ARRAY['Fresh strawberries','Plain yogurt','A little honey'],
  '[{"emoji":"🧼","text":"Wash your hands with soap and water."},{"emoji":"🍓","text":"Rinse the strawberries under cool water."},{"emoji":"🍃","text":"Pull the green tops off the strawberries."},{"emoji":"🔪","text":"Ask a grown-up to slice the strawberries."},{"emoji":"🥄","text":"Spoon yogurt into a small cup."},{"emoji":"🍓","text":"Drop the strawberry slices on top."},{"emoji":"🍯","text":"Add a tiny drizzle of honey."},{"emoji":"😋","text":"Enjoy your yummy cup!"}]'::jsonb,
  10),
('Cucumber Sandwiches', 'spring', '🥒', 'Crunchy cucumber on soft bread.',
  ARRAY['Bread','Cucumber','Cream cheese'],
  '[{"emoji":"🧼","text":"Wash your hands with soap and water."},{"emoji":"🥒","text":"Rinse the cucumber under cool water."},{"emoji":"🔪","text":"Ask a grown-up to slice the cucumber into rounds."},{"emoji":"🍞","text":"Lay two slices of bread on a plate."},{"emoji":"🧀","text":"Spread cream cheese on the bread."},{"emoji":"🥒","text":"Place cucumber rounds on top."},{"emoji":"🍞","text":"Put the other bread slice on top."},{"emoji":"😋","text":"Cut and eat your sandwich!"}]'::jsonb,
  10),
-- SUMMER
('Watermelon Pops', 'summer', '🍉', 'Cold watermelon on a stick.',
  ARRAY['Watermelon','Popsicle sticks'],
  '[{"emoji":"🧼","text":"Wash your hands with soap and water."},{"emoji":"🍉","text":"Ask a grown-up to cut the watermelon into triangles."},{"emoji":"🪡","text":"Push a stick into the bottom of each triangle."},{"emoji":"🍽️","text":"Lay the pops flat on a tray."},{"emoji":"❄️","text":"Put the tray in the freezer for two hours."},{"emoji":"🍉","text":"Take one out when it is cold and firm."},{"emoji":"😋","text":"Lick your frosty watermelon pop!"}]'::jsonb,
  10),
('Tomato Toast', 'summer', '🍅', 'Ripe tomato rubbed on warm toast.',
  ARRAY['Bread','A ripe tomato','Olive oil','A pinch of salt'],
  '[{"emoji":"🧼","text":"Wash your hands with soap and water."},{"emoji":"🍅","text":"Rinse the tomato under cool water."},{"emoji":"🍞","text":"Ask a grown-up to toast the bread."},{"emoji":"🫒","text":"Drizzle a little olive oil on the toast."},{"emoji":"🍅","text":"Rub the tomato half on the toast until juicy."},{"emoji":"🧂","text":"Add a tiny pinch of salt."},{"emoji":"😋","text":"Eat your sunny tomato toast!"}]'::jsonb,
  8),
-- FALL
('Apple Slices with Dip', 'fall', '🍎', 'Crisp apple slices with creamy dip.',
  ARRAY['An apple','Plain yogurt','A little cinnamon'],
  '[{"emoji":"🧼","text":"Wash your hands with soap and water."},{"emoji":"🍎","text":"Rinse the apple under cool water."},{"emoji":"🔪","text":"Ask a grown-up to slice the apple."},{"emoji":"🥣","text":"Spoon yogurt into a small bowl."},{"emoji":"🌰","text":"Sprinkle a little cinnamon on the yogurt."},{"emoji":"🥄","text":"Stir the yogurt with a spoon."},{"emoji":"🍎","text":"Dip an apple slice and take a bite!"}]'::jsonb,
  8),
('Pumpkin Soup', 'fall', '🎃', 'Warm and cozy pumpkin soup.',
  ARRAY['Pumpkin puree','Milk','A pinch of salt'],
  '[{"emoji":"🧼","text":"Wash your hands with soap and water."},{"emoji":"🥣","text":"Spoon pumpkin puree into a pot."},{"emoji":"🥛","text":"Pour in a splash of milk."},{"emoji":"🥄","text":"Stir everything together slowly."},{"emoji":"🔥","text":"Ask a grown-up to warm it on the stove."},{"emoji":"🧂","text":"Add a tiny pinch of salt and stir."},{"emoji":"🍲","text":"Pour the warm soup into a bowl."},{"emoji":"😋","text":"Sip your cozy pumpkin soup!"}]'::jsonb,
  12),
-- WINTER
('Warm Banana Oats', 'winter', '🍌', 'Soft oats with sweet banana.',
  ARRAY['Oats','Milk','A ripe banana'],
  '[{"emoji":"🧼","text":"Wash your hands with soap and water."},{"emoji":"🥣","text":"Spoon oats into a bowl."},{"emoji":"🥛","text":"Pour in enough milk to cover the oats."},{"emoji":"🍌","text":"Peel the banana and put it in the bowl."},{"emoji":"🔥","text":"Ask a grown-up to warm it in the microwave."},{"emoji":"🥄","text":"Mash the banana with a fork and stir."},{"emoji":"😋","text":"Eat your warm and cozy oats!"}]'::jsonb,
  8),
('Cheesy Toast', 'winter', '🧀', 'Melted cheese on warm bread.',
  ARRAY['Bread','Cheese slices'],
  '[{"emoji":"🧼","text":"Wash your hands with soap and water."},{"emoji":"🍞","text":"Lay a slice of bread on a plate."},{"emoji":"🧀","text":"Place a cheese slice on the bread."},{"emoji":"🔥","text":"Ask a grown-up to melt it in the oven."},{"emoji":"⏳","text":"Wait until the cheese is bubbly."},{"emoji":"🍲","text":"Use a mitt to move it to a plate."},{"emoji":"😋","text":"Eat your melty cheesy toast!"}]'::jsonb,
  7)
ON CONFLICT (title, season) DO NOTHING;
