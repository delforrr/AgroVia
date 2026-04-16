// Chip reutilizable que muestra el estado de una operación con color semántico.
// Reemplaza las copias duplicadas en Inicio.jsx, Operaciones.jsx y Perfil.jsx.

import { Chip } from '@mui/material';
import { ESTADO_OP_CONFIG } from '../../constants/colores.js';

/**
 * EstadoChip — Chip de estado de operación.
 * @param {string} estado - Estado de la operación (Iniciada, En revisión, etc.)
 */
export default function EstadoChip({ estado }) {
    const cfg = ESTADO_OP_CONFIG[estado] ?? { color: '#333', bg: '#eee', label: estado };
    return (
        <Chip
            size="small"
            label={cfg.label}
            sx={{
                fontWeight: 700,
                fontSize: '0.72rem',
                color: cfg.color,
                backgroundColor: cfg.bg,
                border: `1px solid ${cfg.color}40`,
            }}
        />
    );
}
