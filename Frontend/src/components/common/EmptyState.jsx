// Estado vacío reutilizable para listas sin resultados.
// Reemplaza los distintos "Sin resultados" inline en Avisos.jsx y Operaciones.jsx.

import { Box, Typography, Button } from '@mui/material';

/**
 * EmptyState — Pantalla de estado vacío con emoji, título y acción opcional.
 * @param {string}   emoji     - Emoji grande para mostrar (default: '🌾')
 * @param {string}   title     - Título principal
 * @param {string}   [message] - Descripción secundaria opcional
 * @param {string}   [action]  - Texto del botón de acción opcional
 * @param {Function} [onAction]- Handler del botón de acción
 */
export default function EmptyState({
    emoji = '🌾',
    title,
    message,
    action,
    onAction,
}) {
    return (
        <Box sx={{ textAlign: 'center', py: 10, px: 3 }}>
            <Typography variant="h4" sx={{ mb: 1, fontSize: '3rem' }}>{emoji}</Typography>
            <Typography variant="h5" sx={{ mb: 1 }}>{title}</Typography>
            {message && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {message}
                </Typography>
            )}
            {action && onAction && (
                <Button variant="outlined" onClick={onAction} sx={{ borderRadius: 3 }}>
                    {action}
                </Button>
            )}
        </Box>
    );
}
