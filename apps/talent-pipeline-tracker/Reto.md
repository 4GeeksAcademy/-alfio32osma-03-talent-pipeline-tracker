## CONTEXTO ADICIONAL — El reto

Herramienta interna real que el equipo de People usará desde el lunes.
La API REST ya está construida y documentada en:
Usar la variable TRACKER_API_URL y su documentación en TRACKER_API_URL/docs

### REQUISITOS CLAVE
- Listado de candidaturas: nombre, puesto, estado y etapa
- Filtros por estado/etapa + búsqueda por nombre o email (sin recarga)
- Vista de detalle con cambio de estado/etapa en una sola interacción
- Añadir y eliminar notas internas por candidatura
- Registrar nuevas candidaturas y editar datos existentes

### REQUISITOS TÉCNICOS NO NEGOCIABLES
- Todas las peticiones a la API deben ser asíncronas
- La UI debe mostrar estados de carga (loading) en todo momento
- Los errores deben manejarse y mostrarse con claridad al usuario
- Cero fallos silenciosos — el usuario siempre debe saber qué está pasando