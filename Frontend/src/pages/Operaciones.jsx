// Página para la gestión de operaciones del usuario.
// Orquesta los sub-componentes de features/operaciones/.

import { useState } from 'react';
import {
    Box, Typography, Stack, Chip, Paper, Alert, Avatar,
    Stepper, Step, StepLabel,
} from '@mui/material';
import { alpha } from '@mui/material/styles';

import Navbar from '../components/layout/Navbar.jsx';
import OperacionCard, { PASOS_PROCESO, ColorConnector } from '../components/features/operaciones/OperacionCard.jsx';
import OperacionDialog from '../components/features/operaciones/OperacionDialog.jsx';
import OperacionSkeleton from '../components/features/operaciones/OperacionSkeleton.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import StatCard from '../components/common/StatCard.jsx';

import { useOperaciones } from '../hooks/useOperaciones.js';
import { ESTADOS_OPERACION } from '../services/operacionesService.js';

const FILTROS = ['Todos', 'Granos', 'Hacienda', 'Maquinaria', 'Activas', 'Cerradas'];

export default function OperacionesPage() {
    const { operaciones, loading, error, toggleDoc } = useOperaciones();
    const [filtro, setFiltro]                        = useState('Todos');
    const [opSeleccionada, setOpSeleccionada]        = useState(null);
    const [dialogOpen, setDialogOpen]                = useState(false);

    const abrirDetalle = (op) => { setOpSeleccionada(op); setDialogOpen(true); };
    const cerrarDetalle = () => setDialogOpen(false);

    const handleToggleDoc = async (opId, docId) => {
        await toggleDoc(opId, docId);
        setOpSeleccionada((prev) => {
            if (!prev || prev.id !== opId) return prev;
            return {
                ...prev,
                documentos: prev.documentos.map((d) =>
                    d.id === docId ? { ...d, completado: !d.completado } : d
                ),
            };
        });
    };

    const operacionesFiltradas = operaciones.filter((op) => {
        if (filtro === 'Todos')    return true;
        if (filtro === 'Activas')  return ![ESTADOS_OPERACION.CERRADA, ESTADOS_OPERACION.CANCELADA].includes(op.estado);
        if (filtro === 'Cerradas') return op.estado === ESTADOS_OPERACION.CERRADA;
        return op.tipo === filtro;
    });

    const activas  = operaciones.filter((o) => ![ESTADOS_OPERACION.CERRADA, ESTADOS_OPERACION.CANCELADA].includes(o.estado)).length;
    const cerradas = operaciones.filter((o) => o.estado === ESTADOS_OPERACION.CERRADA).length;
    const enDoc    = operaciones.filter((o) => o.estado === ESTADOS_OPERACION.DOCUMENTACION).length;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Navbar title="Operaciones" />

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>

                {/* Header */}
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" mb={3} spacing={1}>
                    <Box>
                        <Typography variant="h5" fontWeight={700} color="text.primary">Mis Operaciones</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Gestioná tus negociaciones activas y su documentación requerida
                        </Typography>
                    </Box>
                </Stack>

                {/* Stat cards */}
                {!loading && (
                    <Stack direction="row" flexWrap="wrap" gap={1.5} mb={3}>
                        {[
                            { label: 'Activas',          value: activas,            color: '#1976d2' },
                            { label: 'En documentación', value: enDoc,              color: '#7b1fa2' },
                            { label: 'Cerradas',         value: cerradas,           color: '#546e7a' },
                            { label: 'Total',            value: operaciones.length, color: '#4e342e' },
                        ].map((s) => (
                            <StatCard key={s.label} variant="gradient" {...s} />
                        ))}
                    </Stack>
                )}

                {/* Info del proceso */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, md: 3 }, borderRadius: 4, mb: 3,
                        border: (theme) => `1px solid ${theme.palette.mode === 'dark' ? alpha(theme.palette.primary.main, 0.2) : 'rgba(0,0,0,0.08)'}`,
                        background: (t) => t.palette.mode === 'dark'
                            ? `linear-gradient(135deg, ${alpha(t.palette.primary.main, 0.1)} 0%, ${alpha(t.palette.background.paper, 0.4)} 100%)`
                            : 'linear-gradient(135deg, #f1fff1 0%, #fff 100%)',
                    }}
                >
                    <Typography variant="subtitle2" fontWeight={700} textTransform="uppercase" letterSpacing="0.06em" color="text.secondary" mb={2}>
                        Proceso de Negociación AgroVia
                    </Typography>
                    <Stepper alternativeLabel connector={<ColorConnector />}>
                        {PASOS_PROCESO.map((paso) => (
                            <Step key={paso.label} active>
                                <StepLabel
                                    StepIconComponent={() => (
                                        <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: '1rem' }}>
                                            {paso.icon}
                                        </Avatar>
                                    )}
                                >
                                    {paso.label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Paper>

                {/* Error */}
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                {/* Filtros rápidos */}
                <Stack direction="row" spacing={1} flexWrap="wrap" mb={2}>
                    {FILTROS.map((f) => (
                        <Chip
                            key={f}
                            id={`chip-filtro-${f.toLowerCase()}`}
                            label={f}
                            clickable
                            onClick={() => setFiltro(f)}
                            sx={{
                                fontWeight: filtro === f ? 700 : 500,
                                backgroundColor: filtro === f ? 'primary.main' : 'transparent',
                                color: filtro === f ? '#fff' : 'text.secondary',
                                border: filtro === f ? 'none' : '1px solid rgba(0,0,0,0.12)',
                                transition: 'all 0.2s',
                            }}
                        />
                    ))}
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto', alignSelf: 'center' }}>
                        {operacionesFiltradas.length} {operacionesFiltradas.length === 1 ? 'operación' : 'operaciones'}
                    </Typography>
                </Stack>

                {/* Grid de operaciones */}
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' },
                        gap: 2.5,
                    }}
                >
                    {loading
                        ? Array.from({ length: 4 }).map((_, i) => <OperacionSkeleton key={i} />)
                        : operacionesFiltradas.map((op) => (
                            <OperacionCard key={op.id} op={op} onClick={abrirDetalle} />
                        ))
                    }
                </Box>

                {!loading && operacionesFiltradas.length === 0 && (
                    <EmptyState
                        emoji="📋"
                        title="Sin operaciones con ese filtro"
                    />
                )}
            </Box>

            <OperacionDialog
                op={opSeleccionada}
                open={dialogOpen}
                onClose={cerrarDetalle}
                onToggleDoc={handleToggleDoc}
            />
        </Box>
    );
}