// Widget de operaciones activas en el dashboard de inicio.

import {
    Box, Paper, Stack, Typography, Chip, Divider,
    LinearProgress, Skeleton, Button,
} from '@mui/material';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ArticleIcon from '@mui/icons-material/Article';
import GrainIcon from '@mui/icons-material/Grain';
import PetsIcon from '@mui/icons-material/Pets';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import EstadoChip from '../../common/EstadoChip.jsx';
import { fmtMonto } from '../../../constants/formatters.js';
import { ESTADOS_OPERACION } from '../../../services/operacionesService.js';

const progreso = (docs) => {
    if (!docs?.length) return 0;
    return Math.round((docs.filter((d) => d.completado).length / docs.length) * 100);
};

/**
 * @param {Array}   operaciones - Lista de operaciones
 * @param {boolean} loading     - Estado de carga
 */
export default function OperacionesActivas({ operaciones, loading }) {
    const navigate = useNavigate();

    const opActivas = operaciones
        .filter((o) => ![ESTADOS_OPERACION.CERRADA, ESTADOS_OPERACION.CANCELADA].includes(o.estado))
        .slice(0, 3);

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
                    <HandshakeIcon sx={{ color: '#7b1fa2', fontSize: 20 }} />
                    <Typography variant="subtitle1" fontWeight={700}>Operaciones activas</Typography>
                    {!loading && (
                        <Chip
                            size="small"
                            label={opActivas.length}
                            sx={{ height: 18, fontSize: '0.68rem', bgcolor: '#f3e5f5', color: '#7b1fa2' }}
                        />
                    )}
                </Stack>
                <Button
                    size="small"
                    endIcon={<ArrowForwardIcon />}
                    onClick={() => navigate('/operaciones')}
                    sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
                >
                    Ver todas
                </Button>
            </Stack>
            <Divider />

            {/* Contenido */}
            {loading ? (
                <Stack spacing={1.5} sx={{ p: 2 }}>
                    {[1, 2].map((i) => (
                        <Box key={i} sx={{ p: 1.5, border: '1px solid rgba(0,0,0,0.07)', borderRadius: 2 }}>
                            <Skeleton variant="text" width="50%" />
                            <Skeleton variant="text" width="30%" height={12} />
                            <Skeleton variant="rounded" height={5} sx={{ mt: 1 }} />
                        </Box>
                    ))}
                </Stack>
            ) : opActivas.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" color="text.secondary">
                        No tenés operaciones activas
                    </Typography>
                </Box>
            ) : (
                <Stack spacing={0} divider={<Divider />}>
                    {opActivas.map((op) => {
                        const pct = progreso(op.documentos);
                        return (
                            <Box
                                key={op.id}
                                sx={{
                                    px: 2.5,
                                    py: 1.75,
                                    cursor: 'pointer',
                                    '&:hover': { bgcolor: 'action.hover' },
                                    transition: 'background 0.15s',
                                }}
                                onClick={() => navigate('/operaciones')}
                            >
                                {/* Fila superior: tipo + estado + monto */}
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                        <Stack direction="row" spacing={1} alignItems="center" mb={0.5} flexWrap="wrap">
                                            <Chip
                                                size="small"
                                                icon={
                                                    op.tipo === 'Granos' ? <GrainIcon /> :
                                                    op.tipo === 'Hacienda' ? <PetsIcon /> :
                                                    <AgricultureIcon />
                                                }
                                                label={op.tipo}
                                                variant="outlined"
                                                sx={{ fontSize: '0.68rem', height: 20, '& .MuiChip-icon': { fontSize: 12 } }}
                                            />
                                            <EstadoChip estado={op.estado} />
                                        </Stack>
                                        <Typography variant="body2" fontWeight={600} noWrap>
                                            {op.titulo}
                                        </Typography>
                                    </Box>
                                    <Typography
                                        variant="body2"
                                        fontWeight={700}
                                        color="primary.main"
                                        sx={{ ml: 1, whiteSpace: 'nowrap' }}
                                    >
                                        {fmtMonto(op.monto, op.moneda)}
                                    </Typography>
                                </Stack>

                                {/* Barra de progreso de documentación */}
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <ArticleIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 110 }}>
                                        Doc: {op.documentos.filter((d) => d.completado).length}/{op.documentos.length}
                                    </Typography>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <LinearProgress
                                            variant="determinate"
                                            value={pct}
                                            sx={{
                                                height: 4,
                                                borderRadius: 4,
                                                bgcolor: 'rgba(0,0,0,0.07)',
                                                '& .MuiLinearProgress-bar': {
                                                    bgcolor: pct === 100 ? '#2e7d32' : 'primary.main',
                                                },
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">{pct}%</Typography>
                                </Stack>
                            </Box>
                        );
                    })}
                </Stack>
            )}
        </Paper>
    );
}
