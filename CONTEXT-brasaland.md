## CONTEXTO DEL PROYECTO — Brasaland Talent Pipeline Tracker

Estás construyendo una herramienta frontend de RRHH para Brasaland Digital
(equipo tecnológico interno de una cadena de restaurantes).
La People Manager necesita reemplazar un Google Sheets roto para gestionar
candidaturas de empleo.

---

### STACK Y CONFIGURACIÓN
- Solo frontend (el backend/API mock ya existe)
- SPA — sin recargas de página al filtrar o buscar
- Idioma de la interfaz: español (ver mapeos abajo)

---

### URL BASE DE LA API
https://[url-del-mock]  ← reemplazar con la real

### ENDPOINTS (REST estándar asumido)
GET    /candidates               → listar todos los candidatos
GET    /candidates/:id           → detalle de un candidato
POST   /candidates               → crear candidato
PATCH  /candidates/:id           → actualizar estado, etapa o datos
POST   /candidates/:id/notes     → añadir nota interna
DELETE /candidates/:id/notes/:noteId → eliminar nota

---

### MODELO DE DATOS

Candidato {
  id, nombre, email, puesto, estado, etapa, notas[]
}

VALORES DE ESTADO (API → etiqueta en UI):
  received    → "Recibida"
  in_progress → "En proceso"
  selected    → "Seleccionada"
  discarded   → "Descartada"

VALORES DE ETAPA (API → etiqueta en UI):
  pending              → "Pendiente de revisión"
  review               → "En revisión"
  personal_interview   → "Entrevista personal"
  technical_interview  → "Entrevista técnica"
  offer_presented      → "Oferta presentada"

⚠ NUNCA mostrar los valores crudos de la API en la interfaz.
  Usar siempre las etiquetas en español de la tabla anterior.

---

### FUNCIONALIDADES REQUERIDAS

1. VISTA DE LISTA DE CANDIDATOS
   - Mostrar: nombre, puesto, estado (etiqueta), etapa (etiqueta)
   - Filtrar por estado y etapa (desplegables)
   - Buscar por nombre o email (sin recarga de página)

2. VISTA DE DETALLE DEL CANDIDATO
   - Mostrar todos los campos del candidato
   - Editar estado y etapa en línea (guardar vía PATCH)
   - Mostrar notas internas (solo visibles en esta vista)
   - Añadir nueva nota (POST)
   - Eliminar nota existente (DELETE)

3. FORMULARIO DE REGISTRO DE CANDIDATO
   - Todos los campos requeridos por la API
   - Para candidatos que llegan por otras vías

4. FORMULARIO DE EDICIÓN DE CANDIDATO
   - Corregir datos erróneos de candidatos existentes (PATCH)

---

### CRITERIOS DE ACEPTACIÓN
- Estado y etapa siempre mostrados como etiquetas en español,
  nunca como valores crudos de la API
- Las notas solo son visibles en el detalle, no en la lista
- El formulario de creación incluye todos los campos requeridos por la API
- Todas las interacciones ocurren sin recarga completa de la página