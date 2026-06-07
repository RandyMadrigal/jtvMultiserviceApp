# JTV Multiservice — Plataforma de Imprenta y Servicios Gráficos

Aplicación web full-stack para la gestión y exhibición del catálogo de productos de JTV Multiservice. Incluye un sitio público para clientes y un panel de administración para la gestión de productos, categorías e imágenes.

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, React Router v7 |
| Backend | Node.js, Express, TypeScript |
| Base de datos | MongoDB + Mongoose |
| Almacenamiento de imágenes | Cloudinary |
| Autenticación | JWT (access token en memoria) + Refresh Token (httpOnly cookie) |
| Monorepo | npm workspaces |

## Estructura del proyecto

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
│   │       └── shared/             # Componentes y utilidades compartidas
│   └── api/                        # Backend (Express)
│       └── src/
│           ├── modules/            # Módulos de dominio
│           │   ├── auth/
│           │   ├── products/
│           │   ├── categories/
│           │   └── admin/
│           └── shared/             # Middlewares y servicios compartidos
│               ├── middleware/
│               ├── database/
│               └── config/
└── package.json                    # Workspace root
```

## Requisitos previos

- Node.js 20+
- Cuenta en [MongoDB Atlas](https://cloud.mongodb.com) o instancia local de MongoDB
- Cuenta en [Cloudinary](https://cloudinary.com)

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd jtvmultiserviceApp

# Instalar todas las dependencias (frontend + backend)
npm install
```

## Configuración

### Backend — `apps/api/.env`

Crea el archivo copiando el ejemplo:

```bash
cp apps/api/.env.example apps/api/.env
```

Edita `apps/api/.env` con tus credenciales:

```env
PORT=3000
NODE_ENV=development

# JWT — genera una clave segura (mín. 32 caracteres)
# node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
JWT_SECRET=tu_clave_secreta_de_al_menos_32_caracteres
JWT_EXPIRES_IN=15m

CORS_ORIGINS=http://localhost:5173

# MongoDB
MONGODB_URI=mongodb+srv://<usuario>:<contraseña>@cluster.mongodb.net/jtv

# Cloudinary — https://console.cloudinary.com
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# Administrador inicial (se crea automáticamente en el primer arranque)
ADMIN_EMAIL=admin@ejemplo.com
ADMIN_PASSWORD=TuContraseñaSegura123!
```

### Frontend — `apps/web/.env.local`

```env
VITE_WHATSAPP_NUMBER=10000000000
VITE_API_URL=http://localhost:3000
```

## Ejecutar el proyecto

```bash
# Frontend (http://localhost:5173)
npm run dev

# Backend (http://localhost:3000)
npm run dev:api
```

> En el **primer arranque** del backend, se crea automáticamente el administrador definido en `ADMIN_EMAIL` y `ADMIN_PASSWORD`.

## Sitio público

| Ruta | Descripción |
|---|---|
| `/` | Página de inicio con productos destacados |
| `/catalogo` | Catálogo completo con filtros por categoría y búsqueda |
| `/servicios` | Lista de servicios ofrecidos |
| `/galeria` | Galería de trabajos realizados |
| `/nosotros` | Información de la empresa |
| `/contacto` | Formulario de contacto vía WhatsApp |

## Panel de administración

Accede en `/admin/login` con las credenciales configuradas.

| Ruta | Descripción |
|---|---|
| `/admin/products` | Gestión de productos (crear, editar, eliminar) |
| `/admin/categories` | Gestión de categorías |
| `/admin/admins` | Gestión de usuarios administradores |

## API Endpoints

### Autenticación
```
POST   /api/auth/login      Iniciar sesión
POST   /api/auth/refresh    Renovar access token (usa cookie)
POST   /api/auth/logout     Cerrar sesión
GET    /api/auth/me         Información del admin autenticado
```

### Productos (público: GET, admin: resto)
```
GET    /api/products         Listar todos
GET    /api/products/:id     Obtener uno
POST   /api/products         Crear (multipart/form-data)
PUT    /api/products/:id     Editar (multipart/form-data)
DELETE /api/products/:id     Eliminar
```

### Categorías (público: GET, admin: resto)
```
GET    /api/categories       Listar todas
GET    /api/categories/:id   Obtener una
POST   /api/categories       Crear
PUT    /api/categories/:id   Editar
DELETE /api/categories/:id   Eliminar (falla si tiene productos)
```

### Administradores (requiere JWT)
```
GET    /api/admin            Listar administradores
POST   /api/admin            Crear administrador
```

## Seguridad

- **Access token** — JWT de 15 minutos almacenado en memoria (no localStorage)
- **Refresh token** — token aleatorio de 7 días en cookie httpOnly
- **Blacklist** — los tokens revocados se invalidan inmediatamente al hacer logout
- **Rate limiting** — límite global de 120 req/min y 10 intentos de login cada 15 min
- **Helmet** — cabeceras HTTP de seguridad
- **CORS** — solo orígenes configurados en `CORS_ORIGINS`
- **Imágenes** — compresión en frontend (canvas) + optimización en Cloudinary (`q_auto,f_auto`)

## Producción

```bash
# Build del frontend
npm run build

# Build del backend
npm run build:api

# Iniciar backend compilado
npm run start:api
```
