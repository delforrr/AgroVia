// Chip reutilizable que muestra variación porcentual de precios (alza/baja).
// Usado en Inicio (cotizaciones) y Mercado (tabla de granos/hacienda/divisas).

import { Chip } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

/**
 * VarChip — Chip de variación porcentual.
 * @param {number|null} pct - Porcentaje de variación (positivo = alza, negativo = baja)
 */
export default function VarChip({ pct }) {
    if (pct == null) return null;
    const up = pct >= 0;
    return (
        <Chip
            size="small"
            icon={
                up
                    ? <TrendingUpIcon sx={{ fontSize: '14px !important' }} />
                    : <TrendingDownIcon sx={{ fontSize: '14px !important' }} />
            }
            label={`${up ? '+' : ''}${pct}%`}
            sx={{
                height: 20,
                fontSize: '0.7rem',
                fontWeight: 700,
                bgcolor: up ? '#e8f5e9' : '#fce4ec',
                color: up ? '#2e7d32' : '#c62828',
                '& .MuiChip-icon': { color: 'inherit' },
            }}
        />
    );
}
