# Design mockups

Tres direcciones visuales para el rediseño del portfolio. Son HTML estáticos autocontenidos (HTML + CSS nativo, sin JS, sin Canvas/WebGL) con contenido de ejemplo quemado. Ábrelos directamente en el navegador.

| Archivo                                                    | Dirección                          | Claves                                                                                                                                                                                                                       |
| ---------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`01-brutalist-utrecht.html`](./01-brutalist-utrecht.html) | Brutalista inspirado en utrecht.jp | Un solo color de tinta sobre papel, reglas de 1px como estructura, rail lateral con texto vertical, títulos bilingües ES/EN, listado de proyectos tipo catálogo con hover invertido, doodle SVG que se dibuja al cargar.     |
| [`02-raw-html-color.html`](./02-raw-html-color.html)       | HTML crudo con color               | Cada elemento imprime sus propias etiquetas vía `::before/::after` + `attr()` (ocultas a lectores de pantalla), un color por familia de etiqueta, guías de indentación, `<table border="1">` crudo, estática ligera animada. |
| [`03-raw-html-bw.html`](./03-raw-html-bw.html)             | HTML crudo B&W                     | Estética de "inspector" de DevTools: cada caja punteada con su selector en la esquina, hover = inspeccionar, grano + scanline, jerarquía solo por peso/tamaño.                                                               |

Comunes a los tres: light/dark nativo (`color-scheme` + `light-dark()`), `prefers-reduced-motion`, `100dvh`, `env(safe-area-inset-*)`, responsive mobile-first.

Los tres incluyen un toggle de tema 100% CSS (`:root:has(#flip:checked)`) que invierte la preferencia del sistema.

## Decisión

Se aprueban **los tres** diseños como "skins" intercambiables de la misma página, bajo la misma URL, con **raw-bw (03) como skin por defecto y contenido canónico**.

### Contenido

- Única fuente de verdad: `src/content/profile.json` (+ tipos en `src/content/types.ts`, accesible vía `@/content`). Metadata, JSON-LD y sitemap se derivan de él.
- Las tres skins renderizan el mismo JSON, cada una con su propia estructura y CSS. Comparten IDs de sección (`about`, `work`, `experience`, `skills`, `contact`).

### Render

- **raw-bw** (`src/skins/raw-bw/`): Server Components, prerenderizados en build. Es lo único que va en el HTML: lo que indexa Google y lo que ve quien navega sin JS. Un solo `<h1>`, sin contenido duplicado ni oculto.
- **raw-color** y **brutalist** (`src/skins/raw-color/`, `src/skins/brutalist/`): Client Components cargados con `import()` dinámico solo si el usuario los pide. Importan el JSON ellos mismos, así el contenido no viaja duplicado en el payload inicial.

### Switcher (`src/components/SkinSwitcher/`)

- Único JS de la carga inicial. Recibe raw-bw como `children` (elemento RSC renderizado en el servidor), que nunca se descarta: volver a raw-bw no pide nada.
- **Prefetch por intención**: `pointerenter` (hover en desktop), `focus` (teclado) y `touchstart` (móvil, sin hover) llaman al loader de la skin → se descarga en background su chunk JS + CSS + fuentes, una sola vez y cacheado en CDN. Sin prefetch en carga ni en idle.
- **Selección**: se espera al loader y se cambia con `document.startViewTransition(() => flushSync(() => setSkin(x)))`. No se usa `React.lazy`: suspende al menos un tick aunque el módulo esté en caché, y la transición capturaría el fallback; el componente ya resuelto se guarda en el estado. Sin la API o con `prefers-reduced-motion: reduce`, cambio directo sin animación. Si el `import()` falla, se mantiene la skin actual.
- **Sin persistencia**: cada visita entra en raw-bw. Evita el flash al recargar y mantiene la página estática.
- **Accesibilidad**: `<fieldset>` + `<legend>` oculto + 3 radios nativos con iconos SVG (pincel → brutalist, `</>` a color → raw-color, `</>` B&W → raw-bw), `aria-live="polite"` al cambiar, fijo fuera de las skins para no perder el foco, oculto sin JS con `@media (scripting: none)`.
- Las fuentes de las skins lazy usan `next/font` con `preload: false`.
- El tema light/dark es independiente de la skin.

### Alternativas descartadas

- **Las 3 skins en el HTML, ocultas con CSS**: triplica `<h1>` y texto en el DOM (riesgo SEO, IDs duplicados).
- **Server Component bajo demanda vía Server Action**: POST no cacheable en CDN, una invocación de función por cada hover, ejecución en cola, y Next desaconseja usar acciones para obtener UI/datos. Un Server Component sin cambiar la URL solo se obtiene por navegación o por acción.
- **Una ruta por skin**: cambia la URL.
