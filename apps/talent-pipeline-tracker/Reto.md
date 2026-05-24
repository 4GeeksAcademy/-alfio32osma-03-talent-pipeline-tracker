## CONTEXTO ADICIONAL — El reto

Herramienta interna real que el equipo de People usará desde el lunes.
La API REST ya está construida y documentada en:
https://playground.4geeks.com/tracker/api/v1/docs

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