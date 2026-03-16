-- ============================================
-- MONO Blog — Supabase Schema
-- Jalankan ini di: Supabase Dashboard → SQL Editor → New Query
-- ============================================

-- Tabel posts
create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  slug        text not null unique,
  excerpt     text not null default '',
  content     text not null default '',
  date        date not null default current_date,
  published   boolean not null default false,
  tags        text[] not null default '{}',
  created_at  timestamptz not null default now()
);

-- Index untuk performa
create index if not exists posts_slug_idx      on public.posts (slug);
create index if not exists posts_published_idx on public.posts (published);
create index if not exists posts_date_idx      on public.posts (date desc);

-- Matikan Row Level Security (blog diakses via service_role key dari server)
alter table public.posts disable row level security;

-- ============================================
-- Sample posts (opsional, hapus kalau tidak mau)
-- ============================================
insert into public.posts (title, slug, excerpt, content, date, published, tags) values
(
  'The Weight of Silence',
  'the-weight-of-silence',
  'In the absence of noise, we find the architecture of thought — the skeleton of ideas stripped of ornament.',
  E'In the absence of noise, we find the architecture of thought — the skeleton of ideas stripped of ornament.\n\nThere is a particular quality to silence that most people misunderstand. They think of it as emptiness, as the absence of something. But silence is not a void. It is a presence. It has texture and weight.\n\n## The Structure of Quiet\n\nWhen you remove the constant hum of distraction — the notifications, the ambient noise, the perpetual motion of modern life — what remains is not nothing. What remains is *everything*.\n\nThe mind, freed from the obligation to process external stimuli, turns inward. It begins to organize. It draws connections between ideas that seemed disparate. It resolves contradictions you did not even know you were carrying.\n\n## On Working in Darkness\n\nThe best work often happens in conditions of constraint. A single lamp. A blank page. No music. No conversation.\n\nThis is not asceticism for its own sake. It is the recognition that creation requires a certain kind of attention — focused, sustained, unbroken — that abundance makes difficult.\n\nThe monochrome palette is not poverty. It is *discipline*.\n\n## What Remains\n\nStrip away color. Strip away decoration. Strip away everything that does not serve the essential function. What do you have?\n\nYou have the thing itself. Pure and unadorned. And in that purity, you often find it is more beautiful than it was with all its ornaments.',
  '2024-03-15',
  true,
  ARRAY['philosophy', 'writing']
),
(
  'Geometry of the Everyday',
  'geometry-of-the-everyday',
  'We walk through a world of perfect shapes — rectangles, circles, grids — and rarely stop to notice the mathematics beneath our feet.',
  E'We walk through a world of perfect shapes — rectangles, circles, grids — and rarely stop to notice the mathematics beneath our feet.\n\nThe window is a rectangle. The shadow it casts changes throughout the day — a parallelogram in the morning, almost a square at noon, stretched thin by afternoon. This is not accident. This is geometry in motion.\n\n## The Grid We Live In\n\nCities are grids. Streets meet at right angles. Blocks are rectangles. Buildings are stacked rectangles rising toward other rectangles — windows, floors, the geometry of function.\n\nWe designed it this way for reasons: efficiency, reproducibility, the easy division of space into ownable parcels. But in doing so, we created a world of almost aggressive regularity.\n\n## Finding the Circle\n\nWithin the grid, circles feel radical. A round table. A spiral staircase. The O of a doorknob, the arc of a bridge.\n\nCircles suggest something different from rectangles: rotation, continuity, the infinite. A circle has no beginning and no end. It is complete in itself.\n\n## Conclusion\n\nPay attention to shape. The world is full of it. Once you begin to see the geometry, you cannot stop seeing it — in the fold of a newspaper, in the pattern of floor tiles, in the space between bodies on a crowded street.',
  '2024-02-28',
  true,
  ARRAY['design', 'observation']
),
(
  'Notes on Black and White',
  'notes-on-black-and-white',
  'Color is information. Removing it forces us to look at structure, at form, at the bones of a thing.',
  E'Color is information. Removing it forces us to look at structure, at form, at the bones of a thing.\n\nThere is a reason black and white photography has never died, despite the easy availability of color. Something about the elimination of chromatic information focuses our attention. We see composition more clearly. We see light and shadow as the primary drama, not hue.\n\n## The Discipline of Constraint\n\nLimitation is generative. When you cannot rely on color to carry meaning, you must find meaning elsewhere — in contrast, in form, in the relationship between elements.\n\nThis is true in photography. It is true in writing. It is true in music. The sonnet is 14 lines because the constraint is productive, not despite it.\n\n## Against Decoration\n\nThere is a long tradition, in art and in thought, of stripping away decoration to find essential form. Minimalism is not a style. It is a philosophy — the belief that beneath the surface, beneath the ornament, there is something more true.\n\nBlack and white is that philosophy applied to the visible world.',
  '2024-01-10',
  true,
  ARRAY['aesthetics', 'photography']
)
on conflict (slug) do nothing;
