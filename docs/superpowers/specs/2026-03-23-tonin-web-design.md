# Tonin-Web — Frontend Design Spec

## Overview

Tonin-Web is a mobile-first web app for motivational phrases organized by emotional states. The user selects how they feel, and the entire screen transforms into an immersive experience with a phrase, ambient music, dynamic colors, typography, and breathing animations — all driven by backend configuration.

The core interaction is a Tinder-style swipe: right to save, left for the next phrase.

## Stack

| Tool | Purpose |
|------|---------|
| Vite | Build tool, dev server |
| React 19 | UI framework |
| TypeScript (strict) | Type safety, zero `any` |
| Tailwind CSS 4 | Styling + dark/light mode via CSS variables |
| React Router 7 | Client-side routing |
| Framer Motion | Animations (transitions, breathing, float, swipe) |
| @use-gesture/react | Swipe detection on phrase cards |
| Howler.js | Audio playback (fade-in/out, volume, mute) |
| Zustand | Global state (mood, favorites, audio, theme) |
| Axios | HTTP client with interceptors (JWT, 401 handling) |
| shadcn/ui | Admin panel components |
| Zod | API response validation |

## Architecture

Feature-based structure:

```
src/
  features/
    home/
      HomeScreen.tsx
      MoodGrid.tsx
      MoodCell.tsx
    phrase/
      PhraseScreen.tsx
      SwipeStack.tsx
      SwipeCard.tsx
      SwipeHints.tsx
    admin/
      LoginScreen.tsx
      AdminLayout.tsx
      EstadosPage.tsx
      FrasesPage.tsx
      UploadsPage.tsx
  shared/
    api/
      client.ts
      endpoints.ts
    hooks/
      useEstados.ts
      useFraseRandom.ts
    audio/
      AudioProvider.tsx
      useAudio.ts
    theme/
      ThemeProvider.tsx
      useTheme.ts
      useMoodTheme.ts
    store/
      useAppStore.ts
    ui/               (shadcn components)
  lib/
    schemas.ts
    constants.ts
    utils.ts
  App.tsx
  main.tsx
  index.css
```

## Routes

| Route | Component | Access |
|-------|-----------|--------|
| `/` | HomeScreen | Public |
| `/phrase/:moodName` | PhraseScreen | Public |
| `/admin/login` | LoginScreen | Public |
| `/admin/estados` | EstadosPage | JWT (ADMIN) |
| `/admin/frases` | FrasesPage | JWT (ADMIN) |
| `/admin/uploads` | UploadsPage | JWT (ADMIN) |

No auth required for end users. Admin routes protected via `ProtectedRoute` wrapper that checks JWT in localStorage and verifies expiration by decoding the payload (no server call). Expired token → clear + redirect to `/admin/login`.

Route `/admin` redirects to `/admin/estados` by default.

## Backend API (consumed)

Base URL: `http://localhost:8080`

### Public endpoints
- `GET /api/estados` — List all emotional states
- `GET /api/frases/random?animo={name}&excluidos={id1,id2,id3}` — Random phrase by mood. `excluidos` is a comma-separated list of phrase IDs to exclude. Returns 404 when no phrases are available.

### Protected endpoints (ADMIN + JWT)
- CRUD `/api/frases` — `{ texto, estadoAnimoId }`
- CRUD `/api/estados` — `{ nombre, emoji, iconUrl, musicaUrl, imagenUrl, colorPrimario, colorSecundario, fontFamily, animationType }`
- `POST /api/uploads/imagen` — multipart/form-data, field "file"
- `POST /api/uploads/musica` — multipart/form-data, field "file"
- `DELETE /api/uploads?url={url}` — Delete file from Wasabi
- `POST /api/auth/login` — `{ username, password }` → `{ token }`

### Response DTOs

**EstadoAnimoDTO:**
```json
{
  "id": 1,
  "nombre": "FELIZ",
  "emoji": "😊",
  "iconUrl": "https://...",
  "musicaUrl": "https://...",
  "imagenUrl": "https://...",
  "colorPrimario": "#FFB74D",
  "colorSecundario": "#81C784",
  "fontFamily": "DM Sans",
  "animationType": "float"
}
```

**FraseDTO:**
```json
{
  "id": 1,
  "texto": "La felicidad no es una estacion...",
  "estadoAnimo": { ...EstadoAnimoDTO }
}
```

## Data Flow

1. App mounts → `GET /api/estados` → Zustand stores the list
2. HomeScreen renders MoodGrid from store (zero hardcoding)
3. User taps a mood →
   - Store updates active mood + resets excludedIds (clean slate for new mood)
   - ThemeProvider injects CSS variables from the selected estado
   - Google Fonts loads fontFamily dynamically (if not cached)
   - Router navigates to `/phrase/{moodName}`
4. PhraseScreen mounts →
   - `GET /api/frases/random?animo={name}` → SwipeCard displays phrase
   - AudioProvider loads musicaUrl via Howler.js, fade-in 2s
5. Swipe right → saves phrase ID in favorites (Zustand + localStorage), fetches next
   Swipe left → adds ID to excluded list, fetches next phrase
6. "↩ cambiar" → AudioProvider fade-out 1.5s, navigate to `/`

## Global State (Zustand)

```typescript
interface AppState {
  // API states
  estados: EstadoAnimoDTO[]
  loadEstados: () => Promise<void>

  // Active mood
  activeMood: EstadoAnimoDTO | null
  setActiveMood: (mood: EstadoAnimoDTO) => void
  clearActiveMood: () => void

  // Phrases
  excludedIds: number[]
  addExcludedId: (id: number) => void
  resetExcluded: () => void

  // Favorites (persisted in localStorage)
  favorites: number[]
  toggleFavorite: (id: number) => void

  // Audio (persisted in localStorage)
  isMuted: boolean
  volume: number // default 0.6
  setVolume: (volume: number) => void
  toggleMute: () => void

  // Theme (persisted in localStorage)
  themeMode: 'system' | 'dark' | 'light'
  setThemeMode: (mode: 'system' | 'dark' | 'light') => void
}
```

## Mood Theming System

Each estado from the backend drives the entire visual experience via CSS variables:

```
colorPrimario   → --mood-primary   (gradients, glows, accents)
colorSecundario → --mood-secondary (secondary glows, highlights)
fontFamily      → --mood-font      (phrase typography)
animationType   → maps to Framer Motion config from constants.ts
```

### Animation Presets

```typescript
const ANIMATION_PRESETS: Record<string, AnimationConfig> = {
  float:  { duration: 5, y: [-6, 6], ease: "easeInOut" },
  pulse:  { duration: 8, scale: [1, 1.15], ease: "easeInOut" },
  wave:   { duration: 6, rotate: [-2, 2], ease: "easeInOut" },
  fade:   { duration: 10, opacity: [0.7, 1], ease: "easeInOut" },
}
// Unknown type from backend → fallback to "fade"
```

### Dynamic Font Loading

```typescript
const loadFont = (family: string): void => {
  if (document.fonts.check(`16px "${family}"`)) return
  const link = document.createElement('link')
  link.href = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, '+')}:wght@300;400;500;700&display=swap`
  link.rel = 'stylesheet'
  document.head.appendChild(link)
}
// Fallback font stack: if Google Fonts fails (offline, blocked network),
// CSS uses: var(--mood-font), 'Outfit', system-ui, sans-serif
// Timeout: if font not loaded after 3s, proceed with fallback (font-display: swap handles this)
```
```

### Icon Resolution

```typescript
// MoodCell and SwipeCard
if (estado.iconUrl) → <img src={estado.iconUrl} alt={estado.nombre} />
else → <span>{estado.emoji}</span>
```

## Visual Design

### Home Screen

- Dark mode: warm dark background (#0f1520 → #0a0a12), ambient orbs drifting slowly
- Light mode: warm creams (#fdf6ee → #f8f0e6), soft peach/rose orbs
- Contextual greeting: "Buenos dias" / "Buenas tardes" / "Buenas noches" based on hour
- Question: "¿Como te sientes en este momento?" (validates, never prescribes)
- MoodGrid: 3 columns, emoji/icon + name, 80px touch targets
- States ordered: negative states first (triste, ansioso) for primacy — users opening a mood app likely aren't feeling great
- Theme toggle (☽/☀) top-right corner, subtle

### Phrase Screen (Immersive)

- Full-screen mood world: gradients from colorPrimario/colorSecundario as glows
- SwipeStack: 3 cards visible (active with real phrase + 2 behind as decorative placeholders with reduced scale/opacity/blur; they load real content when promoted to active via prefetch)
- Active card: semi-transparent with mood color tint, phrase in mood font
- Audio indicator: 5 thin bars animating subtly, top-right
- Single button: "↩ cambiar" at bottom center
- Swipe hints below stack: "← siguiente / guardar →" — disappear after first swipe (localStorage)

### Swipe Mechanic

- Drag horizontal detected by @use-gesture
- Card follows finger: translateX + proportional rotation (max ±12deg)
- Badge opacity proportional to displacement: "♡ GUARDADA" (right) / "SIGUIENTE" (left)
- Release before threshold (`SWIPE_THRESHOLD` in constants.ts, default 120px): spring snap back
- Cross threshold:
  - Card flies out with rotation (400ms, ease-in)
  - Behind card promotes: scale 0.95 → 1, opacity 0.3 → 1 (300ms)
  - New card appears at stack bottom: scale 0.9, opacity 0.15
  - API call for next phrase (with excluded IDs)
- No more phrases (API returns 404): show empathetic message card ("Ya viste todas las frases para este momento. Vuelve pronto, siempre hay nuevas."), not an error. Offer option to reset excluded IDs and cycle again.

### Transitions

**Home → Phrase (~800ms perceived):**
1. MoodCell scale 1 → 1.1 → 1 (300ms)
2. CSS variables injected for selected mood
3. Home fade-out + scale 0.98 (300ms)
4. PhraseScreen fade-in with mood colors (500ms)
5. Glows appear opacity 0 → 0.7 (600ms)
6. SwipeCard enters from y: 40 → 0 with fade (400ms, delay 300ms)
7. Audio fade-in 0 → 0.6 volume (2000ms)

**Phrase → Home:**
1. Audio fade-out (1500ms)
2. Glows fade-out (400ms)
3. Card fade-out + scale 0.95 (300ms)
4. CSS variables reset to neutral
5. Home fade-in (400ms)
6. MoodCells stagger in: 50ms each, scale 0.9 → 1

### Dark vs Light Mode

- Default: follows `prefers-color-scheme` from system
- Manual toggle persisted in localStorage
- Light mode: warm creams, never pure white. Mood worlds adapt (e.g., Feliz light = peach/cream gradients with glassmorphism cards)
- Dark mode: warm blacks, never pure #000. Mood worlds use deep gradients with glowing orbs.

## Admin Panel

Functional UI using shadcn/ui. No custom design — focus on usability.

### Layout
- Fixed sidebar: Estados, Frases, Uploads
- Mobile: collapses to hamburger menu

### Estados CRUD
- Table: nombre | emoji/icon preview | colors preview | font | animation | actions
- Form fields:
  - nombre: text input
  - emoji: text input (fallback if no iconUrl)
  - iconUrl: file upload → POST /api/uploads/imagen (with preview)
  - colorPrimario: color picker
  - colorSecundario: color picker
  - fontFamily: select with font preview
  - animationType: select (float, pulse, wave, fade) with animated preview
  - musicaUrl: file upload → POST /api/uploads/musica
  - imagenUrl: file upload → POST /api/uploads/imagen

### Frases CRUD
- Table: texto (truncated) | estado de animo | actions
- Form fields:
  - texto: textarea (5-500 chars, live validation)
  - estadoAnimoId: select with emoji + name
  - Helper text for negative states: "Las frases para estados negativos deben validar el sentimiento antes de ofrecer perspectiva"

### Uploads
- Drag & drop zone for images and audio
- Preview before upload (image thumbnail / audio player)
- Frontend file type validation before sending to backend
- Session-local list of recently uploaded files with delete option (no backend GET endpoint for listing; URLs are stored in estado fields)

## Authentication (Admin only)

1. `POST /api/auth/login` → receives `{ token }`
2. Token stored in localStorage
3. Axios request interceptor injects `Authorization: Bearer {token}`
4. Axios response interceptor: 401 → clear token → redirect `/admin/login`
5. `ProtectedRoute` component: no token → redirect `/admin/login`
6. No public registration — first user created via API directly

## Accessibility

| Requirement | Implementation |
|-------------|---------------|
| prefers-reduced-motion | Disable breathing, float, and swipe card fly-out animations. Swipe gesture still works but cards snap instantly instead of animating. Only 300ms fades remain. |
| prefers-color-scheme | Automatic theme by default |
| Contrast | Minimum 4.5:1 on any mood background |
| Touch targets | 48px minimum, 80px on MoodGrid |
| Screen reader | `aria-live="polite"` on phrase changes |
| Audio | Mute button always visible, default volume 60%, preference persisted |
| Font size | 16px minimum body, 20px+ phrases |
| Keyboard | Enter = swipe right, Backspace = swipe left, Escape = go back |

## Emotional UX Principles

- "¿Como te sientes en este momento?" — validates without prescribing
- Negative states placed first in grid (primacy effect — user probably isn't happy)
- Sad world = warm refuge (blue night + gold hints), never a mirror of pain
- Phrases for negative states validate before motivating: "Esta bien no estar bien"
- No gamification (streaks, points, ratings)
- No "are you sure?" on back navigation — free exit, no guilt
- No push notifications
- Audio never cuts abruptly — always fade-out
- Share is NOT a primary CTA — the moment is intimate

## Edge Cases and Error Handling

| Scenario | Behavior |
|----------|----------|
| API unreachable on mount | HomeScreen shows skeleton + retry button. No crash. |
| No estados in database | Empty state: "Aun no hay estados de animo. Vuelve pronto." |
| No phrases for selected mood | API returns 404 → empathetic card with option to reset and cycle |
| All phrases excluded | Same as above — offer "ver de nuevo" to reset excludedIds |
| Audio fails to load | Silent fail. Audio indicator hidden. Phrase experience continues without music. |
| Google Font fails to load | CSS fallback stack: `var(--mood-font), 'Outfit', system-ui, sans-serif` |
| JWT expired mid-session (admin) | Axios 401 interceptor clears token, redirects to login. Current form data lost (acceptable for admin). |
| Network lost during swipe | Queued phrase request fails → show toast "Sin conexion", keep current card. Retry on next swipe. |
| Wasabi image URL broken | `<img>` onerror → hide image, show mood gradient only |
| Very long phrase text | CSS clamp with scroll if needed. Max 500 chars from backend validation. |

## Performance

| Target | Strategy |
|--------|----------|
| Font loading | Preload active mood font, lazy-load others |
| Images | Lazy loading from Wasabi with blur placeholder |
| API | Estados cached in Zustand (single request on mount) |
| Audio | Load only on mood selection, not preloaded |
| Bundle | Code splitting by route (`React.lazy()` for admin) |
| Lighthouse Performance | > 90 |
| Lighthouse Accessibility | > 95 |
