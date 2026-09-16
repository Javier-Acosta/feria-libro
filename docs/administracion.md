# Administración de la Feria

## Invitados

La portada muestra hasta seis invitados. **Ver todos** lleva a `/invitados/`,
que muestra todos los perfiles publicados. Cada tarjeta abre el perfil completo.

## Publicar y organizar contenido

- **Vista previa** muestra el contenido antes de guardarlo o publicarlo.
- **Guardar borrador** conserva el contenido sin mostrarlo al público.
- **Guardar y publicar** lo hace visible en el sitio.
- **Duplicar** crea una copia con sus imágenes y relaciones como borrador.
- **Prioridad de aparición** permite destacar contenido: un número mayor aparece
  antes. Cero mantiene el orden normal. Entre noticias o invitados con la misma
  prioridad, se muestra primero el registro más reciente. La portada conserva
  un máximo de seis noticias y seis invitados.
- La agenda respeta primero la fecha y la hora; la prioridad resuelve empates.
- Entre banners o mapas con igual prioridad se usa el último actualizado.

Los borradores son accesibles para administradores autenticados; la API pública
solo permite consultar publicaciones. No se ofrecen enlaces públicos de vista
previa de borradores.

## Portadas de Instagram

Al salir del campo del enlace de un reel sin portada, el editor intenta obtener
su imagen pública. También se puede usar **Obtener portada de Instagram**.
La imagen obtenida se guarda en PocketBase al guardar el reel, para no depender
de una URL temporal de Instagram. No se reemplaza automáticamente una portada
que ya estaba cargada.

La búsqueda puede fallar si el reel es privado, Instagram requiere iniciar sesión
o limita las solicitudes desde el servidor. El editor lo informa y conserva las
alternativas de subir una portada o guardar el enlace sin imagen. Solo se admiten
enlaces HTTPS de reels de Instagram y descargas de sus dominios de imágenes.

## Configuración

En `/admin/settings` se pueden editar el nombre y descripción del sitio, logo,
colores, fechas, sedes, enlaces sociales y texto del pie de página.
Los datos aparecen al recargar las páginas públicas. Las fechas y sedes se muestran
debajo del banner cuando se completan; los enlaces sociales aparecen en el pie.
El logo admite PNG, JPEG y WebP de hasta 5 MB. Se puede quitar para volver a mostrar
el nombre del sitio. Esta sección no modifica el texto incluido dentro de las
imágenes del banner.

## Despliegue y validación

La migración `1789570000_editorial_settings.js` agrega prioridad, permisos de
borradores y la colección de configuración. Para una instalación remota existente,
`tools/apply-editorial-migration.mjs` permite revisar el plan; `--apply` lo aplica
y guarda una copia del esquema anterior en el directorio temporal del sistema.
Requiere `POCKETBASE_MIGRATION_URL` HTTPS y las credenciales existentes de `.env.local`.
No se versionan ni imprimen credenciales.

`tools/editorial-smoke.mjs` prueba una instancia local de Next.js (por defecto
`http://127.0.0.1:3217`) conectada a PocketBase. Verifica autenticación, borradores,
duplicación de archivos, prioridad, fechas, relaciones y configuración. Crea
borradores temporales que elimina al terminar; no publica contenido de prueba.
