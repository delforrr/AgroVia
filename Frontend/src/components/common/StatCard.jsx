// Tarjeta de estadística reutilizable con ícono, valor y etiqueta.
// Unifica StatCard de AdminPanel.jsx y Mercado.jsx.

import { Paper, Box, Typography, CircularProgress } from '@mui/material';
import { alpha } from '@mui/material/styles';

/**
 * StatCard — Tarjeta de estadística con ícono y valor.
 * @param {string}  label   - Etiqueta descriptiva
 * @param {*}       value   - Valor a mostrar (null muestra un spinner)
 * @param {node}    icon    - Ícono MUI
 * @param {string}  color   - Token de color del tema ('primary', 'success', etc.)
 *                           o un color hex directo ('#2e7d32')
 * @param {string}  [sub]   - Texto auxiliar opcional (subtítulo)
 * @param {string}  [variant] - 'icon' para el estilo con ícono grande (AdminPanel),
 *                              'gradient' para el estilo con fondo degradado (Mercado)
 */
export default function StatCard({ label, value, icon, color = 'primary', sub, variant = 'icon' }) {
    const isToken = !color.startsWith('#');

    if (variant === 'gradient') {
        // Estilo usado en Mercado.jsx — fondo degradado, color directo hex
        return (
            <Paper
                elevation={0}
                sx={{
                    flex: '1 1 140px',
                    p: 2,
                    borderRadius: 3,
                    border: '1px solid rgba(0,0,0,0.07)',
                    background: `linear-gradient(135deg, ${color}18 0%, ${color}08 100%)`,
                }}
            >
                <Typography variant="caption" color="text.secondary" fontWeight={600} textTransform="uppercase" letterSpacing="0.05em">
                    {label}
                </Typography>
                <Typography variant="h6" fontWeight={700} color={color} lineHeight={1.2} mt={0.5}>
                    {value}
                </Typography>
                {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
            </Paper>
        );
    }

    // Estilo por defecto — ícono + valor con color del tema (AdminPanel)
    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5, borderRadius: 4, flex: 1, minWidth: 140,
                border: '1px solid', borderColor: 'divider',
                display: 'flex', alignItems: 'center', gap: 2,
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
            }}
        >
            {icon && (
                <Box
                    sx={{
                        width: 48, height: 48, borderRadius: 3, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        bgcolor: isToken
                            ? (theme) => alpha(theme.palette[color].main, 0.12)
                            : `${color}20`,
                        color: isToken ? `${color}.main` : color,
                    }}
                >
                    {icon}
                </Box>
            )}
            <Box>
                <Typography variant="h5" fontWeight={700} color={isToken ? `${color}.main` : color}>
                    {value ?? <CircularProgress size={18} />}
                </Typography>
                <Typography variant="caption" color="text.secondary">{label}</Typography>
            </Box>
        </Paper>
    );
}
