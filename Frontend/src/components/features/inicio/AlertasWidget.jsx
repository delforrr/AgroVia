// Widget de alertas/notificaciones — datos mock hasta integración del backend.

import { Box, Paper, Stack, Typography, Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

const NOTIFS_MOCK = [
    { id: 1, texto: 'Tu operación OP-2024-001 requiere documentación.', tipo: 'warning', hace: '2h' },
    { id: 2, texto: 'La cotización de Soja subió un 2.1% hoy.',         tipo: 'info',    hace: '4h' },
    { id: 3, texto: 'Nuevo aviso de Hacienda en Córdoba disponible.',    tipo: 'info',    hace: '6h' },
];

export default function AlertasWidget() {
    return (
        <Paper
            elevation={0}
            sx={{ borderRadius: 4, p: 2, border: '1px solid rgba(0,0,0,0.08)' }}
        >
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
                <Stack direction="row" spacing={0.75} alignItems="center">
                    <NotificationsNoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                    <Typography
                        variant="subtitle2"
                        fontWeight={700}
                        color="text.secondary"
                        textTransform="uppercase"
                        letterSpacing="0.05em"
                    >
                        Alertas
                    </Typography>
                </Stack>
                <Chip
                    size="small"
                    label={NOTIFS_MOCK.length}
                    color="primary"
                    sx={{ height: 18, fontSize: '0.68rem' }}
                />
            </Stack>

            <Stack spacing={1.5}>
                {NOTIFS_MOCK.map((n) => (
                    <Box
                        key={n.id}
                        sx={{
                            p: 1.25,
                            borderRadius: 2,
                            bgcolor: (t) =>
                                n.tipo === 'warning'
                                    ? t.palette.mode === 'dark'
                                        ? alpha(t.palette.warning.main, 0.15)
                                        : '#fff8e1'
                                    : t.palette.mode === 'dark'
                                        ? alpha(t.palette.info.main, 0.15)
                                        : '#f3f8ff',
                            borderLeft: 3,
                            borderLeftStyle: 'solid',
                            borderLeftColor: n.tipo === 'warning' ? 'warning.main' : 'info.main',
                        }}
                    >
                        <Typography variant="caption" color="text.primary" display="block" lineHeight={1.4}>
                            {n.texto}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            hace {n.hace}
                        </Typography>
                    </Box>
                ))}
            </Stack>
        </Paper>
    );
}
