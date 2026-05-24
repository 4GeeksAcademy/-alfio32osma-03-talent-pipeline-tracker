# EVALUACIÓN — Brasaland Talent Pipeline Tracker

Analiza el proyecto completo y para cada criterio indica:
- ✅ Cumple / ❌ No cumple / ⚠️ Cumple parcialmente
- El archivo y línea exacta donde se implementa (o donde falta)

---

## 1. Vistas y navegación

| # | Criterio | Archivo / Ubicación |
|---|----------|-------------------|
| 1.1 | La página de listado (`/`) renderiza correctamente los datos obtenidos de la API (`GET /records`) | |
| 1.2 | La página de detalle (`/candidates/[id]`) carga y muestra todos los campos del candidato correcto por ID | |
| 1.3 | El App Router de Next.js se usa correctamente para navegación y rutas dinámicas | |

---

## 2. Listado de candidaturas

| # | Criterio | Archivo / Ubicación |
|---|----------|-------------------|
| 2.1 | Los filtros por estado y etapa funcionan usando query parameters (`useSearchParams`) sin recargas de página | |
| 2.2 | La búsqueda por nombre o email funciona sin recargar la página | |

---

## 3. Detalle de candidatura

| # | Criterio | Archivo / Ubicación |
|---|----------|-------------------|
| 3.1 | El estado y la etapa se pueden actualizar desde el detalle usando `PATCH` | |
| 3.2 | Las notas se pueden listar, añadir (`POST`) y eliminar (`DELETE`) desde el detalle | |

---

## 4. Gestión de candidaturas

| # | Criterio | Archivo / Ubicación |
|---|----------|-------------------|
| 4.1 | Las nuevas candidaturas se pueden registrar mediante un formulario usando `POST` | |
| 4.2 | Los datos de una candidatura existente se pueden editar mediante un formulario usando `PUT` | |

---

## 5. Estado asíncrono

| # | Criterio | Archivo / Ubicación |
|---|----------|-------------------|
| 5.1 | Los estados de carga, éxito y error son visibles para el usuario en todas las operaciones asíncronas | |

---

## 6. Calidad del código

| # | Criterio | Archivo / Ubicación |
|---|----------|-------------------|
| 6.1 | Los tipos TypeScript están definidos y se usan para todas las estructuras de datos de la API | |
| 6.2 | La estructura de carpetas separa componentes, tipos y lógica de acceso a datos | |
| 6.3 | No hay prop drilling — el estado está correctamente acotado a nivel de componente | |

---

## 7. Contexto de empresa

| # | Criterio | Archivo / Ubicación |
|---|----------|-------------------|
| 7.1 | La implementación refleja el contexto de Brasaland: nombres de campo, etiquetas en español y valores del dominio correctos (nunca valores crudos de la API) | |

---

## 8. Diseño

> **Requisito de diseño:** La interfaz debe ser **extremadamente profesional y minimalista**.
> Tipografía limpia, espaciado generoso, paleta reducida, sin elementos decorativos innecesarios.
> Toda la información requerida debe ser visible con claridad y jerarquía visual correcta.

| # | Criterio | Archivo / Ubicación |
|---|----------|-------------------|
| 8.1 | La interfaz presenta una estética profesional y minimalista coherente en todas las vistas | |
| 8.2 | La jerarquía visual es clara y toda la información requerida se muestra sin ambigüedad | |

---

## Resumen de hallazgos

### Criterios cumplidos
-

### Criterios incumplidos o parciales
-

### Archivos que requieren cambios
-
