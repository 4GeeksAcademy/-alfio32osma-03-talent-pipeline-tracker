## TAREAS A IMPLEMENTAR

### STACK OBLIGATORIO
- Next.js App Router + React + TypeScript
- Estado a nivel de componente con hooks (NO Redux, Zustand, Jotai, etc.)
- Filtros via useSearchParams (query parameters)

---

### VISTAS Y RUTAS
- /                    → Listado de candidaturas (GET /records)
- /candidates/[id]     → Detalle de candidatura (GET /records/:id)

---

### PÁGINA DE LISTADO ( / )
- Mostrar: nombre completo, puesto, estado, etapa
- Filtro por estado y etapa → useSearchParams (query params)
- Búsqueda por nombre o email → sin recarga de página
- Estado de carga (loading) + mensaje de error si la petición falla

---

### PÁGINA DE DETALLE ( /candidates/[id] )
Campos a mostrar:
  nombre, email, teléfono, puesto, LinkedIn, enlace CV,
  años de experiencia, estado, etapa, fecha de aplicación

Acciones:
  PATCH  /records/:id               → actualizar estado
  PATCH  /records/:id               → actualizar etapa
  GET    /records/:id/notes         → listar notas
  POST   /records/:id/notes         → añadir nota
  DELETE /records/:id/notes/:note_id → eliminar nota

---

### GESTIÓN DE CANDIDATURAS
- Formulario de registro   → POST /records
- Formulario de edición    → PUT  /records/:id
- Ambos formularios deben validar campos requeridos antes de enviar
- Mostrar feedback de éxito o error tras cada envío

---

### ESTADO ASÍNCRONO (obligatorio en todas las llamadas)
- Todas las llamadas a la API con async/await
- Cada operación debe tener 3 estados en la UI: cargando / éxito / error
- Tras PATCH, PUT o POST → actualizar la UI sin recarga completa

---

### ESTRUCTURA DEL CÓDIGO
/components
/hooks        (si aplica)
/types        ← tipos TypeScript para TODAS las estructuras de la API
/lib o /services

---

### ⚠ IMPORTANTES
- Los nombres de campos, etiquetas y estados deben coincidir
  con el CONTEXT.md de Brasaland (no usar nombres genéricos)
- La interfaz debe sentirse como una herramienta interna de
  Brasaland Digital, no una app genérica