# JTV Multiservice

Plataforma de Imprenta y Servicios Gráficos — aplicación web full-stack para la gestión y exhibición del catálogo de productos de JTV Multiservice. Incluye un sitio público para clientes y un panel de administración para la gestión de productos, categorías, imágenes y usuarios administradores.

## Descripción

JTV Multiservice es una empresa de imprenta y servicios gráficos. Esta aplicación centraliza su presencia digital en dos frentes:

- **Sitio público** — catálogo de productos, servicios ofrecidos, galería de trabajos realizados y contacto directo vía WhatsApp.
- **Panel de administración** — herramienta interna para que el equipo de JTV gestione el catálogo (productos, categorías, imágenes) y las cuentas de administrador, sin depender de terceros.

## Características

**Sitio público**

- Catálogo completo con filtros por categoría y búsqueda
- Galería de trabajos realizados
- Información de servicios y de la empresa
- Contacto directo vía WhatsApp

**Autenticación y seguridad**

- Login con JWT (access token) + refresh token
- Verificación en dos pasos por correo (OTP) para nuevas cuentas administradoras, con enlace directo a la página de acceso
- Recuperación de contraseña vía correo
- Blacklist de tokens revocados, rate limiting, cabeceras de seguridad (Helmet) y CORS restringido por origen

## Tecnologías

| Capa                       | Tecnología                                                                       |
| -------------------------- | -------------------------------------------------------------------------------- |
| Frontend                   | React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7                     |
| Backend                    | Node.js, Express, TypeScript                                                     |
| Base de datos              | MongoDB + Mongoose                                                               |
| Almacenamiento de imágenes | Cloudinary                                                                       |
| Envío de correos           | Resend                                                                           |
| Autenticación              | JWT (access token en memoria) + Refresh Token (httpOnly cookie) + OTP por correo |
| Monorepo                   | npm workspaces                                                                   |

## Arquitectura

Monorepo con `apps/web` (frontend) y `apps/api` (backend), sin código compilado compartido — solo `node_modules` se hospeda en la raíz.

```
jtvmultiserviceApp/
├── apps/
│   ├── web/                        # Frontend (Vite + React)
│   │   └── src/
│   │       ├── features/           # Módulos por página (Feature-Based)
│   │       │   ├── home/
│   │       │   ├── catalog/
│   │       │   ├── services/
│   │       │   ├── about/
│   │       │   ├── gallery/
│   │       │   ├── contact/
│   │       │   └── admin/          # Panel de administración
│   │       │       ├── auth/
│   │       │       ├── products/
│   │       │       ├── categories/
│   │       │       └── admins/
│   │       └── shared/             # Componentes, hooks y utilidades compartidas
│   └── api/                        # Backend (Express)
│       └── src/
│           ├── modules/            # Módulos de dominio
│           │   ├── auth/
│           │   ├── products/
│           │   ├── categories/
│           │   └── admin/
│           └── shared/             # Middlewares, config y servicios compartidos
│               ├── middleware/
│               ├── database/
│               ├── config/
│               └── storage/
└── package.json                    # Workspace root
```

Cada módulo del backend sigue la misma estructura autocontenida: `*.routes.ts` (router de Express), `*.controller.ts` (manejo de req/res), `*.service.ts` (lógica de negocio + acceso a datos), `*.model.ts` (esquema de Mongoose) y `*.schema.ts` (validación con Zod).

El frontend admin usa autenticación protegida vía `<ProtectedRoute>` y un `AuthProvider` que mantiene el access token en memoria (nunca en `localStorage`) para reducir la exposición a XSS.

## Variables de entorno

### Backend — `apps/api/.env`

```env
PORT=
NODE_ENV=development

# JWT — clave segura de mínimo 32 caracteres
JWT_SECRET=
JWT_EXPIRES_IN=

CORS_ORIGINS=

# URL pública del frontend (usada en enlaces de correos: OTP, reset de contraseña)
APP_URL=

# MongoDB
MONGODB_URI=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Resend (envío de correos transaccionales)
RESEND_API_KEY=
RESEND_FROM=

# Administrador raíz (se crea automáticamente en el primer arranque)
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

### Frontend — `apps/web/.env`

```env
VITE_API_URL=
VITE_WHATSAPP_NUMBER=
```

> En desarrollo, el servidor de Vite proxea `/api/*` hacia `http://localhost:3000`, por lo que el frontend siempre llama a `/api/...` sin importar el entorno.

## Scripts

Ejecutar desde la raíz del repositorio:

| Script              | Descripción                                      |
| ------------------- | ------------------------------------------------ |
| `npm run dev`       | Inicia frontend (Vite, puerto 5173)              |
| `npm run dev:api`   | Inicia backend en modo watch (tsx, puerto 3000)  |
| `npm run build`     | Compila el frontend (Vite → `dist/`)             |
| `npm run build:api` | Compila el backend (tsc → `dist/`)               |
| `npm run preview`   | Previsualiza el build de producción del frontend |
| `npm run lint`      | Ejecuta el linter sobre el frontend              |

## Estado

En desarrollo activo. Backend desplegado en **Railway** y frontend en **Vercel**.

## Autor

**Randy Madrigal** — [GitHub](https://github.com/RandyMadrigal)

## Licencia

Privado — Propiedad de JTV Multiservice. Todos los derechos reservados.
