# Bitácora — Instrucciones para Copilot

## Descripción del proyecto
Aplicación web full-stack para registro de muestreos botánicos de campo. Permite a investigadores documentar tareas de muestreo con ubicación GPS, fotos, detalles de especies y condiciones climáticas. Soporta colaboración entre usuarios y exportación a CSV/PDF.

## Stack tecnológico

### Backend
- **Runtime**: Node.js con TypeScript 5.9 (ES Modules, `"type": "module"`)
- **Framework**: Express 4.21
- **Base de datos**: MongoDB Atlas con Mongoose 8.8
- **Autenticación**: JWT en HttpOnly cookies + bcryptjs
- **Validación**: Zod schemas
- **Exportación**: PDFKit (PDF), json2csv (CSV)
- **Dev**: `tsx watch` para desarrollo, `tsc` para build
- **tsconfig**: target ES2020, module NodeNext, strict mode

### Frontend
- **Framework**: Angular 21 (standalone components, signals)
- **Estilos**: Tailwind CSS v4 vía `@tailwindcss/postcss`
- **Storage**: Firebase SDK directo (sin @angular/fire)
- **Mapas**: Leaflet
- **State management**: Signal-based stores (AuthStore, TasksStore)
- **Guards**: Funcionales con `CanActivateFn`

## Estructura del proyecto

```
bitacora/
├── src/                          # Backend
│   ├── Server/                   # App.ts, Config.ts, Db.ts, Index.ts
│   ├── Controllers/              # Auth, Tasks, Admin, Collaborator, Formato
│   ├── Models/                   # User.model.ts, Task.model.ts
│   ├── Middlewares/              # ValidateToken.ts, Validator.middleware.ts
│   ├── Routes/                   # Auth, Tasks, Collaborator, Formato
│   ├── Schemas/                  # Zod schemas (Auth, Task, Formato)
│   ├── Libs/                     # jwt.ts
│   └── types/                    # index.ts (interfaces compartidas)
├── frontend/                     # Angular 21
│   └── src/app/
│       ├── services/             # auth, tasks, collaborator, formato
│       ├── store/                # auth.store.ts, tasks.store.ts
│       ├── guards/               # auth.guard.ts (authGuard, adminGuard)
│       ├── pages/                # 13 páginas standalone
│       ├── components/           # navbar, card, details, users-card, layout
│       ├── interfaces/           # index.ts
│       ├── firebase/             # config.ts (uploadFile, deleteFile)
│       └── environments/         # environment.ts, environment.prod.ts
├── .env                          # TOKEN_SECRET, MONGODB_URI, CORS_ORIGIN, PORT
└── package.json                  # Backend dependencies + scripts
```

## Roles de usuario
- **administrador**: gestiona usuarios, ve todo
- **investigador**: crea tareas de muestreo, agrega colaboradores
- **colaborador**: ve tareas asignadas, no puede crear

## Convenciones de código

### Backend
- Controllers exportan funciones `async` con tipado `(req: Request, res: Response): Promise<void>`
- Imports usan extensión `.js` (requerido por NodeNext module resolution)
- Imports de tipos usan `import type { ... }`
- Rutas bajo `/api` (ej: `/api/tasks`, `/api/register`)
- Errores devuelven JSON con `{ message: "..." }` o arrays `["error"]`
- Middleware de auth: `authRequired`, `adminRequired`, `optionalAuth`

### Frontend
- Componentes standalone (sin NgModules)
- State management con Angular signals (`signal()`, `computed()`)
- Services usan `HttpClient` con `{ withCredentials: true }`
- Stores usan `firstValueFrom()` para convertir Observable → Promise
- Rutas con lazy loading: `loadComponent: () => import(...)`
- Tailwind classes directamente en templates


## Comandos frecuentes
```bash
# Backend
npm run dev          # tsx watch src/Server/Index.ts
npx tsc --noEmit     # Verificar tipos sin compilar

# Frontend
cd frontend
npx ng serve         # Dev server en :4200
npx ng build         # Build de producción
```

## Rama actual
`PATRONES_DISEÑO` — implementación de patrones de diseño sobre la migración completada.
