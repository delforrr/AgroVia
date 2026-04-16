// Widget de bienvenida con fecha actual — sección superior izquierda del dashboard.

import { Box, Paper, Stack, Typography } from '@mui/material';
import { Leaf } from '@boxicons/react';

export default function BienvenidaCard() {
    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 4,
                background: 'linear-gradient(145deg, #4a7c3f 0%, #6A8E5E 60%, #8ab87a 100%)',
                p: 2.5,
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Círculo decorativo */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.08)',
                }}
            />
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <Leaf fill="#8adc6f" width={28} height={28} />
                <Typography variant="subtitle1" fontWeight={700} sx={{ opacity: 0.9 }}>
                    AgroVía
                </Typography>
            </Stack>
            <Typography variant="h5" fontWeight={800} lineHeight={1.2} mb={0.5}>
                ¡Bienvenido! 👋
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.85 }}>
                Hoy es un buen día para el campo.
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.6, display: 'block', mt: 1 }}>
                {new Date().toLocaleDateString('es-AR', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                })}
            </Typography>
        </Paper>
    );
}
