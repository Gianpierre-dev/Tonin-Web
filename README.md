# Tonin

**Motivational phrases that match your mood.**

Tonin is an immersive web app that delivers motivational phrases based on how you feel. Pick your mood, and experience curated quotes with ambient music, dynamic color themes, and smooth swipe-based navigation inspired by Tinder.

---

## Features

- **Mood selection** — Visual grid with emojis and custom icons per mood
- **Swipe experience** — Tinder-style card swiping powered by Framer Motion + use-gesture
- **Ambient music** — Each mood has its own background track with fade-in/out transitions
- **Dynamic theming** — Colors, fonts, and animations adapt to the selected mood
- **Animation presets** — Float, pulse, wave, and fade breathing effects per mood
- **Dark / Light / System mode** — Theme toggle with system preference detection
- **Favorites** — Save phrases with a right swipe, persisted in localStorage
- **Accessibility** — Semantic HTML, ARIA labels, `prefers-reduced-motion` support
- **Admin panel** — Protected dashboard for managing moods, phrases, and media uploads
- **JWT authentication** — Secure admin access with token-based auth
- **Responsive** — Mobile-first design

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| State | Zustand (persisted) |
| Animations | Framer Motion |
| Gestures | @use-gesture/react |
| Audio | Howler.js |
| Routing | React Router 7 |
| Validation | Zod |
| UI Components | shadcn/ui + Radix UI |
| HTTP | Axios |

## Architecture

```
src/
├── features/           # Vertical slices
│   ├── home/           # Mood selection screen
│   ├── phrase/         # Swipe card experience
│   └── admin/          # CRUD dashboard (lazy-loaded)
├── shared/
│   ├── api/            # Axios client & endpoint functions
│   ├── audio/          # AudioProvider + useAudio hook
│   ├── hooks/          # Shared data hooks
│   ├── store/          # Zustand global store
│   ├── theme/          # ThemeProvider + mood theming
│   └── ui/             # shadcn/ui components
└── lib/
    ├── constants.ts    # Animation presets, thresholds, config
    ├── schemas.ts      # Zod schemas & inferred types
    └── utils.ts        # Helper functions
```

Feature-based architecture with a shared layer. Admin routes are code-split via `React.lazy` to keep the initial bundle lean.

## Getting Started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io/)
- [Tonin-Api](https://github.com/Gianpierre-dev/Tonin-Api) running locally (Spring Boot backend)

### Installation

```bash
# Clone the repository
git clone https://github.com/Gianpierre-dev/Tonin-Web.git
cd Tonin-Web

# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Edit .env with your API URL (default: http://localhost:8080)

# Start development server
pnpm dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Type-check + production build |
| `pnpm preview` | Preview production build |
| `pnpm lint` | Run ESLint |

## Backend

Tonin-Web consumes the [Tonin-Api](https://github.com/Gianpierre-dev/Tonin-Api) — a REST API built with Java 21 + Spring Boot that handles moods, phrases, authentication, and file storage via Wasabi S3.

## Screenshots

<!-- Add screenshots or a GIF demo here -->
<!-- Example: -->
<!-- ![Home Screen](docs/screenshots/home.png) -->
<!-- ![Phrase Swipe](docs/screenshots/swipe.png) -->

## License

MIT
