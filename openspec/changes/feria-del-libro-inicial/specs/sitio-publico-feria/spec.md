## Purpose

Ofrece al público una consulta clara y actualizada de la información esencial de la Feria del Libro durante el evento.

## ADDED Requirements

### Requirement: Portada informativa de la feria
El sistema SHALL ofrecer una página pública de la Feria del Libro que permita encontrar las noticias, los invitados especiales, el mapa de referencia y la agenda del evento desde una navegación visible.

#### Scenario: Visitante abre la portada
- **WHEN** una persona visita la URL pública del sitio
- **THEN** el sistema muestra las secciones o enlaces de Noticias, Invitados, Mapa y Agenda

### Requirement: Consulta de noticias publicadas
El sistema SHALL mostrar únicamente las noticias publicadas, ordenadas desde la más reciente, e incluir su fecha, título, resumen y enlace al contenido completo.

#### Scenario: Hay noticias publicadas para el día
- **WHEN** un visitante consulta la sección de noticias
- **THEN** el sistema muestra las noticias publicadas con sus datos editoriales y no expone borradores

#### Scenario: No hay noticias publicadas
- **WHEN** un visitante consulta la sección de noticias sin contenido publicado
- **THEN** el sistema informa de forma clara que todavía no hay noticias disponibles

### Requirement: Consulta de invitados especiales
El sistema SHALL mostrar las fichas publicadas de invitados especiales con nombre, descripción biográfica, actividad o participación asociada y fotografía cuando esté disponible.

#### Scenario: Visitante consulta invitados
- **WHEN** un visitante abre la sección de invitados
- **THEN** el sistema muestra únicamente las fichas de invitados publicadas

### Requirement: Mapa de referencia accesible
El sistema SHALL publicar un único mapa de referencia vigente del evento y permitir al visitante abrirlo o descargarlo cuando el formato del recurso lo admita.

#### Scenario: Hay un mapa vigente
- **WHEN** un visitante abre la sección de mapa
- **THEN** el sistema presenta el mapa vigente y un control para visualizarlo o acceder al recurso original

#### Scenario: No hay mapa publicado
- **WHEN** un visitante abre la sección de mapa sin un recurso vigente
- **THEN** el sistema muestra un mensaje de disponibilidad pendiente sin revelar recursos no publicados

### Requirement: Agenda agrupada por día
El sistema SHALL mostrar las actividades publicadas agrupadas por día de evento, indicando hora, título de la actividad, invitados o disertantes, y ubicación.

#### Scenario: Visitante selecciona un día con actividades
- **WHEN** un visitante selecciona un día de la agenda
- **THEN** el sistema muestra las actividades publicadas de ese día en orden cronológico

#### Scenario: Un día no tiene actividades
- **WHEN** un visitante selecciona un día sin actividades publicadas
- **THEN** el sistema comunica que no hay actividades programadas para esa fecha
