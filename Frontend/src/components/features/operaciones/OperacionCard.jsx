// Tarjeta de resumen de una operación en el listado.

import {
    Card, CardActionArea, CardContent,
    Stack, Box, Typography, Chip, LinearProgress, Stepper,
    Step, StepLabel, StepConnector, stepConnectorClasses,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import ArticleIcon from '@mui/icons-material/Article';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingIcon from '@mui/icons-material/Pending';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import HandshakeIcon from '@mui/icons-material/Handshake';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import GrainIcon from '@mui/icons-material/Grain';
import PetsIcon from '@mui/icons-material/Pets';
import AgricultureIcon from '@mui/icons-material/Agriculture';

import EstadoChip from '../../common/EstadoChip.jsx';
import { fmtMonto, fmtFecha } from '../../../constants/formatters.js';
import { PASO_IDX } from '../../../services/operacionesService.js';

// ── Stepper personalizado ─────────────────────────────────────────────────────
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

export const PASOS_PROCESO = [
    { label: 'Iniciada',      icon: <PendingIcon /> },
    { label: 'En revisión',   icon: <HourglassEmptyIcon /> },
    { label: 'Documentación', icon: <ArticleIcon /> },
    { label: 'Firmada',       icon: <HandshakeIcon /> },
    { label: 'Cerrada',       icon: <CheckCircleIcon /> },
];

export const TIPO_ICON = {
    Granos:    <GrainIcon fontSize="small" />,
    Hacienda:  <PetsIcon fontSize="small" />,
    Maquinaria: <AgricultureIcon fontSize="small" />,
};

const progreso = (documentos) => {
    if (!documentos?.length) return 0;
    return Math.round((documentos.filter((d) => d.completado).length / documentos.length) * 100);
};

export { ColorConnector };

/**
 * @param {object}   op      - Datos de la operación
 * @param {Function} onClick - Handler al clickear la card
 */
export default function OperacionCard({ op, onClick }) {
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

                    {/* Monto y fecha */}
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

                    {/* Progreso de documentación */}
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
