# Portfolio — Santiago Betancur Duque

Portfolio personal: [santiago-betancur-duque.vercel.app](https://santiago-betancur-duque.vercel.app).

Un solo contenido (`profile.json`) que se puede ver con tres estilos ("skins") bajo la misma URL: **raw-bw** (HTML crudo en blanco y negro, por defecto), **raw-color** (HTML crudo con etiquetas a color) y **brutalist** (inspirado en utrecht.jp). Todo con HTML y CSS nativos: sin Canvas, WebGL ni librerías de animación.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack, prerender estático) + [React 19](https://react.dev/)
- TypeScript 6
- CSS nativo: CSS Modules, `@layer`, nesting, `light-dark()`, `color-mix()`, unidades `dvh`/`svh`
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/)
- ESLint 9 (flat config, `typescript-eslint` type-aware) + Prettier
- [Volta](https://volta.sh/) para fijar Node.js y npm

## Cómo empezar

1. Instalar [Volta](https://volta.sh/). Las versiones de Node.js (24 LTS) y npm (11) están fijadas en el campo `volta` del `package.json` y se usan solas al entrar al proyecto. Sin Volta, instalar manualmente esas versiones.
2. Instalar dependencias y levantar el entorno local:
   ```sh
   npm ci
   npm run dev
   ```
3. Antes de cada push:
   ```sh
   npm run prepush
   ```
   Corrige lo que pueda (`eslint --fix`, `prettier --write`) y luego corre typecheck, tests (con coverage, umbral 85% de líneas) y build. Solo falla si queda algo que no se pudo corregir automáticamente.

| Script               | Qué hace                                     |
| -------------------- | -------------------------------------------- |
| `npm run dev`        | Servidor de desarrollo                       |
| `npm run build`      | Build de producción                          |
| `npm run start`      | Sirve el build                               |
| `npm run lint[:fix]` | ESLint                                       |
| `npm run typecheck`  | `tsc --noEmit`                               |
| `npm run test`       | Vitest una vez, siempre con coverage         |
| `npm run test:watch` | Vitest en modo watch                         |
| `npm run format`     | Prettier (`format:check` solo verifica)      |
| `npm run prepush`    | Lint fix + format + typecheck + test + build |

## Arquitectura

### Contenido

`src/content/profile.json` es la única fuente de verdad: perfil, about, proyectos, experiencia, educación, skills y enlaces. `src/content/index.ts` lo exporta tipado con `Profile` (si el JSON se desvía del esquema, falla `tsc`) junto con `SECTIONS`, los IDs de sección que comparten todas las skins (`about`, `work`, `experience`, `skills`, `contact`).

La metadata (`buildSiteMetadata` en el root layout), el JSON-LD (`WebSite` + `ProfilePage` + `Person`) y la imagen social (`src/app/opengraph-image.tsx`, generada en build) también salen de este JSON.

### Skins

| Skin        | Carpeta               | Tipo             | Cuándo se carga                         |
| ----------- | --------------------- | ---------------- | --------------------------------------- |
| `raw-bw`    | `src/skins/raw-bw`    | Server Component | Siempre: es el único contenido del HTML |
| `raw-color` | `src/skins/raw-color` | Client Component | Bajo demanda, desde el selector         |
| `brutalist` | `src/skins/brutalist` | Client Component | Bajo demanda, desde el selector         |

- **raw-bw** es el contenido canónico: lo que indexa Google y lo que ve quien navega sin JS. Un solo `<h1>`, sin contenido duplicado ni oculto.
- El **`SkinSwitcher`** (`src/components/SkinSwitcher/`) es el único JS de la carga inicial. Recibe raw-bw como `children` (ya renderizado en el servidor) y nunca lo descarta.
- Las otras skins son chunks separados (JS + CSS + fuentes con `preload: false`) que se descargan **por intención**: `pointerenter` (hover), `focus` (teclado) o `touchstart` (móvil) sobre su icono. Quien no explora no paga nada.
- Al seleccionar, el cambio usa la **View Transitions API** (`document.startViewTransition` + `flushSync`); sin soporte o con `prefers-reduced-motion`, cambia sin animación. Si el chunk no carga, se queda la skin actual. La elección no se persiste: cada visita entra en raw-bw.

### Tema y accesibilidad

- **Claro/oscuro**: por defecto sigue al sistema (`color-scheme: light dark`). Cada skin pinta con `light-dark()`, así que forzar `color-scheme` re-tematiza toda la página. El `ThemeToggle` (junto al selector de skins) guarda la elección en `localStorage` y la aplica en `<html data-theme>`. Un script inline en `<head>` (`src/utils/theme.ts`) la restaura antes del primer paint, sin flash. Sin JS, manda el sistema.
- **Preferencias del usuario**: `prefers-reduced-motion` desactiva animaciones y View Transitions; `prefers-contrast: more` quita la estática y refuerza los tonos atenuados; `forced-colors` (alto contraste de Windows) oculta los overlays y marca la skin activa con colores de sistema.
- **Navegación**: skip link a `<main id="main">` (todas las skins lo tienen), foco visible, landmarks y radios nativos en el selector.
- **Tests**: el contrato de skins corre `axe-core` sobre cada skin. El contraste se verifica en un navegador real (jsdom no calcula colores): todas las paletas cumplen WCAG AA en ambos temas.

El detalle de la decisión y las alternativas descartadas está en [`docs/design/README.md`](docs/design/README.md), junto a los mockups originales.

### Estructura

```
src/
├── app/                  # App Router: layout (metadata), manifest, robots, sitemap, imágenes sociales
│   └── (root)/           # Página principal
├── assets/
│   ├── fonts/og/         # TTF solo para la imagen social (next/og no lee woff2)
│   └── images/projects/  # Screenshots, importados estáticamente
├── components/
│   └── SkinSwitcher/     # Selector de skins (client)
├── content/              # profile.json, tipos y registro de imágenes
├── skins/                # Una carpeta por skin: componente, CSS Module y fuentes
├── styles/globals.css    # Reset, tokens y capas globales
├── test/                 # Utilidades de test compartidas (contrato de skins)
└── utils/                # Constantes y helpers de SEO
```

No hay carpeta `public/`: favicon (`icon.svg` con versión oscura + `favicon.ico`, `apple-icon.png`, `icon1/2.png` para el manifest), manifest, robots, sitemap e imágenes sociales viven en `src/app/`.

El dominio anterior (`portfolio-six-blond-30.vercel.app`) redirige con un 308 al actual desde `next.config.ts`, para conservar lo que Google ya indexó.

## Guías

### Editar el contenido

Solo se toca `src/content/profile.json`. Los campos opcionales (`description`, `url`, `tags`, fechas, `degree`, `email`) aparecen en las skins cuando tienen valor.

Para agregar una imagen de proyecto:

1. Guardar el archivo en `src/assets/images/projects/`.
2. Registrarlo en `src/content/images.ts` con un id.
3. Referenciarlo en el JSON: `"image": { "id": "mi-proyecto", "alt": "…" }`.

Un id inexistente rompe el build, y hay tests que verifican que no queden imágenes sin uso.

### Agregar una skin

1. Crear `src/skins/<nombre>/` con un componente `'use client'` exportado por defecto que lea `profile` y `SECTIONS` de `@/content`, su CSS Module dentro de `@layer skin` y sus fuentes con `next/font` y `preload: false`.
2. Registrarla en `src/components/SkinSwitcher/skins.ts` (`SkinId`, `SKIN_LABELS`, `loaders`) y agregar su icono en `OPTIONS`.
3. Agregar su spec usando `itFulfillsTheSkinContract` de `@/test/skinContract`: un `<h1>`, todas las secciones con su enlace en la nav principal y todo el contenido del JSON.

### Convenciones

- Imports absolutos con el alias `@/` → `src/`. El orden lo valida ESLint (`import/order`).
- Estilos: CSS Modules nativos. Los selectores globales y los tokens comunes van en `globals.css`; cada skin define su paleta con `light-dark()` dentro de `@layer skin`.
- Tests junto al archivo que prueban (`*.spec.ts(x)`).
- Commits con [Conventional Commits](https://www.conventionalcommits.org/): `tipo(scope): descripción`.
