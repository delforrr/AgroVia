# AgroVia

# RoadMap

 Fase 1: El Corazón (Backend & Datos)
   * Semana 1: Configurar PostgreSQL. Crear esquema de tablas (usuarios, avisos, categorias).
   * Semana 1: Implementar authService en backend (Login/Register/Token JWT).
   * Semana 2: Refactorizar avisosRoutes para que lean/escriban en la DB.
   * Semana 2: Implementar subida de imágenes para los avisos (Multer + Storage).

  Fase 2: La Conexión (Frontend Integración)
   * Semana 3: Conectar useAuth con los endpoints reales. Guardar JWT en localStorage o httpOnly cookies.
   * Semana 3: Actualizar el formulario de "Publicar" para que soporte FormData (título + fotos).
   * Semana 4: Implementar estados de carga (CircularProgress) y manejo de errores (Snackbars/Alerts) en toda la UI.

  Fase 3: Pulido y UX (Calidad)
   * Semana 5: Implementar "Favoritos" y "Mis Operaciones" con datos reales.
   * Semana 5: Optimización SEO básica (títulos dinámicos, meta tags para compartir avisos en WhatsApp).
   * Semana 6: Validación de formularios (usar react-hook-form o similar para evitar datos basura en la DB).

  Fase 4: Despliegue (DevOps)
   1. Contenerización: Crear Dockerfile para Frontend y Backend. Configurar docker-compose.yml para levantar la App +
      PostgreSQL en un solo comando.
   2. Infraestructura: Elegir hosting:
       * Backend + DB: Railway, Render o un VPS (Hetzner/DigitalOcean).
       * Frontend: Vercel o Netlify (por su excelente integración con Vite/React).
   3. CI/CD: Configurar GitHub Actions para que cada git push a main despliegue automáticamente.
   4. Dominio: Configurar SSL (HTTPS) y dominio .com.ar.