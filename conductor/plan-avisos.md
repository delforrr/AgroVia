# Plan de Implementación: Corrección de Publicar Aviso y Backend

## Background & Motivation
El formulario de "Publicar Aviso" presenta varias deficiencias críticas: falta de validaciones numéricas estrictas en campos monetarios y de contacto, uso de un input de texto para la moneda en lugar de un selector, y la ausencia de campos específicos por categoría. Esta última deficiencia provoca que las inserciones en las tablas dependientes de PostgreSQL fallen silenciosamente o revuelvan la transacción, lo que a su vez causa un "cuelgue infinito" en el frontend al no manejarse adecuadamente el error de la petición asíncrona. Adicionalmente, el frontend solicita el ingreso manual del nombre y teléfono del vendedor, redundando la lógica del backend que ya asocia estos datos mediante el `id_usuario` proveniente del token JWT. Finalmente, existen registros previos en Supabase cuyo estado `eliminado` impide su visualización en la plataforma.

## Scope & Impact
Las modificaciones impactarán directamente la experiencia de publicación de avisos y su visualización.
- **Frontend (`PublicarModal.jsx`, `useAvisos.js`):** Añadido de validaciones, componente select para moneda, eliminación de campos redundantes (`vendedor`, `telefono`) y adición de campos dinámicos de acuerdo con la categoría seleccionada (ej. `tipo_animal` para Hacienda). Mejora en el manejo de errores para evitar que la UI quede bloqueada ("cuelgue infinito").
- **Backend / Supabase:** Mantenimiento del modelo existente de `Aviso.js`, pero asegurando que la data enviada por el frontend coincida con la requerida por el esquema de PostgreSQL. Ejecución de un query para recuperar visibilidad de avisos marcados erróneamente.

## Proposed Solution & Implementation Steps

### Fase 1: Ajustes en el Frontend (Validaciones y Campos Base)
1. Editar `Frontend/src/hooks/useAvisos.js`:
   - Eliminar `vendedor` y `telefono` del array `CAMPOS_BASE`, ya que el backend obtiene automáticamente esta información a partir del `id_usuario`.
   - Asegurarse de que `precio` esté tipado adecuadamente.
2. Editar `Frontend/src/components/features/avisos/PublicarModal.jsx`:
   - Modificar el renderizado de `precio` para incluir restricciones numéricas (e.g., `type="number"`, `inputProps={{ min: 0 }}`).
   - Cambiar el campo `moneda` por un componente `<Select>` con opciones fijas (ARS, USD).

### Fase 2: Implementación de Campos Específicos por Categoría
1. En `PublicarModal.jsx`, agregar una lógica para renderizar campos adicionales obligatorios dependiendo del valor de `form.categoria` seleccionado:
   - **Hacienda:** `tipo_animal`, `condicion`, `cantidad_cabezas` (opcional), `peso_promedio_kg` (opcional), `sanidad`.
   - **Maquinaria:** `marca`, `modelo`, `anio` (opcional), `horas_uso` (opcional), `tipo_maquinaria`.
   - **Granos:** `cultivo`, `cantidad_tn` (opcional), `humedad`.
   - **Servicios:** `tipo_servicio`, `modalidad`, `disponibilidad`, `area_cobertura`, `unidad_precio`.
2. Asegurarse de que el estado `form` recoja todos estos nuevos valores y los incluya en el `FormData` que se envía a la función `onSubmit`.

### Fase 3: Corrección del "Cuelgue Infinito"
1. En `PublicarModal.jsx`, envolver el llamado a `await onSubmit(formData)` dentro de un bloque `try/catch` para manejar fallos eventuales en la petición o validación, asegurando que si ocurre un error, la ejecución no se interrumpa silenciosamente (lo cual evita el reseteo del formulario y muestra correctamente el mensaje de error).

### Fase 4: Restablecimiento de Registros en Supabase
1. Ejecutar el comando `npx supabase db query "UPDATE public.avisos SET estado = 'activo' WHERE estado = 'eliminado';"` para que las entradas previamente ocultas se visualicen en la página principal.

## Verification & Testing
1. Abrir la interfaz de publicación y constatar que `vendedor` y `telefono` ya no se solicitan manualmente.
2. Cambiar entre las diferentes categorías en el modal y confirmar que los campos adicionales requeridos se despliegan correctamente.
3. Probar ingresar valores no numéricos en `precio` para comprobar que la validación lo rechaza.
4. Intentar enviar el formulario sin los campos específicos y verificar que el error se maneje elegantemente (el botón de carga se detiene y aparece la alerta de error).
5. Publicar un nuevo aviso con todos los campos completados, confirmando que la operación termina exitosamente y el aviso aparece en la lista con el nombre del usuario correcto (basado en su cuenta de Supabase).
6. Verificar que los 2 registros previos aparezcan nuevamente en la interfaz.

## Migration & Rollback
Si los cambios en `PublicarModal.jsx` introducen regresiones (ej., falla de renderizado de los componentes condicionales de Material UI), se puede revertir fácilmente a la versión anterior del archivo (`git checkout -- Frontend/src/components/features/avisos/PublicarModal.jsx`) dado que no hay migraciones destructivas de base de datos involucradas.
