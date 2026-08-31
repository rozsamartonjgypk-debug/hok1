/*
# HÖK App: news és events táblák létrehozása (single-tenant, publikus)

## Áttekintés
Ez a migráció létrehozza a HÖK App prototípushoz szükséges két táblát:
hírek (news) és események (events). Az alkalmazás single-tenant: nincs
bejelentkezés, az admin felület egy hardcoded jelszóval van védve, így az
adatok szándékosan publikusak/megosztottak. A frontend az anon kulccsal
 kommunikál, ezért minden policy tartalmazza az `anon` szerepkört.

## Új táblák

### 1. `news` (hírek)
- `id` (uuid, elsődleges kulcs, automatikusan generált)
- `title` (text, nem null) – a hír címe
- `category` (text, nem null) – kategória (pl. Ösztöndíj, Buli, Tanulmány)
- `excerpt` (text, nem null) – rövid kivonat
- `date` (date, nem null) – a hír dátuma
- `image` (text, nem null) – kép URL
- `featured` (boolean, alapértelmezett false) – kiemelt hír-e
- `created_at` (timestamptz, alapértelmezett now) – létrehozás ideje

### 2. `events` (események)
- `id` (uuid, elsődleges kulcs, automatikusan generált)
- `title` (text, nem null) – esemény neve
- `date` (date, nem null) – esemény dátuma
- `time` (text, nem null) – időpont (óra:perc, pl. 20:00)
- `location` (text, nem null) – helyszín
- `interested` (integer, alapértelmezett 0) – érdeklődők száma
- `created_at` (timestamptz, alapértelmezett now) – létrehozás ideje

## Biztonság (RLS)
- Mindkét táblán engedélyezve van a Row Level Security.
- Mivel az adat single-tenant és szándékosan publikus, minden CRUD művelet
  engedélyezve van az `anon, authenticated` szerepkörök számára
  (`USING (true)` / `WITH CHECK (true)`). Ez a prototípusnál elfogadható,
  mert nincs felhasználói fiók és az adat megosztott.

## Indexek
- `news` táblán index a `date` oszlopra (csökkenő), a hírfolyam rendezéséhez.
- `events` táblán index a `date` oszlopra (növekvő), az eseménylista rendezéséhez.

## Fontos megjegyzések
1. A táblák idempotens módon jönnek létre (`IF NOT EXISTS`).
2. A policy-k először `DROP POLICY IF EXISTS`-szel eldobásra kerülnek,
   így a migráció biztonságosan újrafuttatható.
3. Seed adatok: a prototípus magyar minta hírei és eseményei bekerülnek,
   ha a táblák üresek.
*/

-- ============================================================
-- NEWS tábla
-- ============================================================
CREATE TABLE IF NOT EXISTS news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL,
  excerpt text NOT NULL,
  date date NOT NULL,
  image text NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_news" ON news;
CREATE POLICY "anon_select_news" ON news FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_news" ON news;
CREATE POLICY "anon_insert_news" ON news FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_news" ON news;
CREATE POLICY "anon_update_news" ON news FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_news" ON news;
CREATE POLICY "anon_delete_news" ON news FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS news_date_idx ON news (date DESC);

-- ============================================================
-- EVENTS tábla
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  location text NOT NULL,
  interested integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_events" ON events;
CREATE POLICY "anon_select_events" ON events FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_events" ON events;
CREATE POLICY "anon_insert_events" ON events FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_events" ON events;
CREATE POLICY "anon_update_events" ON events FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_events" ON events;
CREATE POLICY "anon_delete_events" ON events FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS events_date_idx ON events (date ASC);

-- ============================================================
-- SEED: magyar mintaadatok (csak ha a táblák üresek)
-- ============================================================
INSERT INTO news (title, category, excerpt, date, image, featured)
SELECT
  'Megnyílt a tavaszi ösztöndíjpályázat – leadási határidő április 15.',
  'Ösztöndíj',
  'A Hallgatói Önkormányzat tavaszi szociális és tanulmányi ösztöndíjpályázata elindult. A Neptunban tölthetitek fel a dokumentumokat, a bírálói javaslatokat a kari bizottság állítja össze.',
  '2026-03-28',
  'https://images.pexels.com/photos/7972324/pexels-photo-7972324.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  true
WHERE NOT EXISTS (SELECT 1 FROM news);

INSERT INTO news (title, category, excerpt, date, image, featured)
SELECT
  'Gólyabuli 2026 – jegyek már kaphatók a Diákigazolványban',
  'Buli',
  'Idén is megrendezzük a kari gólyabulit a klubban. A jegyek 1500 Ft, Diákigazolvánnyal válthatóak a HÖK irodában.',
  '2026-03-25',
  'https://images.pexels.com/photos/36882728/pexels-photo-36882728.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  false
WHERE NOT EXISTS (SELECT 1 FROM news);

INSERT INTO news (title, category, excerpt, date, image, featured)
SELECT
  'Vizsgaidőszak: meghosszabbított nyitvatartás a könyvtárban',
  'Tanulmány',
  'A egyetemi könyvtár a vizsgaidőszakban 0–24 órában tart nyitva. A csendes olvasóterem foglalható tanulóhelyekkel vár.',
  '2026-03-22',
  'https://images.pexels.com/photos/5538594/pexels-photo-5538594.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  false
WHERE NOT EXISTS (SELECT 1 FROM news);

INSERT INTO news (title, category, excerpt, date, image, featured)
SELECT
  'Kollégiumi felvételi – új eljárásrend 2026 őszétől',
  'Kollégium',
  'A kollégiumi felvételi pontszámítás új szempontokat vesz figyelembe. A jelentkezési határidő június 30.',
  '2026-03-18',
  'https://images.pexels.com/photos/37762503/pexels-photo-37762503.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  false
WHERE NOT EXISTS (SELECT 1 FROM news);

INSERT INTO news (title, category, excerpt, date, image, featured)
SELECT
  'Tisztújítás: indul a HÖK delegáltválasztás',
  'Közlemény',
  'A hallgatói delegáltak választása április 5-én zajlik. Jelöltek jelentkezését a választási bizottság várja március 31-ig.',
  '2026-03-15',
  'https://images.pexels.com/photos/6147143/pexels-photo-6147143.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  false
WHERE NOT EXISTS (SELECT 1 FROM news);

-- Events seed
INSERT INTO events (title, date, time, location, interested)
SELECT * FROM (VALUES
  ('Gólyabuli 2026', '2026-04-04'::date, '20:00', 'Kari Klub, egyetem utca 2.', 342),
  ('Tavaszi Szakmai Nap – Állásbörce', '2026-04-10'::date, '10:00', 'A épület, földszinti aula', 128),
  ('HÖK Közgyűlés', '2026-04-16'::date, '17:30', 'Nagyelőadó, B épület', 64),
  ('Vizsgaidőszak kezdete', '2026-05-05'::date, '08:00', 'Egyetem (több helyszín)', 501),
  ('Diplomaosztó ünnepség', '2026-06-27'::date, '11:00', 'Sportcsarnok, campus', 276)
) AS v(title, date, time, location, interested)
WHERE NOT EXISTS (SELECT 1 FROM events);
