## 1. Base de datos y acceso

- [ ] 1.1 Inicializar PocketBase, documentar la URL de servicio y configurar el cliente de servidor/navegador; verificar que la aplicación detecta la configuración sin exponer credenciales administrativas al cliente.
- [ ] 1.2 Definir y aplicar las colecciones de PocketBase para noticias, invitados, actividades, relaciones de disertantes y mapas; verificar con una instancia limpia y consultas de lectura de cada colección.
- [ ] 1.3 Configurar el almacenamiento de PocketBase para imágenes y mapas, límites de tipo/tamaño y reglas de acceso; verificar que un visitante no puede subir ni sobrescribir archivos.
- [ ] 1.4 Configurar autenticación y el rol de administrador con reglas de colección, middleware de protección y validación en servidor; verificar que un visitante no autenticado no puede abrir ni mutar rutas administrativas.

## 2. Sitio público

- [ ] 2.1 Reemplazar la plantilla de inicio por una portada responsive con héroe editorial, navegación a Noticias, Invitados, Mapa y Agenda, y una jerarquía visual inspirada en la referencia; verificar el recorrido en móvil y escritorio.
- [ ] 2.2 Implementar la lista y detalle de noticias publicadas, ordenadas por fecha y con estado vacío; verificar que borradores no aparecen en las consultas públicas.
- [ ] 2.3 Implementar la sección de invitados publicados con datos biográficos, actividad asociada y fotografía opcional; verificar la visualización con y sin fotografía.
- [ ] 2.4 Implementar la vista de mapa vigente con apertura o descarga del recurso y estado vacío; verificar que solo el mapa publicado más reciente sea accesible.
- [ ] 2.5 Implementar la agenda pública agrupada por fecha y ordenada por hora; verificar un día con actividades y un día vacío.

## 3. Administración de contenidos

- [ ] 3.1 Crear inicio de sesión y panel administrativo con accesos a Noticias, Invitados, Mapas y Agenda; verificar que una sesión administrativa válida permite navegar entre los módulos.
- [ ] 3.2 Implementar formularios y operaciones de crear, editar, publicar, despublicar y eliminar noticias; verificar validación de campos requeridos y reflejo de publicación en el sitio público.
- [ ] 3.3 Implementar formularios y operaciones equivalentes para invitados, incluida la carga de fotografía; verificar que una ficha publicada se actualiza en la vista pública.
- [ ] 3.4 Implementar carga, reemplazo y publicación del mapa; verificar que publicar un mapa nuevo sustituye el recurso vigente para visitantes.
- [ ] 3.5 Implementar formularios y operaciones para actividades, fecha, hora, ubicación y disertantes asociados; verificar que una actividad publicada aparece en el día y orden correctos.

## 4. Calidad y lanzamiento

- [ ] 4.1 Añadir pruebas de las consultas públicas, validaciones y controles de autorización; verificar que las pruebas cubran borradores, estados vacíos y accesos no autorizados.
- [ ] 4.2 Ejecutar `npm run lint` y `npm run build`, corregir los errores encontrados y verificar que ambos comandos terminan correctamente.
- [ ] 4.3 Cargar contenido inicial real, revisar accesibilidad básica y diseño responsive; verificar manualmente el flujo completo de administrador a visitante antes del despliegue.
