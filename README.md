# Portfolio — Santiago Betancur Duque

Portfolio personal: [santiago-betancur-duque.vercel.app](https://santiago-betancur-duque.vercel.app).

Un solo contenido, en inglés (`/`) y español (`/es`), que se puede ver con tres estilos ("skins") bajo la misma URL: **raw-bw** (HTML crudo en blanco y negro, por defecto), **raw-color** (HTML crudo con etiquetas a color) y **brutalist** (inspirado en utrecht.jp). Todo con HTML y CSS nativos: sin Canvas, WebGL ni librerías de animación.

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
   Corrige lo que pueda (`eslint --fix`, `prettier --write`) y luego corre typecheck, tests (con coverage, umbral 85% de líneas) y build. Solo falla si queda algo que no se pudo corregir automáticamente. El hook `pre-push` lo ejecuta solo (ver [Git hooks](#git-hooks)).

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

### Git hooks

[Husky](https://typicode.github.io/husky/) los instala al hacer `npm ci` (script `prepare`):

- **`commit-msg`**: [commitlint](https://commitlint.js.org/) valida [Conventional Commits](https://www.conventionalcommits.org/) (`tipo(scope): descripción`, scope opcional) con la descripción en menos de 40 caracteres (`commitlint.config.mjs`).
- **`pre-push`**: exige el árbol limpio (si no, validaría el trabajo sin commitear en vez de lo que se sube), corre `npm run prepush` y falla si este corrigió archivos: hay que commitear las correcciones y volver a hacer push.

## Arquitectura

### Contenido

`src/content/profile.{en,es}.json` son la única fuente de verdad: perfil, about, proyectos, experiencia, educación, skills y enlaces, uno por idioma. Ambos se tipan con `Profile` (si uno se desvía del esquema, falla `tsc`) y un test de paridad exige que URLs, fechas, ids de imagen, tags y cantidades coincidan: solo cambian los textos. `SECTION_IDS` son los IDs de sección que comparten todas las skins (`about`, `work`, `experience`, `skills`, `contact`).

La metadata (`buildSiteMetadata` en el layout), el JSON-LD (`WebSite` + `ProfilePage` + `Person`) y la imagen social (`src/app/[lang]/opengraph-image.tsx`, generada en build) salen del JSON de cada idioma.

### Idiomas

- **Rutas**: todo vive bajo `src/app/[lang]/` (`generateStaticParams` + `dynamicParams = false`): `/en` y `/es` se prerenderizan y cualquier otro segmento es 404. El inglés se sirve en `/` (la URL que Google ya tenía indexada) con un rewrite en `next.config.ts`, y `/en` redirige con 308 a `/` para no duplicar contenido. Todo lo aplica Vercel en el edge: no hay `proxy.ts` ni funciones.
- **Sin detección automática**: no se redirige por `Accept-Language` (Googlebot casi nunca lo envía y Google desaconseja redirigir entre idiomas en URLs con contenido). El cambio es manual, con enlaces reales en cada skin (`<a hreflang lang>`, funcionan sin JS). Cambiar de idioma navega y vuelve a raw-bw.
- **Textos de interfaz**: `src/i18n/dictionaries/{en,es}.json`; `en.json` define el tipo `Dictionary`, así que a `es.json` no le puede faltar una clave. `src/i18n/config.ts` tiene los idiomas, las rutas (`localePath`, `localeUrl`) y los enlaces de idioma.
- **Server vs. cliente**: `getProfile` y `getDictionary` importan todos los idiomas y solo se usan en el servidor. Las skins lazy usan `loadProfile`/`loadDictionary` (`loaders.ts`), con un chunk por idioma: en `/es` nunca se descarga el inglés.
- **SEO**: `<html lang>` por ruta, canonical por idioma, `hreflang` (`en`, `es`, `x-default` → `/`) en el `<head>` y en el sitemap, `og:locale` + `og:locale:alternate`, `inLanguage` en el JSON-LD (las entidades `WebSite` y `Person` son las mismas en ambos idiomas) e imagen social con texto y `alt` por idioma.
- **404**: como el root layout está bajo `[lang]`, las URLs que no existen las atiende `src/app/global-not-found.tsx` (flag `experimental.globalNotFound`), bilingüe y con `lang`. Importa `globals.css` antes que su CSS Module: su CSS se incluye en todas las páginas y el orden de `@layer` lo fija la primera hoja.

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
- **Color de la UI del navegador**: las `<meta name="theme-color">` del viewport siguen al sistema con `media`. Con un tema elegido a mano se agrega otra meta sin `media` al inicio del `<head>` (el navegador usa la primera que aplica). Las de React no se editan: al hidratar, React agregaría copias.
- **Preferencias del usuario**: `prefers-reduced-motion` desactiva animaciones y View Transitions; `prefers-contrast: more` quita la estática y refuerza los tonos atenuados; `forced-colors` (alto contraste de Windows) oculta los overlays y marca la skin activa con colores de sistema.
- **Navegación**: skip link a `<main id="main">` (todas las skins lo tienen), foco visible, landmarks y radios nativos en el selector.
- **Tests**: el contrato de skins corre `axe-core` sobre cada skin. El contraste se verifica en un navegador real (jsdom no calcula colores): todas las paletas cumplen WCAG AA en ambos temas.

El detalle de la decisión y las alternativas descartadas está en [`docs/design/README.md`](docs/design/README.md), junto a los mockups originales.

### Estructura

```
src/
├── app/                  # App Router: manifest, robots, sitemap, iconos, 404 global
│   └── [lang]/           # Layout (metadata), página e imágenes sociales por idioma
├── assets/
│   ├── fonts/og/         # TTF solo para la imagen social (next/og no lee woff2)
│   └── images/projects/  # Screenshots, importados estáticamente
├── components/
│   └── SkinSwitcher/     # Selector de skins (client)
├── content/              # profile.{en,es}.json, tipos, loaders y registro de imágenes
├── i18n/                 # Idiomas, rutas, diccionarios de UI y sus loaders
├── skins/                # Una carpeta por skin: componente, CSS Module y fuentes
├── styles/globals.css    # Reset, tokens y capas globales
├── test/                 # Utilidades de test compartidas (contrato de skins)
└── utils/                # Constantes y helpers de SEO
```

No hay carpeta `public/`: favicon (`icon.svg` con versión oscura + `favicon.ico`, `apple-icon.png`, `icon1/2.png` para el manifest), manifest, robots, sitemap e imágenes sociales viven en `src/app/`.

El dominio anterior (`portfolio-six-blond-30.vercel.app`) redirige con un 308 al actual desde `next.config.ts`, para conservar lo que Google ya indexó.

## Guías

### Editar el contenido

Se tocan `src/content/profile.en.json` y `profile.es.json` (los textos traducidos; URLs, fechas, ids de imagen y tags iguales en ambos). Los textos de interfaz están en `src/i18n/dictionaries/`. Los campos opcionales (`description`, `url`, `tags`, fechas, `degree`, `email`) aparecen en las skins cuando tienen valor. Las fechas de experiencia van como `YYYY-MM` (sin `end` = cargo actual), del más reciente al más antiguo; cada skin las formatea con `Intl` en su idioma (`Mar 2026` / `mar 2026`).

Para agregar una imagen de proyecto:

1. Guardar el archivo en `src/assets/images/projects/`.
2. Registrarlo en `src/content/images.ts` con un id.
3. Referenciarlo en el JSON: `"image": { "id": "mi-proyecto", "alt": "…" }`.

Un id inexistente rompe el build, y hay tests que verifican que no queden imágenes sin uso.

### Agregar una skin

1. Crear `src/skins/<nombre>/` con un componente `'use client'` exportado por defecto que reciba `SkinProps` (`profile`, `dict`, `lang`) y no importe `@/content` ni `@/i18n/dictionaries` (metería todos los idiomas en su chunk), su CSS Module dentro de `@layer skin` y sus fuentes con `next/font` y `preload: false`. Sus textos van en los diccionarios, y los enlaces de idioma salen de `getLanguageLinks`.
2. Registrarla en `src/components/SkinSwitcher/skins.ts` (`SkinId`, `loaders`), su nombre en `settings.skins` de cada diccionario y agregar su icono en `OPTIONS`.
3. Agregar su spec usando `itFulfillsTheSkinContract` de `@/test/skinContract`, que corre por idioma: un `<h1>`, todas las secciones con su enlace en la nav principal, todo el contenido del JSON, enlaces a cada idioma y ningún texto de otro idioma.

### Convenciones

- Imports absolutos con el alias `@/` → `src/`. El orden lo valida ESLint (`import/order`).
- Estilos: CSS Modules nativos. Los selectores globales y los tokens comunes van en `globals.css`; cada skin define su paleta con `light-dark()` dentro de `@layer skin`.
- Tests junto al archivo que prueban (`*.spec.ts(x)`).
- Commits con [Conventional Commits](https://www.conventionalcommits.org/): `tipo(scope): descripción`.
- Dependencias: versiones exactas. `.npmrc` fija `min-release-age=3`: `npm install` solo resuelve versiones publicadas hace más de 3 días (defensa ante paquetes comprometidos que se retiran en horas). `npm ci` no se ve afectado porque respeta el lockfile. Dependabot (`.github/dependabot.yml`) abre cada lunes un PR agrupado de minor/patch, con el mismo margen de 3 días (`cooldown`). ESLint, TypeScript y `@types/node` tienen los majors bloqueados (ver los motivos en el archivo).
