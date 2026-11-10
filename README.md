# ISAK ODAIR — Landing de servicios

Landing mobile-first de Isak Odair con cinco líneas de servicios, tema Light/Dark y cotización guiada por WhatsApp. Basada en las pantallas aprobadas en Figma.

**Figma:** https://www.figma.com/design/yqSZxuKdjeR93cZDKizkEK?node-id=17-18

## Funcionalidades (v1)

- Inicio con cinco categorías: estrategia y publicidad, producción audiovisual, branding, merchandise y experiencias digitales.
- Detalle por servicio con botón de cotización antes y después del miniportafolio.
- Sección de prueba social con proyectos musicales vinculados a Sony Music y fotogramas de tres piezas seleccionadas.
- Merchandise separado en pedido personalizado y productos QUAIDS.
- Formulario: servicio, nombre, objetivo, fecha estimada y presupuesto opcional.
- Ruta `#/propuesta-musical` para cotización interactiva de edición TikTok (niveles, volúmenes e IVA).
- Abre WhatsApp con mensaje prellenado al número **+52 449 468 5875** (`524494685875`) mediante `wa.me`. **No envía mensajes automáticamente**.
- Light/Dark: respeta sistema en primera visita, permite cambio manual y guarda preferencia local.
- Enlaces internos mediante hash para compartir detalles y conservar navegación al desplegar en Vercel.
- Sin backend, sin base de datos y sin recopilación automática de datos del formulario.

## Ejecutar

Requiere Node 20.19+ o 22+.

```bash
npm install
npm run dev
npm run build
```

## Deploy en Vercel

1. Crea un repositorio nuevo en GitHub, por ejemplo `isak-odair-landing`, y sube los archivos de este proyecto.
2. En Vercel, selecciona **Add New → Project → Import Git Repository**.
3. Framework: **Vite**; build: `npm run build`; output: `dist` (ya configurado en `vercel.json`).
4. Despliega. El enlace público podrá agregarse a la biografía de Instagram.

## Personalizar

- **WhatsApp:** `src/data.ts` → `WHATSAPP_NUMBER` y `composeWhatsAppMessage`.
- **Servicios y textos:** `src/data.ts`.
- **Colores, tipografías y estilos:** `src/styles.css`.
- **Portafolio Sony Music:** `src/sonyMusicPortfolio.ts` contiene fotogramas de proyectos seleccionados. Los videos originales permanecen en Drive; alojar versiones aprobadas en un CDN/servicio de video si se desea reproducción completa.
- **Imágenes/vídeos de otros servicios:** reemplazar las tarjetas `project-placeholder` en `src/App.tsx` con recursos autorizados; usar `public/projects/` para archivos propios o URLs de un CDN.
- **Dominio y SEO:** `index.html`.

## Pendientes antes de publicación final

- Material real autorizado de cada servicio y, si se desea, enlaces de video.
- Verificar tipografías y licencias frente al portafolio original (se usan Encode Sans Expanded, Barlow Condensed e Inter desde Google Fonts).
- Confirmar número de WhatsApp y realizar una prueba manual desde teléfono.
- Revisar aviso de privacidad apropiado si se añaden analítica, CRM, almacenamiento o captación automática de datos.
- Probar en iOS/Android reales y ajustar contraste/accesibilidad.

## Licencia

Proyecto privado de trabajo. No se concede licencia de redistribución de su diseño ni contenidos.
