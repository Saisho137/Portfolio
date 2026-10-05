# Portfolio — Santiago Betancur Duque

Portfolio personal: [santiago-betancur-duque.vercel.app](https://santiago-betancur-duque.vercel.app).

Un solo contenido, en inglés (`/`) y español (`/es`), que se puede ver con tres estilos ("skins") bajo la misma URL: **raw-bw** (HTML crudo en blanco y negro, por defecto), **raw-color** (HTML crudo con etiquetas a color) y **brutalist** (inspirado en utrecht.jp). Todo con HTML y CSS nativos: sin Canvas, WebGL ni librerías de animación.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack, prerender estático) + [React 19](https://react.dev/)
- TypeScript 6
- CSS nativo: CSS Modules, `@layer`, nesting, `light-dark()`, `color-mix()`, unidades `dvh`/`svh`
- [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/) (`user-event`)
- [Playwright](https://playwright.dev/) + [axe](https://github.com/dequelabs/axe-core-npm) + [Lighthouse](https://github.com/GoogleChrome/lighthouse) para las pruebas en navegador real
- [Knip](https://knip.dev/) para código, exports y dependencias sin uso
- ESLint 9 (flat config, `typescript-eslint` type-aware) + Prettier
- [Volta](https://volta.sh/) para fijar Node.js y npm, y `devEngines` en `package.json` para exigirlas
- Google Analytics 4 (`@next/third-parties`)

## Cómo empezar

1. Instalar [Volta](https://volta.sh/). Las versiones exactas de Node.js (24 LTS) y npm (11) están en el campo `volta` del `package.json` y se usan solas al entrar al proyecto. Sin Volta, instalar manualmente esas versiones: `devEngines` hace que npm falle (`EBADDEVENGINES`) al instalar o correr scripts con un Node que no sea 24 o un npm fuera de 11.10–11.x. Volta [ya no se mantiene](https://github.com/volta-cli/volta#readme) y recomienda migrar a [mise](https://mise.jdx.dev/): sigue funcionando, pero es una migración pendiente.
2. Instalar dependencias y levantar el entorno local:
   ```sh
   npm ci
   npm run dev
   ```
3. Antes de cada push:
   ```sh
   npm run prepush
   ```
   Corrige lo que pueda (`eslint --fix`, `prettier --write`) y luego corre typecheck, tests (con coverage: umbral de 85% en líneas, sentencias y funciones, y 80% en ramas) y build. Solo falla si queda algo que no se pudo corregir automáticamente. El hook `pre-push` lo ejecuta solo (ver [Git hooks](#git-hooks)).

| Script                    | Qué hace                                                                                    |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| `npm run dev`             | Servidor de desarrollo                                                                      |
| `npm run build`           | Build de producción                                                                         |
| `npm run start`           | Sirve el build                                                                              |
| `npm run lint[:fix]`      | ESLint (tras `next typegen`: los tipos de imágenes viven en `next-env.d.ts`, no versionado) |
| `npm run typecheck`       | `next typegen` + `tsc --noEmit`                                                             |
| `npm run knip`            | Archivos, exports y dependencias sin uso (manual)                                           |
| `npm run test`            | Vitest una vez, siempre con coverage                                                        |
| `npm run test:watch`      | Vitest en modo watch                                                                        |
| `npm run test:e2e`        | Playwright contra el build local (correr `build` antes)                                     |
| `npm run test:visual`     | Solo la regresión visual (`-- --update-snapshots` regenera las baselines)                   |
| `npm run test:lighthouse` | Lighthouse estricto contra producción                                                       |
| `npm run format`          | Prettier (`format:check` solo verifica)                                                     |
| `npm run prepush`         | Lint fix + format + typecheck + test + build                                                |

### Pruebas en navegador (`e2e/`)

Scripts manuales, fuera de `prepush`: se corren cuando se quiere validar en navegador. Playwright con el Chrome instalado (`channel: 'chrome'`, no descarga navegadores). Por defecto levanta `next start` en el puerto 3100, así que antes hay que correr `npm run build`. Con `BASE_URL` prueba un sitio desplegado.

- **desktop**: rutas, redirects, 404, aviso de privacidad y headers de seguridad; head SEO y JSON-LD por idioma; axe con contraste en las 3 skins × 2 idiomas × 2 temas; que las skins lazy solo descarguen el idioma activo; navegación sin JS; tema + `theme-color` + persistencia; copiar el email (portapapeles, toast que no mueve nada).
- **mobile** (Pixel 7, táctil): las screenshots toman color al cruzar el centro de la pantalla, y quedan a color con reduced motion.
- **visual**: captura de página completa de cada skin × tema × idioma, más el aviso de privacidad, comparada píxel a píxel (sin tolerancia) con las baselines de `e2e/visual.spec.ts-snapshots/`. Reloj fijo (el año del footer no cambia las capturas), sin animaciones y sin los overlays de grano/estática (ruido que solo engorda los PNG). Las baselines dependen del render de fuentes del sistema (sufijo `-darwin`): tras un cambio visual intencional se regeneran y se revisan antes del commit.
- **lighthouse**: accesibilidad, buenas prácticas, SEO y agentic browsing en 100 siempre. Performance tiene margen porque medida desde una máquina varía con la red (el mismo deploy da 95–100 en corridas seguidas): ≥ 90 en local (sin CDN) y ≥ 95 con la mediana de 3 corridas en `test:lighthouse`. `LH_MIN_PERFORMANCE` cambia el umbral. Imprime los puntajes reales.

### Git hooks

[Husky](https://typicode.github.io/husky/) los instala al hacer `npm ci` (script `prepare`):

- **`commit-msg`**: [commitlint](https://commitlint.js.org/) valida [Conventional Commits](https://www.conventionalcommits.org/) (`tipo(scope): descripción`, scope opcional) con la descripción en menos de 40 caracteres (`commitlint.config.mjs`).
- **`pre-push`**: exige el árbol limpio (si no, validaría el trabajo sin commitear en vez de lo que se sube), corre `npm run prepush` y falla si este corrigió archivos: hay que commitear las correcciones y volver a hacer push.

## Arquitectura

### Contenido

`src/content/profile.{en,es}.json` son la única fuente de verdad: perfil, ubicación, about, proyectos, experiencia (con logros), educación (con honores), certificaciones, idiomas, skills por categoría y enlaces, uno por idioma. Ambos se tipan con `Profile` (si uno se desvía del esquema, falla `tsc`) y un test de paridad exige que URLs, fechas, ids de imagen, tags, certificaciones y cantidades coincidan: solo cambian los textos. `SECTION_IDS` son los IDs de sección que comparten todas las skins (`about`, `work`, `experience`, `skills`, `contact`).

La metadata (`buildSiteMetadata` en el layout), el JSON-LD (`WebSite` + `ProfilePage` + `Person` con idiomas, ubicación, credenciales verificables en Credly y honores) y la imagen social (`src/app/[lang]/opengraph-image.tsx`, generada en build) salen del JSON de cada idioma.

`ProfilePage.dateModified` y el `lastmod` del sitemap son la fecha del último commit que cambió los JSON de perfil (`src/utils/helpers/contentDate.ts`, leída de git en el build). Nunca la fecha del build: sin git, o si ese commit queda fuera de un clon superficial (el borde de un clon superficial aparenta crear todos los archivos), se omiten.

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

### Analítica

Google Analytics 4 directo (sin Tag Manager), con `GoogleAnalytics` de `@next/third-parties`: se carga después de la hidratación (`async`), sin bloquear la página. Solo en el deploy de producción de Vercel (`VERCEL_ENV === 'production'`, leído en el build): `next dev`, los previews y las corridas locales (E2E, Lighthouse) no cuentan como visitas.

- **Automático (medición mejorada de GA4)**: páginas vistas por idioma, fuente del tráfico, scroll y clics salientes (GitHub, LinkedIn, proyectos).
- **Eventos propios** (`src/utils/analytics.ts`, tipados, sin datos personales): `email_copy` (evento clave: intención de contacto), `skin_change` (`skin`) y `theme_change` (`theme`). Los componentes llaman a `trackEvent`, no a la librería.
- **Aviso de privacidad** (`src/app/[lang]/privacy/`): `/privacy` y `/es/privacy`, enlazado desde el footer de las 3 skins. Estático, sin JS, `noindex` y fuera del sitemap. Cubre el aviso de privacidad de la Ley 1581 de 2012 (Decreto 1377, art. 15) y la sección 7 de los términos de Google Analytics (aviso del uso de GA y sus cookies, y el enlace a "How Google uses information…"). Los textos viven en `notice.tsx`, no en los diccionarios (las skins lazy los cargarían sin usarlos); al cambiarlos se actualiza `NOTICE_UPDATED`. Declara una retención de 14 meses: debe coincidir con la de la propiedad de GA4 (Admin → Retención de datos). No hay banner de consentimiento: decisión consciente, que no cubre el opt-in que exige la UE/UK para la cookie `_ga`.

### Seguridad y resiliencia

- **Headers** (`next.config.ts`, en todas las rutas, aplicados por Vercel en el edge): `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`, `X-Frame-Options` y una CSP con `frame-ancestors`, `object-src`, `base-uri` y `form-action`. Sin `script-src` a propósito: en una página prerenderizada los scripts inline de Next (y GA) exigirían `'unsafe-inline'`, y un nonce obligaría a renderizar en cada request.
- **Skins que fallan**: si una skin lazy lanza un error al renderizar, `SkinErrorBoundary` vuelve a raw-bw (lo anuncia como un cambio normal) en vez de tumbar la página.
- **Año del footer**: raw-bw está prerenderizada; `CurrentYear` hidrata con el año del build (sin mismatch) y luego muestra el año actual, sin redeploy.

### Tema y accesibilidad

- **Claro/oscuro**: por defecto sigue al sistema (`color-scheme: light dark`). Cada skin pinta con `light-dark()`, así que forzar `color-scheme` re-tematiza toda la página. El `ThemeToggle` (junto al selector de skins) guarda la elección en `localStorage` y la aplica en `<html data-theme>`. Un script inline en `<head>` (`src/utils/theme.ts`) la restaura antes del primer paint, sin flash. Sin JS, manda el sistema.
- **Color de la UI del navegador**: las `<meta name="theme-color">` del viewport siguen al sistema con `media`. Con un tema elegido a mano se agrega otra meta sin `media` al inicio del `<head>` (el navegador usa la primera que aplica). Las de React no se editan: al hidratar, React agregaría copias.
- **Preferencias del usuario**: `prefers-reduced-motion` desactiva animaciones y View Transitions; `prefers-contrast: more` quita la estática y refuerza los tonos atenuados; `forced-colors` (alto contraste de Windows) oculta los overlays y marca la skin activa con colores de sistema.
- **Email**: `CopyEmail` copia la dirección al portapapeles en vez de abrir el cliente de correo, con un toast flotante (sobre la barra de ajustes, no desplaza el contenido) que también anuncian los lectores de pantalla (`role="status"`). Sin JS, sin Clipboard API, si falla la copia o con clicks modificados (nueva pestaña, etc.) sigue siendo un `mailto:` normal.
- **Screenshots en táctil**: en raw-bw las imágenes son grises y toman color con hover. Sin hover (`hover: none`) toman color al cruzar el centro de la pantalla (`animation-timeline: view()`); sin soporte o con `prefers-reduced-motion`, quedan a color.
- **Navegación**: skip link a `<main id="main">` (todas las skins lo tienen), foco visible, landmarks y radios nativos en el selector.
- **Tests**: el contrato de skins corre `axe-core` sobre cada skin en jsdom. El contraste lo verifica el E2E en Chrome (jsdom no calcula colores): todas las paletas cumplen WCAG AA en ambos temas.

El detalle de la decisión y las alternativas descartadas está en [`docs/design/README.md`](docs/design/README.md), junto a los mockups originales.

### Estructura

```
src/
├── app/                  # App Router: manifest, robots, sitemap, iconos, 404 global
│   └── [lang]/           # Layout (metadata), página, aviso de privacidad e imágenes sociales
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
e2e/                      # Playwright: navegador real, axe y Lighthouse
```

No hay carpeta `public/`: favicon (`icon.svg` con versión oscura + `favicon.ico`, `apple-icon.png`, `icon1/2.png` para el manifest), manifest, robots, sitemap e imágenes sociales viven en `src/app/`.

El dominio anterior (`portfolio-six-blond-30.vercel.app`) redirige con un 308 al actual desde `next.config.ts`, para conservar lo que Google ya indexó.

## Guías

### Editar el contenido

Se tocan `src/content/profile.en.json` y `profile.es.json` (los textos traducidos; URLs, fechas, ids de imagen, tags y certificaciones iguales en ambos, y la misma cantidad de logros, honores, idiomas y skills por categoría). Los textos de interfaz están en `src/i18n/dictionaries/`. Los campos opcionales (`description`, `url`, `tags`, fechas, `degree`, `highlights`, `honors`, `email`) aparecen en las skins cuando tienen valor. Todas las fechas van como `YYYY-MM` y cada skin las formatea con `Intl` en su idioma (`Mar 2026` / `mar 2026`). La experiencia va con los cargos actuales primero (sin `end`; el primero es el principal: "Currently" y `worksFor` del JSON-LD) y luego por fecha de fin; las certificaciones, de la más reciente a la más antigua. Los nombres de herramientas no se traducen; las categorías y los conceptos de skills sí.

Para agregar una imagen de proyecto:

1. Guardar el archivo en `src/assets/images/projects/`.
2. Registrarlo en `src/content/images.ts` con un id.
3. Referenciarlo en el JSON: `"image": { "id": "mi-proyecto", "alt": "…" }`.

Un id inexistente rompe el build, y hay tests que verifican que no queden imágenes sin uso.

### Agregar una skin

1. Crear `src/skins/<nombre>/` con un componente `'use client'` exportado por defecto que reciba `SkinProps` (`profile`, `dict`, `lang`) y no importe `@/content` ni `@/i18n/dictionaries` (metería todos los idiomas en su chunk), su CSS Module dentro de `@layer skin` y sus fuentes con `next/font` y `preload: false`. Sus textos van en los diccionarios, y los enlaces de idioma salen de `getLanguageLinks`.
2. Registrarla en `src/components/SkinSwitcher/skins.ts` (`SkinId`, `loaders`), su nombre en `settings.skins` de cada diccionario y agregar su icono en `OPTIONS`.
3. Agregar su spec usando `itFulfillsTheSkinContract` de `@/test/skinContract`, que corre por idioma: un `<h1>`, todas las secciones con su enlace en la nav principal, todo el contenido del JSON, enlaces a cada idioma, el enlace al aviso de privacidad en el footer y ningún texto de otro idioma.

### Convenciones

- Imports absolutos con el alias `@/` → `src/`. El orden lo valida ESLint (`import/order`); VS Code no reordena imports (`.vscode/settings.json`) para no pelear con esa regla.
- Formato: `.editorconfig` es la fuente única de espacios (indentación, LF, newline final) para todos los archivos y Prettier lo lee; `.prettierrc` solo tiene el estilo que difiere de los defaults; `.gitattributes` fuerza LF en git. VS Code formatea con Prettier al guardar y aplica los fixes de ESLint.
- Estilos: CSS Modules nativos. Los selectores globales y los tokens comunes van en `globals.css`; cada skin define su paleta con `light-dark()` dentro de `@layer skin`.
- Tests unitarios junto al archivo que prueban (`*.spec.ts(x)`), con `user-event` para las interacciones (`fireEvent` solo donde no alcanza, p. ej. `touchstart`). Los de navegador, en `e2e/`.
- TypeScript estricto más `noUncheckedIndexedAccess`, `noUnusedLocals/Parameters` y `noFallthroughCasesInSwitch`. ESLint exige imports de solo tipos con `type` (no arrastran módulos al bundle), `eqeqeq` y sin `console.log`.
- Commits con [Conventional Commits](https://www.conventionalcommits.org/): `tipo(scope): descripción`.
- Dependencias: versiones exactas. `.npmrc` fija `min-release-age=3`: `npm install` solo resuelve versiones publicadas hace más de 3 días (defensa ante paquetes comprometidos que se retiran en horas). `npm ci` no se ve afectado porque respeta el lockfile. También prohíbe dependencias por git o URL (`allow-git`/`allow-remote=none`) y hace fallar la instalación si un paquete trae scripts de instalación que no estén en `package.json#allowScripts` (`strict-allow-scripts`). Dependabot (`.github/dependabot.yml`) abre cada lunes un PR agrupado de minor/patch, con el mismo margen de 3 días (`cooldown`). ESLint, TypeScript y `@types/node` tienen los majors bloqueados (ver los motivos en el archivo).
