# Portfolio — Luciano Fernández

Sitio personal de Luciano Fernández, programador web full stack (San Miguel de Tucumán).
Hecho con HTML, CSS y JavaScript, sin frameworks, sin dependencias y sin paso de compilación.

## Cómo verlo

- **Rápido:** abrí `index.html` con doble clic.
- **Con servidor local** (igual que en producción):
  ```bash
  npx serve .
  # o
  python3 -m http.server 8000
  ```
  y entrá a http://localhost:8000. Para verlo en el celular, conectá el celular a la misma red
  wifi y abrí `http://<IP-de-tu-compu>:8000`.

**Publicarlo:** subí la carpeta a un repositorio de GitHub y conectalo en Vercel (o Netlify /
GitHub Pages). No necesita configuración.

## Estructura

```
portfolio/
├── index.html          Estructura de todas las secciones
├── css/styles.css      Estilos, ordenados por sección (índice al principio del archivo)
├── js/data.js          TODO el contenido editable
├── js/main.js          Arma el contenido e interacciones
└── assets/
    ├── favicon.svg
    ├── fondo-marca.webp      Marca de agua del fondo
    ├── foto-luciano.webp     Foto de perfil (Sobre mí)
    ├── portada-grido.webp    Portadas de los proyectos
    ├── portada-odonto.webp
    └── portada-boliche.webp
```

## Qué editar y dónde

Todo el contenido está en **`js/data.js`**: nombre, eslogan, servicios, especialidades,
proyectos, experiencia, conocimientos, preguntas frecuentes, email, WhatsApp y GitHub.

- **Proyectos:** cada uno tiene nombre, descripción, funciones (`highlights`), tecnologías
  (`tags`), portada (`image`) y enlaces. `featured: true` lo muestra como proyecto principal.
  Los filtros por tecnología se arman solos.
- **LinkedIn:** está comentado dentro de `contact.links`. Descomentalo y poné tu enlace.
- **Testimonios:** la sección aparece sola cuando cargás al menos uno (sólo opiniones reales).
- **No disponible:** `person.available: false` cambia el indicador del inicio.
- Cualquier texto con `[COMPLETAR` se marca en el sitio como dato pendiente.

Ajustes rápidos:

| Qué | Dónde |
| --- | --- |
| Intro en cada visita o sólo la primera | `SHOW_EVERY_TIME` en el `<head>` de `index.html` |
| Duración de la intro | `MIN_MS` en `js/main.js` |
| Velocidad del "Hablemos" | `SPEED` en `js/main.js` |
| Velocidad de la flotación del nombre | `name-float 2.6s` en `css/styles.css` |
| Color principal | `--accent` en `css/styles.css` |
| Intensidad de la marca de agua | `--wm-opacity` en `css/styles.css` |

## Funciones

- Intro de carga con barras arriba y abajo, saltable y repetible desde el pie.
- Grilla de puntos de fondo que sigue al cursor, con parallax al hacer scroll.
- Nombre centrado flotando, cubo 3D (`perfil.json` / `server.js`) que se gira arrastrando.
- Menú con indicador deslizante, barra de progreso de lectura y acceso a GitHub.
- Formulario que arma la consulta y la abre por email o WhatsApp (sin servidor).
- Botón flotante "Hablemos" que abre WhatsApp con un mensaje ya escrito.
- **En celular** (sin cursor): las tarjetas se iluminan solas al pasar por el centro de la
  pantalla y el cubo se balancea solo.

## Accesibilidad y rendimiento

- Navegación completa por teclado, foco visible, "Saltar al contenido", menú que cierra con Escape.
- Respeta `prefers-reduced-motion`: sin intro, sin animaciones de entrada, todo quieto.
- La grilla y el cubo sólo se redibujan cuando algo se mueve.
- Imágenes en WebP (todas juntas pesan menos de 250 KB).
