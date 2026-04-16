// Dialog de detalle de una operación con información completa y gestión de documentación.

import {
    Dialog, DialogTitle, DialogContent, DialogActions, Button,
    Stack, Box, Typography, Avatar, Paper, Divider,
    Stepper, Step, StepLabel, LinearProgress,
    FormGroup, FormControlLabel, Checkbox, Chip, IconButton,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import EstadoChip from '../../common/EstadoChip.jsx';
import { fmtMonto, fmtFecha } from '../../../constants/formatters.js';
import { ESTADOS_OPERACION, PASO_IDX } from '../../../services/operacionesService.js';
import { PASOS_PROCESO, ColorConnector } from './OperacionCard.jsx';

const progreso = (documentos) => {
    if (!documentos?.length) return 0;
    return Math.round((documentos.filter((d) => d.completado).length / documentos.length) * 100);
};

/**
 * @param {object}   op          - Operación seleccionada (o null si no hay)
 * @param {boolean}  open        - Si el dialog está abierto
 * @param {Function} onClose     - Cerrar el dialog
 * @param {Function} onToggleDoc - Cambiar estado de un documento (opId, docId)
 */
export default function OperacionDialog({ op, open, onClose, onToggleDoc }) {
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
                <Typography variant="caption" color="text.secondary">
                    {op.id} · Inicio: {fmtFecha(op.fechaInicio)}
                </Typography>
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
                        { rol: 'Comprador', parte: op.comprador, color: 'info',    lightBg: '#e3f2fd' },
                        { rol: 'Vendedor',  parte: op.vendedor,  color: 'success', lightBg: '#e8f5e9' },
                    ].map(({ rol, parte, color, lightBg }) => (
                        <Paper
                            key={rol}
                            elevation={0}
                            sx={{
                                flex: 1, p: 2, borderRadius: 3,
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
                                    <Typography variant="caption" color={`${color}.main`} fontWeight={700} textTransform="uppercase">{rol}</Typography>
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

                {/* Detalles */}
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

                {/* Documentación requerida */}
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
