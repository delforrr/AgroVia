// Vista del perfil autenticado con tabs de información, operaciones y cuentas.
// Extraído de Perfil.jsx para separar responsabilidades.

import { useState } from 'react';
import {
    Box, Typography, Stack, Button, Paper, Chip,
    Tab, Tabs, TextField, Divider, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions,
    CircularProgress, Alert, Fade, InputAdornment, Badge, Avatar,
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import StarBorderIcon from '@mui/icons-material/StarBorder';

import Navbar from '../../layout/Navbar.jsx';
import { ESTADO_OP_TAB_COLOR, TIPO_OP_COLOR } from '../../../constants/colores.js';

// ── Mock data de operaciones y cuentas ────────────────────────────────────────
// TODO: reemplazar con datos reales del backend cuando el módulo de operaciones esté integrado
const MOCK_OPERACIONES = [
    { id: 'OP-001', tipo: 'Venta',  descripcion: '50 terneros Hereford – Río Cuarto',     fecha: '28 Mar 2026', monto: 550000, moneda: 'ARS', estado: 'Completada',  contraparte: 'Estancia Los Álamos' },
    { id: 'OP-002', tipo: 'Compra', descripcion: 'Tractor John Deere 6125J',              fecha: '15 Mar 2026', monto: 85000,  moneda: 'USD', estado: 'En proceso',  contraparte: 'Agro Maquinarias Rafaela' },
    { id: 'OP-003', tipo: 'Venta',  descripcion: '100 tn Maíz – Venado Tuerto',           fecha: '02 Mar 2026', monto: 320000, moneda: 'ARS', estado: 'Completada',  contraparte: 'Acopio San Martín' },
];

const MOCK_CUENTAS = [
    { id: 1, banco: 'Banco Nación Argentina', tipo: 'Cuenta Corriente', alias: 'CAMPO.VERDE.ARS', cbu: '0110034030034012345678', moneda: 'ARS', principal: true },
    { id: 2, banco: 'Banco Galicia',          tipo: 'Caja de Ahorro',   alias: 'GALICIA.CAMPO.USD', cbu: '0070036720000012345678', moneda: 'USD', principal: false },
];

// ── Tab: Información personal ─────────────────────────────────────────────────
function TabInfo({ usuario, onSave }) {
    const [editando, setEditando]   = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [datos, setDatos]         = useState({ ...usuario });
    const [success, setSuccess]     = useState(false);

    const handleChange = (campo) => (e) => setDatos((prev) => ({ ...prev, [campo]: e.target.value }));

    const handleGuardar = async () => {
        setGuardando(true);
        await onSave(datos);
        setGuardando(false);
        setEditando(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
    };

    const handleCancelar = () => { setDatos({ ...usuario }); setEditando(false); };

    return (
        <Box>
            {success && (
                <Alert severity="success" sx={{ mb: 2, borderRadius: 3 }}>
                    Perfil actualizado correctamente.
                </Alert>
            )}

            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.07)', mb: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'center', sm: 'flex-start' }}>
                    <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                            <Tooltip title="Cambiar foto">
                                <IconButton
                                    id="btn-cambiar-foto"
                                    size="small"
                                    sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' }, width: 30, height: 30 }}
                                >
                                    <CameraAltOutlinedIcon sx={{ fontSize: 16 }} />
                                </IconButton>
                            </Tooltip>
                        }
                    >
                        <Avatar
                            src={usuario.avatar}
                            sx={{ width: 96, height: 96, fontSize: '2.2rem', bgcolor: 'primary.main', border: '3px solid white', boxShadow: '0 4px 14px rgba(106,142,94,0.25)' }}
                        >
                            {usuario.nombre?.[0]?.toUpperCase()}{usuario.apellido?.[0]?.toUpperCase() || ''}
                        </Avatar>
                    </Badge>

                    <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                            {usuario.nombre} {usuario.apellido || ''}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                            <Chip icon={<AgricultureIcon fontSize="small" />} label={usuario.rol} size="small" sx={{ bgcolor: 'action.selected', color: 'primary.main', fontWeight: 600 }} />
                            <Chip icon={<StarBorderIcon fontSize="small" />} label={`Miembro desde ${usuario.miembro_desde}`} size="small" variant="outlined" sx={{ color: 'text.secondary', borderColor: 'rgba(0,0,0,0.15)' }} />
                        </Stack>
                    </Box>

                    {!editando ? (
                        <Button id="btn-editar-perfil" variant="outlined" startIcon={<EditOutlinedIcon />} onClick={() => setEditando(true)} sx={{ borderRadius: 3, alignSelf: { xs: 'center', sm: 'flex-start' } }}>Editar</Button>
                    ) : (
                        <Stack direction="row" spacing={1} sx={{ alignSelf: { xs: 'center', sm: 'flex-start' } }}>
                            <Button id="btn-cancelar-edicion" variant="outlined" onClick={handleCancelar} sx={{ borderRadius: 3 }}>Cancelar</Button>
                            <Button
                                id="btn-guardar-perfil"
                                variant="contained"
                                startIcon={guardando ? <CircularProgress size={14} color="inherit" /> : <SaveOutlinedIcon />}
                                onClick={handleGuardar}
                                disabled={guardando}
                                sx={{ borderRadius: 3 }}
                            >
                                Guardar
                            </Button>
                        </Stack>
                    )}
                </Stack>
            </Paper>

            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.07)' }}>
                <Typography variant="h5" sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonOutlineIcon sx={{ color: 'primary.main' }} /> Datos personales
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                    {[
                        { id: 'perfil-nombre',    label: 'Nombre',   key: 'nombre',    icon: null },
                        { id: 'perfil-apellido',  label: 'Apellido', key: 'apellido',  icon: null },
                        { id: 'perfil-email',     label: 'Email',    key: 'email',     icon: <EmailOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />, type: 'email' },
                        { id: 'perfil-telefono',  label: 'Teléfono', key: 'telefono',  icon: <PhoneOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} /> },
                        { id: 'perfil-provincia', label: 'Provincia',key: 'provincia', icon: <LocationOnOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} /> },
                        { id: 'perfil-localidad', label: 'Localidad',key: 'localidad', icon: <LocationOnOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} /> },
                        { id: 'perfil-cuit',      label: 'CUIT',     key: 'cuit',      icon: <BadgeOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} /> },
                    ].map(({ id, label, key, icon, type }) => (
                        <TextField
                            key={id}
                            id={id}
                            label={label}
                            type={type}
                            value={datos[key] ?? ''}
                            onChange={handleChange(key)}
                            disabled={!editando}
                            fullWidth
                            slotProps={icon ? { input: { startAdornment: <InputAdornment position="start">{icon}</InputAdornment> } } : undefined}
                        />
                    ))}
                </Box>
            </Paper>
        </Box>
    );
}

// ── Tab: Historial de operaciones ─────────────────────────────────────────────
function TabOperaciones() {
    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptLongOutlinedIcon sx={{ color: 'primary.main' }} /> Historial de Operaciones
            </Typography>
            <Stack spacing={2}>
                {MOCK_OPERACIONES.map((op) => {
                    const estadoStyle = ESTADO_OP_TAB_COLOR[op.estado] ?? ESTADO_OP_TAB_COLOR['Completada'];
                    const tipoColor   = TIPO_OP_COLOR[op.tipo] ?? TIPO_OP_COLOR['Venta'];
                    return (
                        <Paper
                            key={op.id}
                            elevation={0}
                            sx={{ p: 2.5, borderRadius: 4, border: '1px solid rgba(0,0,0,0.07)', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: '0 4px 16px rgba(106,142,94,0.12)' } }}
                        >
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                                <Box sx={{ width: 46, height: 46, borderRadius: 3, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: `${tipoColor}1A` }}>
                                    <ReceiptLongOutlinedIcon sx={{ color: tipoColor }} />
                                </Box>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                        <Typography variant="body1" fontWeight={600}>{op.descripcion}</Typography>
                                        <Chip label={op.tipo} size="small" sx={{ bgcolor: `${tipoColor}1A`, color: tipoColor, fontWeight: 700, fontSize: '0.7rem' }} />
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                                        {op.contraparte} · {op.fecha}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">Ref. {op.id}</Typography>
                                </Box>
                                <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, flexShrink: 0 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {op.moneda === 'ARS' ? '$' : 'USD '}{op.monto.toLocaleString('es-AR')}
                                    </Typography>
                                    <Chip label={op.estado} size="small" sx={{ bgcolor: estadoStyle.bg, color: estadoStyle.text, fontWeight: 700, fontSize: '0.7rem', mt: 0.5 }} />
                                </Box>
                            </Stack>
                        </Paper>
                    );
                })}
            </Stack>
        </Box>
    );
}

// ── CuentaCard ────────────────────────────────────────────────────────────────
function CuentaCard({ cuenta }) {
    const [copiado, setCopiado] = useState(false);
    const copiarCBU = () => {
        navigator.clipboard.writeText(cuenta.cbu);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    };
    const cbuOculto = cuenta.cbu.slice(0, 6) + ' •••• •••• •••• ' + cuenta.cbu.slice(-4);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5, borderRadius: 4,
                border: cuenta.principal ? '2px solid' : '1px solid rgba(0,0,0,0.07)',
                borderColor: cuenta.principal ? 'primary.main' : 'rgba(0,0,0,0.07)',
                position: 'relative',
                transition: 'box-shadow 0.2s',
                '&:hover': { boxShadow: '0 4px 16px rgba(106,142,94,0.12)' },
            }}
        >
            {cuenta.principal && (
                <Chip label="Principal" size="small" sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'primary.main', color: '#fff', fontWeight: 700, fontSize: '0.65rem' }} />
            )}
            <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{ width: 50, height: 50, borderRadius: 3, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'action.selected' }}>
                    <AccountBalanceOutlinedIcon sx={{ color: 'primary.main', fontSize: 26 }} />
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1" fontWeight={700} noWrap>{cuenta.banco}</Typography>
                        <Chip label={cuenta.moneda} size="small" variant="outlined" sx={{ fontSize: '0.65rem', color: 'text.secondary', borderColor: 'rgba(0,0,0,0.15)' }} />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">{cuenta.tipo}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', letterSpacing: 1 }}>{cbuOculto}</Typography>
                        <Tooltip title={copiado ? '¡Copiado!' : 'Copiar CBU'}>
                            <IconButton size="small" onClick={copiarCBU} id={`btn-copiar-cbu-${cuenta.id}`}>
                                {copiado ? <CheckIcon fontSize="small" sx={{ color: 'primary.main' }} /> : <ContentCopyIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">Alias: <strong>{cuenta.alias}</strong></Typography>
                </Box>
            </Stack>
        </Paper>
    );
}

// ── Tab: Cuentas bancarias ────────────────────────────────────────────────────
function TabCuentas() {
    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalanceOutlinedIcon sx={{ color: 'primary.main' }} /> Cuentas Bancarias
                </Typography>
                <Button id="btn-agregar-cuenta" variant="outlined" startIcon={<AddIcon />} sx={{ borderRadius: 3 }} size="small">
                    Agregar cuenta
                </Button>
            </Stack>
            <Stack spacing={2}>
                {MOCK_CUENTAS.map((cuenta) => <CuentaCard key={cuenta.id} cuenta={cuenta} />)}
            </Stack>
            <Paper
                elevation={0}
                sx={{ p: 2.5, mt: 2, borderRadius: 4, border: '2px dashed rgba(0,0,0,0.12)', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', bgcolor: 'action.selected' } }}
                id="btn-agregar-cuenta-dashed"
                component="button"
                onClick={() => {}}
            >
                <AddIcon sx={{ color: 'text.secondary', fontSize: 28 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Agregar nueva cuenta</Typography>
            </Paper>
        </Box>
    );
}

// ── Dialog de logout ──────────────────────────────────────────────────────────
function LogoutDialog({ open, onClose, onConfirm }) {
    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ sx: { borderRadius: 4, p: 1 } }} id="dialog-logout">
            <DialogTitle sx={{ fontWeight: 700 }}>¿Cerrar sesión?</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary">
                    Vas a salir de tu cuenta. Podés volver a ingresar cuando quieras.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ pb: 2, px: 3, gap: 1 }}>
                <Button id="btn-cancelar-logout" onClick={onClose} variant="outlined" sx={{ borderRadius: 3 }}>Cancelar</Button>
                <Button id="btn-confirmar-logout" onClick={onConfirm} variant="contained" color="error" sx={{ borderRadius: 3 }}>Cerrar sesión</Button>
            </DialogActions>
        </Dialog>
    );
}

// ── PerfilView principal ──────────────────────────────────────────────────────
export default function PerfilView({ usuario, logout, actualizarPerfil }) {
    const [tab, setTab]         = useState(0);
    const [dialogOpen, setDialog] = useState(false);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Navbar title="Perfil" />
            <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, width: '100%', mx: 'auto' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        aria-label="Secciones del perfil"
                        sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minWidth: 80 }, '& .Mui-selected': { color: 'primary.main' } }}
                    >
                        <Tab id="tab-info"        label="Mi perfil"    icon={<PersonOutlineIcon fontSize="small" />}             iconPosition="start" />
                        <Tab id="tab-operaciones" label="Operaciones"  icon={<ReceiptLongOutlinedIcon fontSize="small" />}        iconPosition="start" />
                        <Tab id="tab-cuentas"     label="Cuentas"      icon={<AccountBalanceOutlinedIcon fontSize="small" />}    iconPosition="start" />
                    </Tabs>
                    <Tooltip title="Cerrar sesión">
                        <IconButton id="btn-logout" onClick={() => setDialog(true)} sx={{ color: 'error.main', '&:hover': { bgcolor: 'rgba(211,47,47,0.08)' } }}>
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>

                <Fade in key={tab}>
                    <Box>
                        {tab === 0 && <TabInfo usuario={usuario} onSave={actualizarPerfil} />}
                        {tab === 1 && <TabOperaciones />}
                        {tab === 2 && <TabCuentas />}
                    </Box>
                </Fade>
            </Box>

            <LogoutDialog
                open={dialogOpen}
                onClose={() => setDialog(false)}
                onConfirm={() => { setDialog(false); logout(); }}
            />
        </Box>
    );
}
