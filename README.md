# Tonin

**Frases motivacionales que se adaptan a tu estado de animo.**

Tonin es una web app inmersiva que te muestra frases motivacionales segun como te sientes. Elegis tu mood y recibis frases curadas con musica ambiental, colores dinamicos y navegacion tipo swipe para una mejor experencia de usuario.

---

## Caracteristicas

- **Seleccion de mood** — Grid visual con emojis e iconos personalizados por estado de animo
- **Experiencia swipe** — Tarjetas tipo Tinder con Framer Motion + use-gesture
- **Musica ambiental** — Cada mood tiene su propio track con transiciones fade-in/out
- **Theming dinamico** — Colores, fuentes y animaciones se adaptan al mood seleccionado
- **Presets de animacion** — Efectos float, pulse, wave y fade por mood
- **Dark / Light / System** — Toggle de tema con deteccion de preferencia del sistema
- **Favoritos** — Guarda frases con swipe a la derecha, persistidos en localStorage
- **Accesibilidad** — HTML semantico, ARIA labels, soporte `prefers-reduced-motion`
- **Panel admin** — Dashboard protegido para gestionar moods, frases y uploads de media
- **Autenticacion JWT** — Acceso admin seguro con tokens
- **Responsive** — Diseno mobile-first

## Tech Stack

| Capa | Tecnologia |
|------|-----------|
| Framework | React 19 + TypeScript |
| Build | Vite 6 |
| Estilos | Tailwind CSS 4 |
| Estado | Zustand (persistido) |
| Animaciones | Framer Motion |
| Gestos | @use-gesture/react |
| Audio | Howler.js |
| Routing | React Router 7 |
| Validacion | Zod |
| Componentes UI | shadcn/ui + Radix UI |
| HTTP | Axios |

## Arquitectura

```
src/
├── features/           # Vertical slices
│   ├── home/           # Pantalla de seleccion de mood
│   ├── phrase/         # Experiencia swipe de frases
│   └── admin/          # Dashboard CRUD (lazy-loaded)
├── shared/
│   ├── api/            # Cliente Axios y funciones de endpoints
│   ├── audio/          # AudioProvider + useAudio hook
│   ├── hooks/          # Hooks compartidos
│   ├── store/          # Store global con Zustand
│   ├── theme/          # ThemeProvider + theming por mood
│   └── ui/             # Componentes shadcn/ui
└── lib/
    ├── constants.ts    # Presets de animacion, thresholds, config
    ├── schemas.ts      # Schemas Zod y tipos inferidos
    └── utils.ts        # Funciones utilitarias
```

Arquitectura basada en features con capa compartida. Las rutas de admin estan code-split con `React.lazy` para mantener el bundle inicial liviano.

## Empezar

### Requisitos

- Node.js 18+
- [pnpm](https://pnpm.io/)
- [Tonin-Api](https://github.com/Gianpierre-dev/Tonin-Api) corriendo localmente (backend Spring Boot)

### Instalacion

```bash
# Clonar el repositorio
git clone https://github.com/Gianpierre-dev/Tonin-Web.git
cd Tonin-Web

# Instalar dependencias
pnpm install

# El .env ya viene configurado (por defecto: http://localhost:8080)
# Editalo si tu API corre en otra URL

# Iniciar servidor de desarrollo
pnpm dev
```

### Scripts

| Comando | Descripcion |
|---------|-------------|
| `pnpm dev` | Iniciar servidor de desarrollo |
| `pnpm build` | Type-check + build de produccion |
| `pnpm preview` | Preview del build de produccion |
| `pnpm lint` | Ejecutar ESLint |

## Backend

Tonin-Web consume la [Tonin-Api](https://github.com/Gianpierre-dev/Tonin-Api) — una API REST construida con Java 21 + Spring Boot que maneja moods, frases, autenticacion y almacenamiento de archivos via Wasabi S3.


## Licencia

MIT
