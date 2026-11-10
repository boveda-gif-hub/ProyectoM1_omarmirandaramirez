# Colorfly Studio · Generador de paletas (MVP)

Aplicación web estática que genera paletas de 5 colores aleatorios.
Publicada en: `https://TU-USUARIO.github.io/colorfly-palette/`

## Funcionalidades
**Obligatorias**
- Botón "Generar paleta".
- Selector de tamaño: 6, 8 o 9 colores (el render cambia dinámicamente).
- Selector de formato de generación: HSL o HEX/RGBA.
- Cada color muestra su código HEX y, debajo, su valor en HSL o RGBA.
- Microfeedback con un toast al generar, copiar, bloquear y guardar.

**Extras**
- Bloqueo de colores: se mantienen al generar otra paleta.
- Guardado de paletas en `localStorage` (hasta 8) y carga con un clic.
- Copiar el código HEX al hacer clic sobre un color.
- Animación sutil de aparición, desactivada con `prefers-reduced-motion`.

## Estructura
- `index.html` – estructura semántica (`header`, `main`, `section`, `footer`)
- `style.css` – estilos en hoja externa
- `script.js` – lógica: colores aleatorios, arrays, DOM, eventos y localStorage

## Accesibilidad
- `lang="es"`, HTML semántico y enlace "saltar a la paleta".
- Selectores con `label` asociado mediante `for`/`id`.
- Botones navegables con teclado y foco visible.
- Botón de bloqueo con `aria-pressed`.
- Texto blanco o negro calculado según el fondo para mantener contraste.
- Toast con `aria-live` y soporte de `prefers-reduced-motion`.

## Conceptos aplicados
- **DOM:** `createElement`, `appendChild`, `textContent`, `addEventListener`.
- **Arrays:** `Array.from` para crear la paleta y `forEach` para dibujarla.
- **Aleatoriedad:** `Math.random()` convertido a HEX.

## Depuración con DevTools
- `console.log` muestra la paleta generada en la pestaña Console.
- En Elements se inspeccionan los botones creados dinámicamente.
- En Sources se pueden poner breakpoints en `generarPaleta`.

## Versionado y despliegue
```
git init
git add .
git commit -m "feat: estructura HTML semántica"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/colorfly-palette.git
git push -u origin main
```
GitHub Pages: repositorio → Settings → Pages → Source: `main` / `/ (root)` → Save.

**Desarrollo vs producción:** en desarrollo abres el archivo en tu equipo; en producción cualquiera accede por una URL pública.

## Decisiones técnicas
- **JavaScript puro, sin librerías:** es un MVP simple y sirve para practicar los fundamentos del DOM.
- **Colores como botones:** son accesibles por teclado y permiten copiar el código con un clic.
- **Dos formatos:** en HSL se generan tono, saturación y luminosidad y se convierten a HEX; en HEX/RGBA se genera el número y se calcula el RGBA.
- **Array como estado:** `paleta` guarda los colores y `forEach` los dibuja.
- **Variables CSS:** el JS entrega el color y el CSS controla el diseño, evitando estilos inline en el HTML.
- **Texto con contraste automático:** se calcula la luminosidad del fondo para elegir blanco o negro.
- **Archivos en la raíz:** GitHub Pages sirve `index.html` desde la raíz del repositorio.

## Documentación
- Uso de la IA con prompts y resultados: [`docs/uso-de-ia.md`](docs/uso-de-ia.md)
- Capturas o GIF del flujo principal: (pega aquí el link de tu carpeta de Google Drive)

## Uso de IA (resumen)
Prompt de ejemplo:
> Actúa como mentor de desarrollo frontend. Necesito un generador de paletas de 5 colores aleatorios en HTML, CSS y JS puro, con HTML semántico, CSS externo sin estilos inline, manipulación de arrays y buena accesibilidad. Explica cada parte para principiantes.

Por qué funcionó: define el rol, la tecnología, las restricciones y el nivel del lector.
Mejora posible: pedir también casos de prueba y un listado de errores comunes.

## Proceso de desarrollo
1. Análisis de requisitos.
2. Estructura HTML semántica.
3. Estilos CSS.
4. Lógica en JS.
5. Pruebas y depuración en DevTools.
6. Publicación en GitHub Pages.
(Agrega aquí capturas y problemas que encontraste.)
