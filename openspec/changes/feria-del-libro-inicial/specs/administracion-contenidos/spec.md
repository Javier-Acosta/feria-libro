## Purpose

Permite al equipo autorizado mantener vigente el contenido público de la Feria del Libro sin requerir cambios en el código.

## ADDED Requirements

### Requirement: Acceso restringido a la administración
El sistema SHALL requerir autenticación para acceder a las funciones de administración y SHALL impedir que visitantes no autenticados modifiquen contenido.

#### Scenario: Visitante intenta abrir la administración
- **WHEN** una persona no autenticada accede a una ruta administrativa
- **THEN** el sistema la redirige al inicio de sesión o le deniega el acceso sin exponer controles de edición

#### Scenario: Administrador autenticado accede al panel
- **WHEN** una persona con permisos de administrador inicia sesión correctamente
- **THEN** el sistema le permite acceder al panel de gestión

### Requirement: Gestión de noticias
El sistema SHALL permitir a un administrador crear, editar, publicar, despublicar y eliminar noticias con título, fecha, resumen, contenido y recurso visual opcional.

#### Scenario: Administrador publica una noticia
- **WHEN** un administrador guarda una noticia válida y selecciona publicarla
- **THEN** el sistema la deja disponible en la sección pública de noticias

#### Scenario: Administrador deja una noticia como borrador
- **WHEN** un administrador guarda una noticia sin publicarla
- **THEN** el sistema conserva la noticia para edición y no la muestra al público

### Requirement: Gestión de invitados especiales
El sistema SHALL permitir a un administrador crear, editar, publicar, despublicar y eliminar fichas de invitados con nombre, biografía, participación asociada y fotografía opcional.

#### Scenario: Administrador actualiza un invitado
- **WHEN** un administrador guarda cambios en una ficha de invitado publicada
- **THEN** el sistema refleja la información actualizada en el sitio público

### Requirement: Gestión del mapa vigente
El sistema SHALL permitir a un administrador cargar o reemplazar el recurso de mapa de referencia y controlar si está publicado.

#### Scenario: Administrador reemplaza el mapa
- **WHEN** un administrador publica un nuevo mapa de referencia
- **THEN** el sistema muestra el nuevo recurso como mapa vigente al público

### Requirement: Gestión de agenda
El sistema SHALL permitir a un administrador crear, editar, publicar, despublicar y eliminar actividades de agenda con fecha, hora de inicio, título, ubicación y disertantes o invitados asociados.

#### Scenario: Administrador programa una disertación
- **WHEN** un administrador publica una actividad con fecha, hora y título válidos
- **THEN** el sistema la muestra en el día correspondiente de la agenda pública

### Requirement: Validación de contenido administrativo
El sistema SHALL informar los campos requeridos que falten o sean inválidos antes de guardar contenido publicable.

#### Scenario: Administrador intenta publicar contenido incompleto
- **WHEN** un administrador intenta publicar una noticia, invitado o actividad sin sus campos requeridos
- **THEN** el sistema rechaza la publicación y muestra los errores de validación correspondientes
