// Funciones de formateo compartidas en todo el frontend.
// Importar desde aquí evita duplicar la misma lógica en cada página.

/**
 * Formatea un número al estilo argentino (puntos de miles).
 * Retorna '—' si el valor es null o undefined.
 * @example fmt(1500000) → '1.500.000'
 */
export const fmt = (n) => n?.toLocaleString('es-AR') ?? '—';

/**
 * Formatea un monto con su moneda.
 * @example fmtMonto(1500, 'ARS') → '$1.500'
 * @example fmtMonto(85000, 'USD') → 'USD 85.000'
 */
export const fmtMonto = (monto, moneda) =>
    moneda === 'USD'
        ? `USD ${monto?.toLocaleString('es-AR')}`
        : `$${monto?.toLocaleString('es-AR')}`;

/**
 * Formatea una fecha en formato legible en español argentino.
 * @example fmtFecha('2026-03-28') → '28 mar 2026'
 */
export const fmtFecha = (str) =>
    str
        ? new Date(str + 'T00:00:00').toLocaleDateString('es-AR', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
          })
        : '—';

/**
 * Formatea un número con decimales opcionales al estilo argentino.
 * @example fmtPrecio(1234.5, 2) → '1.234,50'
 */
export const fmtPrecio = (n, decimales = 0) =>
    n?.toLocaleString('es-AR', {
        minimumFractionDigits: decimales,
        maximumFractionDigits: decimales,
    }) ?? '—';
