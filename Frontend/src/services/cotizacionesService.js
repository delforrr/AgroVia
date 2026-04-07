/**
 * Servicio de cotizaciones — simula una API externa de precios
 * (estilo MATBA-ROFEX / Bolsa de Rosario / Liniers / BCRA)
 * Incluye latencia artificial para simular red real.
 */

const simularLatencia = (ms = 900) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ── Generador de variación aleatoria ──────────────────────────────────
const variacion = (base, spread = 0.04) => {
  const delta = base * spread * (Math.random() * 2 - 1);
  return parseFloat(delta.toFixed(2));
};

// ── Datos base de cotizaciones ────────────────────────────────────────
const GRANOS_BASE = [
  { id: 'soja',     nombre: 'Soja',         precio: 310000, unidad: '$/tn',    mercado: 'Rosario' },
  { id: 'maiz',     nombre: 'Maíz',         precio: 218000, unidad: '$/tn',    mercado: 'Rosario' },
  { id: 'trigo',    nombre: 'Trigo',         precio: 195000, unidad: '$/tn',    mercado: 'Rosario' },
  { id: 'girasol',  nombre: 'Girasol',       precio: 420000, unidad: '$/tn',    mercado: 'Rosario' },
  { id: 'sorgo',    nombre: 'Sorgo',         precio: 180000, unidad: '$/tn',    mercado: 'Rosario' },
  { id: 'cebada',   nombre: 'Cebada',        precio: 188000, unidad: '$/tn',    mercado: 'Rosario' },
  { id: 'soja_may', nombre: 'Soja (Mayo)',   precio: 316000, unidad: '$/tn',    mercado: 'MATBA-ROFEX' },
  { id: 'maiz_jul', nombre: 'Maíz (Julio)',  precio: 222000, unidad: '$/tn',    mercado: 'MATBA-ROFEX' },
];

const HACIENDA_BASE = [
  { id: 'novillos',   nombre: 'Novillos',        precio: 3850,  unidad: '$/kg vivo', mercado: 'Liniers' },
  { id: 'vacas',      nombre: 'Vacas',            precio: 3200,  unidad: '$/kg vivo', mercado: 'Liniers' },
  { id: 'terneros',   nombre: 'Terneros',         precio: 4100,  unidad: '$/kg vivo', mercado: 'Liniers' },
  { id: 'novillitos', nombre: 'Novillitos',       precio: 4050,  unidad: '$/kg vivo', mercado: 'Liniers' },
  { id: 'toros',      nombre: 'Toros',            precio: 3300,  unidad: '$/kg vivo', mercado: 'Liniers' },
  { id: 'cerdos',     nombre: 'Cerdos (pie)',     precio: 2100,  unidad: '$/kg vivo', mercado: 'UNICA' },
  { id: 'borregos',   nombre: 'Borregos',         precio: 3600,  unidad: '$/kg vivo', mercado: 'Nacional' },
];

const DIVISAS_BASE = [
  { id: 'usd_oficial', nombre: 'USD Oficial',     precio: 1070,  unidad: '$/USD', mercado: 'BCRA' },
  { id: 'usd_mep',     nombre: 'USD MEP',         precio: 1285,  unidad: '$/USD', mercado: 'Mercado' },
  { id: 'usd_ccl',     nombre: 'USD CCL',         precio: 1310,  unidad: '$/USD', mercado: 'Mercado' },
  { id: 'dolar_soja',  nombre: 'Dólar Soja',      precio: 1200,  unidad: '$/USD', mercado: 'BCRA' },
  { id: 'euro',        nombre: 'Euro',            precio: 1150,  unidad: '$/EUR', mercado: 'BCRA' },
  { id: 'real',        nombre: 'Real Brasileño',  precio: 210,   unidad: '$/BRL', mercado: 'BCRA' },
];

// ── Construcción con variaciones ──────────────────────────────────────
const generarCotizaciones = (base) =>
  base.map((item) => {
    const var_dia = variacion(item.precio, 0.025);
    const var_pct = parseFloat(((var_dia / item.precio) * 100).toFixed(2));
    return {
      ...item,
      var_dia,
      var_pct,
      precio_anterior: item.precio - var_dia,
      timestamp: new Date().toISOString(),
    };
  });

// ── Exports públicos ──────────────────────────────────────────────────
export const getCotizaciones = async () => {
  await simularLatencia(800 + Math.random() * 400);
  return {
    granos:   generarCotizaciones(GRANOS_BASE),
    hacienda: generarCotizaciones(HACIENDA_BASE),
    divisas:  generarCotizaciones(DIVISAS_BASE),
    actualizadoEn: new Date().toISOString(),
  };
};
