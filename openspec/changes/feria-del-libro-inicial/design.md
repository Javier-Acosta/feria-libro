## Context

El repositorio contiene la plantilla inicial de Next.js con App Router, TypeScript y Tailwind CSS; no existen aún rutas de dominio ni una capa de datos. Los requisitos funcionales se definen en las especificaciones `sitio-publico-feria` y `administracion-contenidos`.

## Goals / Non-Goals

**Goals:**

- Mantener una web pública liviana, legible en móvil y rápida de actualizar.
- Separar las rutas públicas de las operaciones protegidas de administración.
- Persistir contenido, agenda y referencias a medios para que sobrevivan a los despliegues.
- Validar datos tanto en los formularios como en el servidor.

**Non-Goals:**

- Venta de entradas, inscripciones, pagos, perfiles de asistentes o interacción social.
- Gestión de múltiples ferias simultáneas, flujos de aprobación editoriales o roles administrativos granulares en la primera entrega.
- Editor enriquecido avanzado, traducciones o sincronización automática con calendarios externos.

## Decisions

### Usar Next.js App Router para las rutas públicas y administrativas

Las vistas públicas se implementarán como rutas orientadas al servidor y las interacciones de administración como componentes cliente puntuales con mutaciones de servidor. Esto aprovecha la estructura existente, reduce el JavaScript enviado a visitantes y mantiene la validación junto a las mutaciones. Se descarta una SPA separada porque duplicaría infraestructura para una aplicación pequeña.

### Centralizar autenticación, datos y archivos en PocketBase

La primera entrega usará PocketBase para la autenticación de administradores, la base de datos SQLite y el almacenamiento de fotografías y mapas. Un único servicio autocontenido reduce el trabajo operativo y ofrece API, control de acceso y carga de medios. Se descarta almacenar el contenido en archivos del repositorio porque el administrador necesita publicar sin desplegar, y se descarta un backend propio porque aumenta el alcance inicial.

### Adoptar una identidad visual editorial inspirada en la referencia

La portada usará un héroe de gran formato, una navegación horizontal simple, bloques con información esencial y una agenda destacada por día, tomando como referencia la jerarquía y energía visual del sitio compartido. La implementación creará una identidad propia para la Feria, sin reutilizar marcas, imágenes ni contenido del sitio de referencia. Se descarta copiar la interfaz porque la aplicación debe representar la identidad del evento local y mantener un alcance funcional reducido.

### Modelar contenido por entidad con estado de publicación

Las entidades persistidas serán `news`, `guests`, `schedule_entries` y `venue_maps`; cada una mantendrá un estado de publicación y fechas de creación/actualización. Las consultas públicas filtrarán exclusivamente registros publicados y ordenarán noticias y agenda según los requisitos. Las actividades referenciarán invitados de forma opcional para admitir mesas con varios disertantes o actividades sin invitado. Se descarta un único bloque de contenido por página porque dificulta ordenar, relacionar y mantener los datos.

### Mantener un solo mapa activo

El modelo permitirá historial de recursos, pero la consulta pública resolverá solo el mapa publicado más reciente. Esta regla evita que el visitante deba escoger entre versiones contradictorias. Se descarta mostrar una galería de mapas en la primera versión.

### Proteger en dos niveles

El middleware bloqueará el acceso a rutas administrativas y las operaciones de escritura verificarán la sesión y el rol nuevamente en el servidor. Las políticas de datos y almacenamiento restringirán las escrituras al rol administrativo. Se descarta confiar únicamente en controles visuales del navegador porque no impiden llamadas directas.

## Risks / Trade-offs

- [Instancia o URL de PocketBase no configurada] → Documentar la URL pública, inicializar la instancia local y ofrecer una configuración de desarrollo antes de habilitar mutaciones.
- [Carga de archivos grandes o formatos no compatibles] → Restringir tipo y tamaño de archivos, y mostrar errores accionables en el formulario.
- [Cambios simultáneos de contenido] → Mantener marcas de actualización y recargar los listados tras cada mutación; la edición colaborativa avanzada queda fuera de alcance.
- [La agenda cambia con rapidez] → Permitir publicar y despublicar entradas individuales sin afectar el resto del día.

## Migration Plan

1. Inicializar PocketBase, sus colecciones, relaciones, almacenamiento y reglas de acceso.
2. Configurar las variables de entorno locales y de despliegue; crear al menos una cuenta administradora.
3. Implementar y probar las rutas públicas con contenido de ejemplo o datos cargados.
4. Implementar el panel protegido y las validaciones de lectura/escritura.
5. Cargar contenidos reales, verificar el sitio en móvil y publicar la versión inicial.

No hay datos existentes que migrar. Si es necesario revertir, se puede retirar el despliegue de la nueva aplicación sin eliminar el contenido almacenado.

## Open Questions

- El nombre oficial, fechas, identidad visual y sede de la Feria se cargarán como contenido de lanzamiento; no alteran la arquitectura ni los requisitos de esta primera entrega.
