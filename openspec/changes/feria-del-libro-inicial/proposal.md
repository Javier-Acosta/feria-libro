## Why

La Feria del Libro necesita una presencia digital única y fácil de consultar para mantener al público informado durante el evento. El equipo organizador también necesita actualizar el contenido diario sin depender de cambios técnicos en el sitio.

## What Changes

- Crear una portada pública sencilla para la Feria del Libro con acceso a las noticias, invitados destacados, mapa de referencia y agenda del evento.
- Mostrar noticias publicadas por día, con fecha, título, resumen, contenido y recurso visual opcional.
- Presentar fichas de invitados especiales y una agenda agrupada por día, con horario, actividad, participante y ubicación.
- Publicar un mapa de referencia del predio como imagen, documento o enlace que pueda consultar cualquier visitante.
- Incorporar un área de administración protegida para que personal autorizado cree, edite, publique, despublique y elimine el contenido de esas secciones.

## Capabilities

### New Capabilities

- `sitio-publico-feria`: experiencia pública que informa sobre las noticias, invitados, mapa y agenda de la Feria del Libro.
- `administracion-contenidos`: gestión protegida del contenido editorial y de programación que se muestra en el sitio público.

### Modified Capabilities

- Ninguna.

## Impact

- Afecta la página de inicio de Next.js y añadirá rutas públicas y administrativas.
- Requiere un modelo de persistencia para contenidos y medios, además de control de acceso para administradores.
- No hay APIs ni integraciones existentes que deban conservarse; el proyecto parte de la plantilla inicial de Next.js.
