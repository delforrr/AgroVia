// Configuración centralizada de colores y estilos por categoría y estado.
// Importar desde aquí evita duplicar ESTADO_CFG, TIPO_COLOR, etc. en cada página.

// ── Estados de operación ──────────────────────────────────────────────────────
export const ESTADO_OP_CONFIG = {
    Iniciada:      { color: '#1976d2', bg: '#e3f2fd', label: 'Iniciada' },
    'En revisión': { color: '#f57c00', bg: '#fff3e0', label: 'En revisión' },
    Documentación: { color: '#7b1fa2', bg: '#f3e5f5', label: 'Documentación' },
    Firmada:       { color: '#2e7d32', bg: '#e8f5e9', label: 'Firmada' },
    Cerrada:       { color: '#546e7a', bg: '#eceff1', label: 'Cerrada' },
    Cancelada:     { color: '#c62828', bg: '#fce4ec', label: 'Cancelada' },
};

// ── Estados de aviso (para el panel de admin) ─────────────────────────────────
export const ESTADO_AVISO_CONFIG = {
    activo:    { label: 'Activo',    color: 'success' },
    pausado:   { label: 'Pausado',   color: 'warning' },
    eliminado: { label: 'Eliminado', color: 'error'   },
};

// ── Colores por tipo de operación ─────────────────────────────────────────────
export const TIPO_OP_COLOR = {
    Venta:    '#6A8E5E',
    Compra:   '#A0785E',
    Servicio: '#5E7FA0',
};

// ── Colores por estado de operación en historial ──────────────────────────────
export const ESTADO_OP_TAB_COLOR = {
    Completada: { bg: '#e8f5e9', text: '#2e7d32' },
    'En proceso': { bg: '#fff8e1', text: '#f57f17' },
    Cancelada:  { bg: '#fce4ec', text: '#c62828' },
};

// ── Configuración visual por categoría de aviso ───────────────────────────────
// Colores y emojis de avatar usado en vistas de listas
export const CATEGORIA_COLOR = {
    Hacienda:   { bg: '#e8f5e9', emoji: '🐄', hex: '#6A8E5E' },
    Maquinaria: { bg: '#e3f2fd', emoji: '🚜', hex: '#A0785E' },
    Granos:     { bg: '#fff8e1', emoji: '🌾', hex: '#C6A84B' },
    Servicios:  { bg: '#f3e5f5', emoji: '🔧', hex: '#5E7FA0' },
};
