// Widget de cotizaciones del día — granos y divisas en el dashboard.

import {
    Box, Paper, Stack, Typography, Grid, Chip,
    Skeleton, Divider, Button, IconButton, Tooltip,
} from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import GrainIcon from '@mui/icons-material/Grain';
import RefreshIcon from '@mui/icons-material/Refresh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import VarChip from '../../common/VarChip.jsx';
import { fmt } from '../../../constants/formatters.js';

/**
 * @param {object} cotiz        - Datos de cotizaciones (granos, divisas)
 * @param {boolean} loading     - Estado de carga
 * @param {Function} onRefresh  - Handler para actualizar datos
 */
export default function CotizacionesWidget({ cotiz, loading, onRefresh }) {
    const navigate = useNavigate();
    const granosDestacados = cotiz?.granos?.slice(0, 4) ?? [];

    return (
        <Paper
            elevation={0}
            sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.08)', overflow: 'hidden' }}
        >
            {/* Header */}
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ px: 2.5, pt: 2, pb: 1.5 }}
            >
                <Stack direction="row" spacing={1} alignItems="center">
                    <ShowChartIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography variant="subtitle1" fontWeight={700}>Cotizaciones del día</Typography>
                    <Chip
                        size="small"
                        label="Granos · Rosario"
                        variant="outlined"
                        sx={{ fontSize: '0.68rem' }}
                    />
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Tooltip title="Actualizar">
                        <IconButton
                            size="small"
                            onClick={onRefresh}
                            disabled={loading}
                            sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 1.5 }}
                        >
                            <RefreshIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>
                    <Button
                        size="small"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate('/mercado')}
                        sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.8rem' }}
                    >
                        Ver mercado
                    </Button>
                </Stack>
            </Stack>

            <Divider />

            {/* Grillas de granos */}
            <Grid container sx={{ px: 0.5, py: 1 }}>
                {loading
                    ? Array.from({ length: 4 }).map((_, i) => (
                        <Grid key={i} size={{ xs: 6, sm: 3 }} sx={{ p: 1.5 }}>
                            <Skeleton variant="text" width="60%" height={14} />
                            <Skeleton variant="text" width="80%" height={28} sx={{ mt: 0.5 }} />
                            <Skeleton variant="rounded" width={60} height={20} sx={{ mt: 0.5 }} />
                        </Grid>
                    ))
                    : granosDestacados.map((g, i) => (
                        <Grid
                            key={g.id}
                            size={{ xs: 6, sm: 3 }}
                            sx={{
                                p: 1.5,
                                borderRight: i < 3 ? '1px solid rgba(0,0,0,0.06)' : 'none',
                                '&:nth-of-type(2)': {
                                    borderRight: { xs: 'none', sm: '1px solid rgba(0,0,0,0.06)' },
                                },
                            }}
                        >
                            <Stack direction="row" spacing={0.5} alignItems="center" mb={0.5}>
                                <GrainIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                    {g.nombre}
                                </Typography>
                            </Stack>
                            <Typography variant="h6" fontWeight={800} color="primary.main" lineHeight={1}>
                                ${fmt(g.precio)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
                                {g.unidad}
                            </Typography>
                            <VarChip pct={g.var_pct} />
                        </Grid>
                    ))
                }
            </Grid>

            {/* Divisas rápidas */}
            {!loading && cotiz?.divisas && (
                <>
                    <Divider />
                    <Stack direction="row" flexWrap="wrap" gap={0} sx={{ px: 2, py: 1.5 }}>
                        {cotiz.divisas.slice(0, 4).map((d) => (
                            <Stack
                                key={d.id}
                                direction="row"
                                spacing={0.75}
                                alignItems="center"
                                sx={{ mr: 2.5, my: 0.25 }}
                            >
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                    {d.nombre}:
                                </Typography>
                                <Typography variant="caption" fontWeight={700} color="text.primary">
                                    ${fmt(d.precio)}
                                </Typography>
                                <VarChip pct={d.var_pct} />
                            </Stack>
                        ))}
                    </Stack>
                </>
            )}
        </Paper>
    );
}
