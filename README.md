# MONO — Minimalist Blog

A clean, monochromatic blog built with Next.js 14 App Router. Zero dependencies on external databases — posts are stored in a local JSON file.

---

## Features

- **Public blog** — homepage with post list, individual post pages, about page
- **Admin panel** — `/admin` with login, dashboard, create/edit/delete posts
- **Markdown support** — headings, bold, italic, blockquotes, code, lists
- **Live preview** — toggle between editor and preview while writing
- **Monochrome design** — DM Serif Display + DM Mono, cream paper aesthetic
- **Deployable to Vercel** — with a small caveat (see below)

---

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Visit:
- Blog: http://localhost:3000
- Admin: http://localhost:3000/admin
  - Username: `admin`
  - Password: `monoblog2024`

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `ADMIN_USERNAME` | `admin` | Admin login username |
| `ADMIN_PASSWORD` | `monoblog2024` | Admin login password |
| `SESSION_SECRET` | `mono-secret-key-...` | Secret for session tokens — **change in production** |

---

## Deploy to Vercel

### Step 1 — Setup Vercel KV (wajib untuk data persistence)

Blog ini menyimpan posts di **Vercel KV** (Redis gratis). Setup-nya mudah:

1. Buka [vercel.com](https://vercel.com) → project kamu → tab **Storage**
2. Klik **Create Database** → pilih **KV**
3. Klik **Connect** → pilih project kamu
4. Vercel otomatis menambahkan env vars: `KV_URL`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`

### Step 2 — Deploy

1. Push repo ke GitHub
2. Import di [vercel.com/new](https://vercel.com/new)
3. Tambah environment variables berikut di Vercel dashboard:
   ```
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=passwordKamu
   SESSION_SECRET=randomStringPanjang
   ```
   *(KV env vars sudah otomatis ditambahkan dari step 1)*
4. Deploy ✓

### Jalankan Lokal dengan KV

Untuk development lokal, pull env vars dari Vercel:

```bash
npm install -g vercel
vercel link        # link project
vercel env pull    # download .env.local dari Vercel
npm run dev
```

---

## Project Structure

```
├── app/
│   ├── page.tsx                  # Homepage
│   ├── about/page.tsx            # About page
│   ├── posts/[slug]/page.tsx     # Post page
│   ├── admin/
│   │   ├── page.tsx              # Dashboard
│   │   ├── login/page.tsx        # Login
│   │   ├── AdminActions.tsx      # Logout button
│   │   ├── PostForm.tsx          # Shared create/edit form
│   │   └── posts/
│   │       ├── new/page.tsx      # New post
│   │       └── edit/page.tsx     # Edit post
│   └── api/
│       ├── auth/route.ts         # Login / logout
│       └── posts/
│           ├── route.ts          # GET all, POST create
│           └── [id]/route.ts     # GET one, PUT update, DELETE
├── lib/
│   ├── posts.ts                  # File-based post CRUD
│   └── auth.ts                   # Session auth
├── middleware.ts                  # Route protection
└── data/posts.json               # Auto-generated on first run
```

---

## Customization

**Change blog name**: Search for `MONO` in `app/` files and replace with your blog name.

**Change colors**: Edit `app/globals.css` CSS variables:
```css
:root {
  --ink: #0a0a0a;      /* text color */
  --paper: #f5f4f0;    /* background */
  --mid: #8a8a8a;      /* muted text */
  --border: #d4d4d0;   /* borders */
}
```

**Change fonts**: Edit the Google Fonts import in `globals.css` and update `tailwind.config.ts`.
