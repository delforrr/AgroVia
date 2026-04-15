# 🌾 AgroVia — Guía de Arquitectura: Vercel + Railway + Supabase

> **Estado del análisis:** Tu codebase ya tiene implementado ~70% del flujo. Este documento completa las piezas faltantes y te da el código exacto listo para pegar.

---

## Mapa de la Arquitectura

```mermaid
graph LR
    subgraph "Vercel (Frontend)"
        A[React + Vite] --> B[supabaseClient.js]
        A --> C[api.js con Axios]
    end

    subgraph "Supabase"
        D[Auth / JWT] --> E[PostgreSQL + RLS]
    end

    subgraph "Railway (Backend)"
        F[Express API] --> G[authMiddleware]
        G --> H[DB Pool → Supabase PG]
    end

    B <-->|Auth / JWT Token| D
    C -->|Bearer JWT en headers| F
    H -->|DATABASE_URL| E
```

**Flujo de seguridad:**
1. Usuario hace login → Supabase devuelve un JWT
2. Frontend adjunta ese JWT como `Authorization: Bearer <token>` en cada request al backend
3. El backend valida el JWT con `SUPABASE_JWT_SECRET` y extrae `user_id`
4. La DB aplica RLS: cada query solo devuelve/modifica los registros del usuario autenticado

---

## 1. ✅ Frontend — `supabaseClient.js` (YA IMPLEMENTADO)

> **Tu archivo** `Frontend/src/lib/supabaseClient.js` está correcto. No necesita cambios.

```js
// Frontend/src/lib/supabaseClient.js — ESTADO ACTUAL ✅
import { createClient } from '@supabase/supabase-js';

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
```

**Agregado pendiente — Login con Google (OAuth):**
Incorporar esta función en `useAuth.js` si querés Google como método de login:

```js
// Agregar dentro de useAuth.js, junto al login/register existente
const loginConGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            // Después del callback, Supabase redirige aquí
            redirectTo: `${window.location.origin}/perfil`,
        },
    });
    if (error) setError(error.message);
}, []);

// Agregar al return del hook:
// return { ..., loginConGoogle };
```

> **Requisito en Supabase Dashboard:** Authentication → Providers → Google → habilitar y cargar `Client ID` + `Client Secret` de Google Cloud Console.

---

## 2. ✅ Frontend — `api.js` con JWT (YA IMPLEMENTADO)

> **Tu archivo** `Frontend/src/services/api.js` ya envía el Bearer token correctamente. No necesita cambios.

```js
// ESTADO ACTUAL ✅ — el patrón getAuthHeaders() es correcto
async function getAuthHeaders() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) return {};
    return { Authorization: `Bearer ${session.access_token}` };
}
```

**Mejora recomendada** — Centralizar la `BASE_URL` para todas las entidades (no solo avisos):

```js
// Frontend/src/services/api.js — BASE_URL centralizada
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// ✅ Uso correcto por entidad:
const AVISOS_BASE  = `${BASE_URL}/api/avisos`;
const USERS_BASE   = `${BASE_URL}/api/usuarios`;
// ... etc
```

---

## 3. ✅ Backend — `authMiddleware` en Express (YA IMPLEMENTADO)

> **Tu `index.js`** ya tiene el middleware correcto. Lo único pendiente es **aplicarlo** a las rutas que lo requieren.

```js
// Backend/index.js — ESTADO ACTUAL ✅
export function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de autenticación requerido.' });
    }
    const token = authHeader.split(' ')[1];
    const secret = process.env.SUPABASE_JWT_SECRET;
    // ...
    const decoded = jwt.verify(token, secret);
    req.userId = decoded.sub; // ← UUID del usuario de Supabase Auth
    next();
}
```

### ⚠️ ACCIÓN PENDIENTE: Aplicar el middleware a las rutas protegidas

```js
// Backend/routes/avisos.js — MODIFICAR así:
import express from 'express';
import * as avisosController from '../controllers/avisosController.js';
import upload from '../middlewares/upload.js';
import { authMiddleware } from '../index.js';  // ← AGREGAR

const router = express.Router();

// Públicas (lectura sin auth)
router.get('/',    avisosController.getAvisos);
router.get('/:id', avisosController.getAvisoById);

// Protegidas (requieren JWT válido)
router.post('/',    authMiddleware, upload.single('imagen'), avisosController.createAviso);
router.put('/:id',  authMiddleware, upload.single('imagen'), avisosController.updateAviso);
router.delete('/:id', authMiddleware, avisosController.deleteAviso);

export default router;
```

> **Importante:** Para evitar importación circular entre `index.js` y `routes/`, se recomienda mover el `authMiddleware` a su propio archivo: `Backend/middlewares/auth.js`.

### Versión correcta sin importación circular:

```js
// Backend/middlewares/auth.js ← CREAR ESTE ARCHIVO
import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de autenticación requerido.' });
    }

    const token  = authHeader.split(' ')[1];
    const secret = process.env.SUPABASE_JWT_SECRET;

    if (!secret) {
        console.warn('[Auth] ⚠️  SUPABASE_JWT_SECRET no definido — omitiendo validación JWT');
        return next();
    }

    try {
        const decoded = jwt.verify(token, secret);
        req.userId = decoded.sub; // UUID del usuario en Supabase Auth
        next();
    } catch {
        return res.status(401).json({ error: 'Token inválido o expirado.' });
    }
}
```

Y en `Backend/routes/avisos.js`:
```js
import { authMiddleware } from '../middlewares/auth.js'; // ← sin circular imports
```

---

## 4. 🔒 Base de Datos — Políticas RLS en Supabase

Ejecutar en **Supabase Dashboard → SQL Editor**:

### a) Habilitar RLS en la tabla `avisos`

```sql
-- Habilitar Row Level Security en la tabla avisos
ALTER TABLE avisos ENABLE ROW LEVEL SECURITY;

-- LECTURA: cualquiera puede ver los avisos activos
CREATE POLICY "avisos_lectura_publica"
    ON avisos FOR SELECT
    USING (estado = 'activo');

-- INSERCIÓN: solo usuarios autenticados, y el user_id debe coincidir
CREATE POLICY "avisos_crear_propio"
    ON avisos FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ACTUALIZACIÓN: solo el creador puede editar su aviso
CREATE POLICY "avisos_editar_propio"
    ON avisos FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ELIMINACIÓN (soft delete): solo el creador puede borrar
CREATE POLICY "avisos_eliminar_propio"
    ON avisos FOR DELETE
    USING (auth.uid() = user_id);
```

### b) Habilitar RLS en la tabla `usuarios`

```sql
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Cada usuario solo puede ver su propio perfil
CREATE POLICY "usuarios_ver_propio"
    ON usuarios FOR SELECT
    USING (auth.uid() = id);

-- Cada usuario solo puede editar su propio perfil
CREATE POLICY "usuarios_editar_propio"
    ON usuarios FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
```

### c) Trigger para crear perfil automáticamente al registrarse

```sql
-- Función que crea un registro en public.usuarios cuando se crea un auth.user
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.usuarios (id, email, nombre, created_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'nombre', split_part(NEW.email, '@', 1)),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING; -- evita error si ya existe
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que llama a la función en cada nuevo usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

> **Nota:** El `useAuth.js` ya llama a `supabase.from('usuarios').select('*')` esperando este trigger. Si el trigger no existe, el perfil no se crea automáticamente.

---

## 5. 🔑 Variables de Entorno por Plataforma

### Vercel (Frontend)

| Variable | Valor | Dónde encontrarlo |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://xxxx.supabase.co` | Supabase → Settings → API → Project URL |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` | Supabase → Settings → API → `anon public` key |
| `VITE_API_URL` | `https://tu-app.railway.app` | Railway → tu servicio → Settings → Domain |

> **Importante en Vercel:** Settings → Environment Variables → agregar las 3 variables. Las variables con prefijo `VITE_` son las únicas expuestas al cliente de forma segura por Vite.

### Railway (Backend)

| Variable | Valor | Dónde encontrarlo |
|---|---|---|
| `DATABASE_URL` | `postgresql://postgres.[ref]:[pass]@...` | Supabase → Settings → Database → Transaction pooler |
| `SUPABASE_JWT_SECRET` | `your-super-secret-key` | Supabase → Settings → API → JWT Settings → JWT Secret |
| `PORT` | `3000` (Railway lo setea solo) | Automático en Railway |
| `NODE_ENV` | `production` | Setearlo manualmente |

> **Importante en Railway:** Variables → agregar `DATABASE_URL`, `SUPABASE_JWT_SECRET` y `NODE_ENV=production`. Railway asigna `PORT` automáticamente.

---

## 6. 🚀 CORS — Configuración de producción

El `index.js` actual usa `app.use(cors())` que permite **todos los orígenes**. En producción, restringirlo:

```js
// Backend/index.js — reemplazar app.use(cors()) por:
const allowedOrigins = [
    'http://localhost:5173',                                     // desarrollo local
    process.env.FRONTEND_URL,                                    // ← AGREGAR variable en Railway
];

app.use(cors({
    origin: (origin, callback) => {
        // Permitir requests sin origen (Postman, curl, etc en dev)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS: origen no permitido → ${origin}`));
        }
    },
    credentials: true, // necesario si usás cookies/sessions
}));
```

**Variable adicional en Railway:**

| Variable | Valor |
|---|---|
| `FRONTEND_URL` | `https://tu-app.vercel.app` |

---

## 7. 📦 Build Script faltante en Backend

El `GEMINI.md` menciona que falta el `build` script en `Backend/package.json`. Agregarlo:

```json
// Backend/package.json — agregar en "scripts":
{
  "scripts": {
    "start": "node index.js",
    "dev":   "node --watch index.js",
    "build": "echo 'Backend listo (no requiere compilación)' && exit 0"
  }
}
```

En Railway, configurar el **Start Command** como `node index.js` (no `npm run dev`).

---

## Checklist de Despliegue

### Supabase
- [ ] Crear tabla `usuarios` con columnas: `id uuid PRIMARY KEY REFERENCES auth.users`, `email`, `nombre`, `apellido`, `telefono`, `provincia`, `localidad`, `cuit`, `rol`, `created_at`, `updated_at`
- [ ] Ejecutar el trigger `handle_new_user`
- [ ] Habilitar RLS y crear las 4 políticas para `avisos`
- [ ] Habilitar RLS y crear las 2 políticas para `usuarios`
- [ ] (Opcional) Habilitar Google OAuth en Authentication → Providers

### Railway (Backend)
- [ ] Conectar repo desde GitHub
- [ ] Configurar variables: `DATABASE_URL`, `SUPABASE_JWT_SECRET`, `NODE_ENV=production`, `FRONTEND_URL`
- [ ] Start command: `node index.js`
- [ ] Crear archivo `Backend/middlewares/auth.js` y aplicarlo a rutas POST/PUT/DELETE
- [ ] Configurar CORS para aceptar solo el dominio de Vercel

### Vercel (Frontend)
- [ ] Conectar repo desde GitHub, seleccionar carpeta `Frontend/`
- [ ] Framework preset: **Vite**
- [ ] Build command: `npm run build`
- [ ] Output directory: `dist`
- [ ] Configurar variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`
