// Página para la gestión de operaciones del usuario

import { useState } from 'react';
import {
    Box, Typography, Stack, Chip, Card, CardContent, CardActionArea,
    Stepper, Step, StepLabel, StepConnector, stepConnectorClasses,
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Checkbox, FormControlLabel, FormGroup, Divider, Avatar,
    Tooltip, Skeleton, Alert, LinearProgress, IconButton,
    Paper, Badge,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ArticleIcon from '@mui/icons-material/Article';
import HandshakeIcon from '@mui/icons-material/Handshake';
import GrainIcon from '@mui/icons-material/Grain';
import PetsIcon from '@mui/icons-material/Pets';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

import Navbar from '../components/layout/Navbar.jsx';
import { useOperaciones } from '../hooks/useOperaciones.js';
import { ESTADOS_OPERACION, PASO_IDX } from '../services/operacionesService.js';

// ── Stepper personalizado ─────────────────────────────────────────────
const ColorConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: { top: 16 },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: { borderColor: theme.palette.primary.main },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: '#e0e0e0',
        borderTopWidth: 3,
        borderRadius: 1,
    },
}));

const PASOS_PROCESO = [
    { label: 'Iniciada',       icon: <PendingIcon /> },
    { label: 'En revisión',    icon: <HourglassEmptyIcon /> },
    { label: 'Documentación',  icon: <ArticleIcon /> },
    { label: 'Firmada',        icon: <HandshakeIcon /> },
    { label: 'Cerrada',        icon: <CheckCircleIcon /> },
];

// ── Configuración de estados ──────────────────────────────────────────
const ESTADO_CONFIG = {
    [ESTADOS_OPERACION.INICIADA]:      { color: '#1976d2', bg: '#e3f2fd', label: 'Iniciada' },
    [ESTADOS_OPERACION.EN_REVISION]:   { color: '#f57c00', bg: '#fff3e0', label: 'En revisión' },
    [ESTADOS_OPERACION.DOCUMENTACION]: { color: '#7b1fa2', bg: '#f3e5f5', label: 'Documentación' },
    [ESTADOS_OPERACION.FIRMADA]:       { color: '#2e7d32', bg: '#e8f5e9', label: 'Firmada' },
    [ESTADOS_OPERACION.CERRADA]:       { color: '#546e7a', bg: '#eceff1', label: 'Cerrada' },
    [ESTADOS_OPERACION.CANCELADA]:     { color: '#c62828', bg: '#fce4ec', label: 'Cancelada' },
};

const TIPO_ICON = {
    Granos: <GrainIcon fontSize="small" />,
    Hacienda: <PetsIcon fontSize="small" />,
    Maquinaria: <AgricultureIcon fontSize="small" />,
};

// ── Helpers ───────────────────────────────────────────────────────────
const fmtMonto = (monto, moneda) =>
    moneda === 'USD'
        ? `USD ${monto?.toLocaleString('es-AR')}`
        : `$${monto?.toLocaleString('es-AR')}`;

const fmtFecha = (str) =>
    str
        ? new Date(str + 'T00:00:00').toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
        : '—';

const progreso = (documentos) => {
    if (!documentos?.length) return 0;
    return Math.round((documentos.filter((d) => d.completado).length / documentos.length) * 100);
};

// ── Chip de estado ────────────────────────────────────────────────────
function EstadoChip({ estado }) {
    const cfg = ESTADO_CONFIG[estado] ?? { color: '#333', bg: '#eee', label: estado };
    return (
        <Chip
            size="small"
            label={cfg.label}
            sx={{ fontWeight: 700, fontSize: '0.72rem', color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.color}40` }}
        />
    );
}

// ── Card de operación ─────────────────────────────────────────────────
function OperacionCard({ op, onClick }) {
    const pct = progreso(op.documentos);
    const pasoActivo = PASO_IDX[op.estado] ?? 0;

    return (
        <Card
            elevation={0}
            sx={{
                border: '1px solid rgba(0,0,0,0.09)',
                borderRadius: 3,
                transition: 'box-shadow 0.2s, transform 0.2s',
                '&:hover': { boxShadow: 4, transform: 'translateY(-2px)' },
            }}
        >
            <CardActionArea onClick={() => onClick(op)} sx={{ p: 0 }}>
                <CardContent>
                    {/* Header */}
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" mb={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Chip
                                icon={TIPO_ICON[op.tipo]}
                                label={op.tipo}
                                size="small"
                                variant="outlined"
                                sx={{ fontWeight: 600, '& .MuiChip-icon': { fontSize: 14 } }}
                            />
                            <EstadoChip estado={op.estado} />
                        </Stack>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            {op.id}
                        </Typography>
                    </Stack>

                    {/* Título */}
                    <Typography variant="subtitle1" fontWeight={700} color="text.primary" gutterBottom>
                        {op.titulo}
                    </Typography>

                    {/* Partes */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} mb={1.5}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <PersonIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                <strong>Comprador:</strong> {op.comprador.nombre}
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <BusinessIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                <strong>Vendedor:</strong> {op.vendedor.nombre}
                            </Typography>
                        </Stack>
                    </Stack>

                    {/* Monto y fechas */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight={700} color="primary.main">
                            {fmtMonto(op.monto, op.moneda)}
                        </Typography>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <LocalShippingIcon sx={{ fontSize: 13, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">
                                Entrega: {fmtFecha(op.entrega)}
                            </Typography>
                        </Stack>
                    </Stack>

                    {/* Mini stepper */}
                    <Stepper
                        activeStep={pasoActivo}
                        alternativeLabel
                        connector={<ColorConnector />}
                        sx={{ mb: 1.5 }}
                    >
                        {PASOS_PROCESO.map((paso) => (
                            <Step key={paso.label} completed={PASO_IDX[op.estado] > PASOS_PROCESO.indexOf(paso)}>
                                <StepLabel
                                    sx={{
                                        '& .MuiStepLabel-label': { fontSize: '0.65rem', mt: 0.5 },
                                        '& .MuiStepIcon-root': { fontSize: '1.1rem' },
                                    }}
                                >
                                    {paso.label}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>

                    {/* Progreso documentación */}
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <ArticleIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                        <Typography variant="caption" color="text.secondary" sx={{ minWidth: 130 }}>
                            Documentación: {op.documentos.filter((d) => d.completado).length}/{op.documentos.length}
                        </Typography>
                        <Box sx={{ flexGrow: 1 }}>
                            <LinearProgress
                                variant="determinate"
                                value={pct}
                                sx={{
                                    height: 5,
                                    borderRadius: 5,
                                    backgroundColor: 'rgba(0,0,0,0.08)',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: pct === 100 ? '#2e7d32' : 'primary.main',
                                    },
                                }}
                            />
                        </Box>
                        <Typography variant="caption" color="text.secondary">{pct}%</Typography>
                    </Stack>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

// ── Dialog de detalle ─────────────────────────────────────────────────
function OperacionDialog({ op, open, onClose, onToggleDoc }) {
    if (!op) return null;
    const pasoActivo = PASO_IDX[op.estado] ?? 0;
    const docsRequeridos = op.documentos.filter((d) => d.requerido);
    const docsOpcionales = op.documentos.filter((d) => !d.requerido);
    const pct = progreso(op.documentos);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth scroll="paper">
            <DialogTitle sx={{ pr: 6 }}>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                    <Typography variant="h6" fontWeight={700}>{op.titulo}</Typography>
                    <EstadoChip estado={op.estado} />
                </Stack>
                <Typography variant="caption" color="text.secondary">{op.id} · Inicio: {fmtFecha(op.fechaInicio)}</Typography>
                <IconButton
                    id={`btn-cerrar-detalle-${op.id}`}
                    onClick={onClose}
                    size="small"
                    sx={{ position: 'absolute', top: 12, right: 12 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {/* Proceso de negociación */}
                <Typography variant="subtitle2" fontWeight={700} textTransform="uppercase" letterSpacing="0.06em" color="text.secondary" mb={2}>
                    Proceso de Negociación
                </Typography>
                <Stepper activeStep={pasoActivo} alternativeLabel connector={<ColorConnector />} sx={{ mb: 3 }}>
                    {PASOS_PROCESO.map((paso, idx) => (
                        <Step key={paso.label} completed={pasoActivo > idx}>
                            <StepLabel>{paso.label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                <Divider sx={{ mb: 3 }} />

                {/* Partes involucradas */}
                <Typography variant="subtitle2" fontWeight={700} textTransform="uppercase" letterSpacing="0.06em" color="text.secondary" mb={2}>
                    Partes Involucradas
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={3}>
                    {[
                        { rol: 'Comprador', parte: op.comprador, color: 'info', lightBg: '#e3f2fd' },
                        { rol: 'Vendedor',  parte: op.vendedor,  color: 'success', lightBg: '#e8f5e9' },
                    ].map(({ rol, parte, color, lightBg }) => (
                        <Paper
                            key={rol}
                            elevation={0}
                            sx={{
                                flex: 1,
                                p: 2,
                                borderRadius: 3,
                                border: (t) => `1px solid ${alpha(t.palette[color].main, 0.3)}`,
                                background: (t) => t.palette.mode === 'dark'
                                    ? `linear-gradient(135deg, ${alpha(t.palette[color].main, 0.15)} 0%, ${alpha(t.palette.background.paper, 0.5)} 100%)`
                                    : `linear-gradient(135deg, ${lightBg} 0%, #fff 100%)`,
                            }}
                        >
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ bgcolor: `${color}.main`, width: 38, height: 38, fontSize: '1.1rem' }}>
                                    {parte.avatar}
                                </Avatar>
                                <Box>
                                    <Typography variant="caption" color={`${color}.main`} fontWeight={700} textTransform="uppercase">
                                        {rol}
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600} color="text.primary">{parte.nombre}</Typography>
                                    <Typography variant="caption" color="text.secondary">CUIT: {parte.cuit}</Typography>
                                    <br />
                                    <Typography variant="caption" color="text.secondary">📍 {parte.localidad}</Typography>
                                </Box>
                            </Stack>
                        </Paper>
                    ))}
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {/* Detalles de la operación */}
                <Typography variant="subtitle2" fontWeight={700} textTransform="uppercase" letterSpacing="0.06em" color="text.secondary" mb={1.5}>
                    Detalles
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mb={2}>
                    <Paper elevation={0} sx={{ flex: 1, p: 1.5, borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)' }}>
                        <Typography variant="caption" color="text.secondary">Monto acordado</Typography>
                        <Typography variant="h6" fontWeight={700} color="primary.main">{fmtMonto(op.monto, op.moneda)}</Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ flex: 1, p: 1.5, borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)' }}>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            <CalendarMonthIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary">Fecha de entrega</Typography>
                        </Stack>
                        <Typography variant="body1" fontWeight={600}>{fmtFecha(op.entrega)}</Typography>
                    </Paper>
                    <Paper elevation={0} sx={{ flex: 1, p: 1.5, borderRadius: 2, border: '1px solid rgba(0,0,0,0.08)' }}>
                        <Typography variant="caption" color="text.secondary">Progreso documentación</Typography>
                        <Typography variant="body1" fontWeight={600}>{pct}% completado</Typography>
                        <LinearProgress
                            variant="determinate"
                            value={pct}
                            sx={{ mt: 0.5, height: 5, borderRadius: 5, '& .MuiLinearProgress-bar': { backgroundColor: pct === 100 ? '#2e7d32' : undefined } }}
                        />
                    </Paper>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontStyle: 'italic' }}>
                    {op.descripcion}
                </Typography>

                <Divider sx={{ mb: 3 }} />

                {/* Documentación */}
                <Typography variant="subtitle2" fontWeight={700} textTransform="uppercase" letterSpacing="0.06em" color="text.secondary" mb={2}>
                    Documentación Requerida
                </Typography>

                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" fontWeight={600} color="text.primary" mb={1}>
                        Documentos obligatorios
                    </Typography>
                    <FormGroup>
                        {docsRequeridos.map((doc) => (
                            <FormControlLabel
                                key={doc.id}
                                control={
                                    <Checkbox
                                        id={`check-${op.id}-${doc.id}`}
                                        checked={doc.completado}
                                        onChange={() => onToggleDoc(op.id, doc.id)}
                                        color="primary"
                                        sx={{ '&.Mui-checked': { color: 'primary.main' } }}
                                    />
                                }
                                label={
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                textDecoration: doc.completado ? 'line-through' : 'none',
                                                color: doc.completado ? 'text.secondary' : 'text.primary',
                                            }}
                                        >
                                            {doc.label}
                                        </Typography>
                                        {doc.completado && (
                                            <Chip label="Presentado" size="small" sx={{ height: 18, fontSize: '0.65rem', color: '#2e7d32', bgcolor: '#e8f5e9' }} />
                                        )}
                                    </Stack>
                                }
                            />
                        ))}
                    </FormGroup>
                </Box>

                {docsOpcionales.length > 0 && (
                    <Box>
                        <Typography variant="body2" fontWeight={600} color="text.secondary" mb={1}>
                            Documentos opcionales
                        </Typography>
                        <FormGroup>
                            {docsOpcionales.map((doc) => (
                                <FormControlLabel
                                    key={doc.id}
                                    control={
                                        <Checkbox
                                            id={`check-opt-${op.id}-${doc.id}`}
                                            checked={doc.completado}
                                            onChange={() => onToggleDoc(op.id, doc.id)}
                                            color="default"
                                            size="small"
                                        />
                                    }
                                    label={
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ textDecoration: doc.completado ? 'line-through' : 'none' }}
                                        >
                                            {doc.label}
                                        </Typography>
                                    }
                                />
                            ))}
                        </FormGroup>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, py: 2 }}>
                <Button id="btn-cerrar-operacion" onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
                    Cerrar
                </Button>
                <Button
                    id="btn-accion-operacion"
                    variant="contained"
                    disableElevation
                    sx={{ borderRadius: 2 }}
                    disabled={op.estado === ESTADOS_OPERACION.CERRADA || op.estado === ESTADOS_OPERACION.CANCELADA}
                >
                    {op.estado === ESTADOS_OPERACION.CERRADA ? 'Operación cerrada' : 'Avanzar etapa'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ── Skeleton de card ──────────────────────────────────────────────────
function OperacionSkeleton() {
    return (
        <Card elevation={0} sx={{ border: '1px solid rgba(0,0,0,0.09)', borderRadius: 3, p: 2 }}>
            <Skeleton variant="rounded" width={180} height={22} sx={{ mb: 1.5 }} />
            <Skeleton variant="text" width="70%" height={24} sx={{ mb: 1 }} />
            <Skeleton variant="text" width="50%" height={18} />
            <Skeleton variant="rounded" height={8} sx={{ mt: 2, borderRadius: 4 }} />
        </Card>
    );
}

// ── Filtro rápido ─────────────────────────────────────────────────────
const FILTROS = ['Todos', 'Granos', 'Hacienda', 'Maquinaria', 'Activas', 'Cerradas'];

// ── Página ────────────────────────────────────────────────────────────
export default function OperacionesPage() {
    const { operaciones, loading, error, toggleDoc } = useOperaciones();
    const [filtro, setFiltro] = useState('Todos');
    const [opSeleccionada, setOpSeleccionada] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const abrirDetalle = (op) => {
        setOpSeleccionada(op);
        setDialogOpen(true);
    };

    const cerrarDetalle = () => {
        setDialogOpen(false);
    };

    const handleToggleDoc = async (opId, docId) => {
        await toggleDoc(opId, docId);
        // actualizar la op seleccionada con el nuevo estado
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
        if (filtro === 'Todos') return true;
        if (filtro === 'Activas') return ![ESTADOS_OPERACION.CERRADA, ESTADOS_OPERACION.CANCELADA].includes(op.estado);
        if (filtro === 'Cerradas') return op.estado === ESTADOS_OPERACION.CERRADA;
        return op.tipo === filtro;
    });

    // Stats resumen
    const activas = operaciones.filter((o) => ![ESTADOS_OPERACION.CERRADA, ESTADOS_OPERACION.CANCELADA].includes(o.estado)).length;
    const cerradas = operaciones.filter((o) => o.estado === ESTADOS_OPERACION.CERRADA).length;
    const enDoc = operaciones.filter((o) => o.estado === ESTADOS_OPERACION.DOCUMENTACION).length;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Navbar title="Operaciones" />

            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>

                {/* ── Header ── */}
                <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" mb={3} spacing={1}>
                    <Box>
                        <Typography variant="h5" fontWeight={700} color="text.primary">
                            Mis Operaciones
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Gestioná tus negociaciones activas y su documentación requerida
                        </Typography>
                    </Box>
                </Stack>

                {/* ── Stat cards ── */}
                {!loading && (
                    <Stack direction="row" flexWrap="wrap" gap={1.5} mb={3}>
                        {[
                            { label: 'Activas',          value: activas,         color: '#1976d2' },
                            { label: 'En documentación', value: enDoc,           color: '#7b1fa2' },
                            { label: 'Cerradas',         value: cerradas,        color: '#546e7a' },
                            { label: 'Total',            value: operaciones.length, color: '#4e342e' },
                        ].map((s) => (
                            <Paper
                                key={s.label}
                                elevation={0}
                                sx={{
                                    flex: '1 1 100px',
                                    p: 2,
                                    borderRadius: 3,
                                    border: `1px solid ${s.color}25`,
                                    background: `linear-gradient(135deg, ${s.color}15 0%, ${s.color}05 100%)`,
                                    textAlign: 'center',
                                }}
                            >
                                <Typography variant="h4" fontWeight={800} color={s.color} lineHeight={1}>
                                    {s.value}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                    {s.label}
                                </Typography>
                            </Paper>
                        ))}
                    </Stack>
                )}

                {/* ── Proceso de negociación (info) ── */}
                <Paper
                    elevation={0}
                    sx={{
                        p: { xs: 2, md: 3 },
                        borderRadius: 4,
                        mb: 3,
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

                {/* ── Error ── */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
                )}

                {/* ── Filtros rápidos ── */}
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

                {/* ── Grid de operaciones ── */}
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
                    <Box sx={{ textAlign: 'center', py: 10 }}>
                        <Typography variant="h4" sx={{ mb: 1, fontSize: '3rem' }}>📋</Typography>
                        <Typography variant="h6" color="text.secondary">Sin operaciones con ese filtro</Typography>
                    </Box>
                )}
            </Box>

            {/* ── Dialog de detalle ── */}
            <OperacionDialog
                op={opSeleccionada}
                open={dialogOpen}
                onClose={cerrarDetalle}
                onToggleDoc={handleToggleDoc}
            />
        </Box>
    );
}