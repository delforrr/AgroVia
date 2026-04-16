// Widget de avisos recientes en el dashboard de inicio.

import {
    Box, Paper, Stack, Typography, Chip, Avatar, Divider,
    Skeleton, Button,
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { fmt } from '../../../constants/formatters.js';
import { CATEGORIA_COLOR } from '../../../constants/colores.js';

/**
 * @param {Array}   avisos  - Lista de avisos recientes (máx. 4)
 * @param {boolean} loading - Estado de carga
 */
export default function AvisosRecientes({ avisos, loading }) {
    const navigate = useNavigate();

    return (
        <Paper
            elevation={0}
            sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)' }}
        >
            {/* Header */}
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ px: 2.5, pt: 2, pb: 1.5 }}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <StoreIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="subtitle1" fontWeight={700}>Avisos recientes</Typography>
                </Stack>
                <Button
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/avisos')}
                    sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
                >
                    Ver todos
                </Button>
            </Stack>
            <Divider />

            {/* Contenido */}
            {loading ? (
                <Stack spacing={1.5} sx={{ p: 2 }}>
                    {[1, 2, 3].map((i) => (
                        <Box key={i} sx={{ display: 'flex', gap: 1.5 }}>
                            <Skeleton variant="rounded" width={52} height={52} />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton variant="text" width="60%" />
                                <Skeleton variant="text" width="40%" height={12} />
                            </Box>
                        </Box>
                    ))}
                </Stack>
            ) : avisos.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">Sin avisos disponibles</Typography>
                </Box>
            ) : (
                <Stack divider={<Divider />}>
                    {avisos.map((av) => {
                        const catConf = CATEGORIA_COLOR[av.categoria] ?? CATEGORIA_COLOR.Servicios;
                        return (
                            <Stack
                                key={av.id}
                                direction="row"
                                spacing={2}
                                alignItems="center"
                                sx={{
                                    px: 2.5,
                                    py: 1.5,
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: 'action.hover' },
                                    transition: 'background 0.15s',
                                }}
                                onClick={() => navigate('/avisos')}
                            >
                                <Avatar
                                    sx={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 2,
                                        bgcolor: catConf.bg,
                                        fontSize: '1.3rem',
                                    }}
                                >
                                    {catConf.emoji}
                                </Avatar>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography variant="body2" fontWeight={600} noWrap>
                                        {av.titulo}
                                    </Typography>
                                    <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap">
                                        <Chip
                                            size="small"
                                            label={av.categoria}
                                            sx={{ height: 16, fontSize: '0.65rem', fontWeight: 600 }}
                                        />
                                        <Typography variant="caption" color="text.secondary">
                                            📍 {av.localidad}, {av.provincia}
                                        </Typography>
                                    </Stack>
                                </Box>
                                {av.precio && (
                                    <Typography
                                        variant="body2"
                                        fontWeight={700}
                                        color="primary.main"
                                        sx={{ whiteSpace: 'nowrap' }}
                                    >
                                        ${fmt(av.precio)}
                                    </Typography>
                                )}
                            </Stack>
                        );
                    })}
                </Stack>
            )}
        </Paper>
    );
}
