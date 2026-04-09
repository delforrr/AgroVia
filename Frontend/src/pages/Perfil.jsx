// Página de perfil del usuario

import { useState } from 'react';
import {
    Box, Typography, Stack, Avatar, Button, Paper, Chip,
    Tab, Tabs, TextField, Divider, IconButton, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions,
    CircularProgress, Alert, Fade, InputAdornment, Badge,
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
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import StarBorderIcon from '@mui/icons-material/StarBorder';

import Navbar from '../components/layout/Navbar.jsx';
import { useAuth } from '../hooks/useAuth.js';

// ─── Mock operaciones/cuentas (hasta que el backend de operaciones esté listo) ─
const MOCK_OPERACIONES = [
    { id: 'OP-001', tipo: 'Venta', descripcion: '50 terneros Hereford – Río Cuarto', fecha: '28 Mar 2026', monto: 550000, moneda: 'ARS', estado: 'Completada', contraparte: 'Estancia Los Álamos' },
    { id: 'OP-002', tipo: 'Compra', descripcion: 'Tractor John Deere 6125J', fecha: '15 Mar 2026', monto: 85000, moneda: 'USD', estado: 'En proceso', contraparte: 'Agro Maquinarias Rafaela' },
    { id: 'OP-003', tipo: 'Venta', descripcion: '100 tn Maíz – Venado Tuerto', fecha: '02 Mar 2026', monto: 320000, moneda: 'ARS', estado: 'Completada', contraparte: 'Acopio San Martín' },
];
const MOCK_CUENTAS = [
    { id: 1, banco: 'Banco Nación Argentina', tipo: 'Cuenta Corriente', alias: 'CAMPO.VERDE.ARS', cbu: '0110034030034012345678', moneda: 'ARS', principal: true },
    { id: 2, banco: 'Banco Galicia', tipo: 'Caja de Ahorro', alias: 'GALICIA.CAMPO.USD', cbu: '0070036720000012345678', moneda: 'USD', principal: false },
];

const ESTADO_COLOR = {
    'Completada': { bg: '#e8f5e9', text: '#2e7d32' },
    'En proceso': { bg: '#fff8e1', text: '#f57f17' },
    'Cancelada': { bg: '#fce4ec', text: '#c62828' },
};

const TIPO_COLOR = {
    'Venta': '#6A8E5E',
    'Compra': '#A0785E',
    'Servicio': '#5E7FA0',
};

function LoginView({ login, loginConGoogle, loading, error, setError, onSwitchToRegister }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) { setError('Completá todos los campos.'); return; }
        await login(email, password);
    };

    return (
        <Fade in>
            <Box
                sx={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.default',
                    p: 2,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: { xs: 3, sm: 5 },
                        borderRadius: 5,
                        width: '100%',
                        maxWidth: 420,
                        textAlign: 'center',
                    }}
                >
                    {/* Logo */}
                    <Box sx={{ mb: 3 }}>
                        <AgricultureIcon sx={{ fontSize: 52, color: 'primary.main' }} />
                        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700, mt: 0.5 }}>
                            AgroVía
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Iniciá sesión para acceder a tu perfil
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 3, textAlign: 'left' }} onClose={() => setError('')}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit} noValidate>
                        <Stack spacing={2}>
                            <TextField
                                id="login-email"
                                label="Email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                fullWidth
                                autoComplete="email"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />
                            <TextField
                                id="login-password"
                                label="Contraseña"
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                fullWidth
                                autoComplete="current-password"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton size="small" onClick={() => setShowPass(p => !p)} edge="end">
                                                    {showPass ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }
                                }}
                            />

                            <Button
                                id="btn-ingresar"
                                type="submit"
                                variant="contained"
                                fullWidth
                                size="large"
                                disabled={loading}
                                sx={{ borderRadius: 3, fontWeight: 700, py: 1.4 }}
                            >
                                {loading ? <CircularProgress size={22} color="inherit" /> : 'Ingresar'}
                            </Button>
                        </Stack>
                    </form>

                    <Divider sx={{ my: 2 }}>o</Divider>

                    {/* Login con Google */}
                    <Button
                        id="btn-login-google"
                        variant="outlined"
                        fullWidth
                        size="large"
                        onClick={loginConGoogle}
                        sx={{
                            borderRadius: 3,
                            borderColor: 'rgba(0,0,0,0.23)',
                            color: 'text.primary',
                            fontWeight: 600,
                            mb: 1,
                            gap: 1.5,
                            '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                        }}
                        startIcon={
                            <Box
                                component="svg"
                                viewBox="0 0 48 48"
                                sx={{ width: 20, height: 20, flexShrink: 0 }}
                            >
                                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            </Box>
                        }
                    >
                        Continuar con Google
                    </Button>

                    <Divider sx={{ my: 1 }} />

                    <Button
                        id="btn-registro"
                        variant="outlined"
                        fullWidth
                        sx={{ borderRadius: 3 }}
                        onClick={onSwitchToRegister}
                    >
                        Crear cuenta nueva
                    </Button>
                </Paper>
            </Box>
        </Fade>
    );
}

// ═══════════════════════════ TAB: INFORMACIÓN ═════════════════════════
function TabInfo({ usuario, onSave }) {
    const [editando, setEditando] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [datos, setDatos] = useState({ ...usuario });
    const [success, setSuccess] = useState(false);

    const handleChange = (campo) => (e) => setDatos(prev => ({ ...prev, [campo]: e.target.value }));

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

            {/* Header de perfil */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.07)', mb: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'center', sm: 'flex-start' }}>
                    {/* Avatar */}
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
                            sx={{
                                width: 96, height: 96,
                                fontSize: '2.2rem',
                                bgcolor: 'primary.main',
                                border: '3px solid white',
                                boxShadow: '0 4px 14px rgba(106,142,94,0.25)',
                            }}
                        >
                            {usuario.nombre[0]}{usuario.apellido[0]}
                        </Avatar>
                    </Badge>

                    {/* Info básica */}
                    <Box sx={{ flexGrow: 1, textAlign: { xs: 'center', sm: 'left' } }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary' }}>
                            {usuario.nombre} {usuario.apellido}
                        </Typography>
                        <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap', justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                            <Chip
                                icon={<AgricultureIcon fontSize="small" />}
                                label={usuario.rol}
                                size="small"
                                sx={{ bgcolor: 'action.selected', color: 'primary.main', fontWeight: 600 }}
                            />
                            <Chip
                                icon={<StarBorderIcon fontSize="small" />}
                                label={`Miembro desde ${usuario.miembro_desde}`}
                                size="small"
                                variant="outlined"
                                sx={{ color: 'text.secondary', borderColor: 'rgba(0,0,0,0.15)' }}
                            />
                        </Stack>
                    </Box>

                    {/* Botón editar */}
                    {!editando ? (
                        <Button
                            id="btn-editar-perfil"
                            variant="outlined"
                            startIcon={<EditOutlinedIcon />}
                            onClick={() => setEditando(true)}
                            sx={{ borderRadius: 3, alignSelf: { xs: 'center', sm: 'flex-start' } }}
                        >
                            Editar
                        </Button>
                    ) : (
                        <Stack direction="row" spacing={1} sx={{ alignSelf: { xs: 'center', sm: 'flex-start' } }}>
                            <Button id="btn-cancelar-edicion" variant="outlined" onClick={handleCancelar} sx={{ borderRadius: 3 }}>
                                Cancelar
                            </Button>
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

            {/* Campos de información */}
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid rgba(0,0,0,0.07)' }}>
                <Typography variant="h5" sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonOutlineIcon sx={{ color: 'primary.main' }} />
                    Datos personales
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2.5 }}>
                    <TextField
                        id="perfil-nombre"
                        label="Nombre"
                        value={datos.nombre}
                        onChange={handleChange('nombre')}
                        disabled={!editando}
                        fullWidth
                    />
                    <TextField
                        id="perfil-apellido"
                        label="Apellido"
                        value={datos.apellido}
                        onChange={handleChange('apellido')}
                        disabled={!editando}
                        fullWidth
                    />
                    <TextField
                        id="perfil-email"
                        label="Email"
                        type="email"
                        value={datos.email}
                        onChange={handleChange('email')}
                        disabled={!editando}
                        fullWidth
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment> } }}
                    />
                    <TextField
                        id="perfil-telefono"
                        label="Teléfono"
                        value={datos.telefono}
                        onChange={handleChange('telefono')}
                        disabled={!editando}
                        fullWidth
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><PhoneOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment> } }}
                    />
                    <TextField
                        id="perfil-provincia"
                        label="Provincia"
                        value={datos.provincia}
                        onChange={handleChange('provincia')}
                        disabled={!editando}
                        fullWidth
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><LocationOnOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment> } }}
                    />
                    <TextField
                        id="perfil-localidad"
                        label="Localidad"
                        value={datos.localidad}
                        onChange={handleChange('localidad')}
                        disabled={!editando}
                        fullWidth
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><LocationOnOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment> } }}
                    />
                    <TextField
                        id="perfil-cuit"
                        label="CUIT"
                        value={datos.cuit}
                        onChange={handleChange('cuit')}
                        disabled={!editando}
                        fullWidth
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><BadgeOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment> } }}
                    />
                    <TextField
                        id="perfil-rol"
                        label="Rol / Actividad"
                        value={datos.rol}
                        onChange={handleChange('rol')}
                        disabled={!editando}
                        fullWidth
                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><AgricultureIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment> } }}
                    />
                </Box>
            </Paper>
        </Box>
    );
}

// ══════════════════════ TAB: OPERACIONES RECIENTES ════════════════════
function TabOperaciones() {
    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ReceiptLongOutlinedIcon sx={{ color: 'primary.main' }} />
                Historial de Operaciones
            </Typography>

            <Stack spacing={2}>
                {MOCK_OPERACIONES.map(op => {
                    const estadoStyle = ESTADO_COLOR[op.estado] ?? ESTADO_COLOR['Completada'];
                    const tipoColor = TIPO_COLOR[op.tipo] ?? '#6A8E5E';
                    return (
                        <Paper
                            key={op.id}
                            elevation={0}
                            sx={{
                                p: 2.5,
                                borderRadius: 4,
                                border: '1px solid rgba(0,0,0,0.07)',
                                transition: 'box-shadow 0.2s',
                                '&:hover': { boxShadow: '0 4px 16px rgba(106,142,94,0.12)' },
                            }}
                        >
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                                {/* Ícono tipo */}
                                <Box
                                    sx={{
                                        width: 46, height: 46, borderRadius: 3, flexShrink: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        backgroundColor: `${tipoColor}1A`,
                                    }}
                                >
                                    <ReceiptLongOutlinedIcon sx={{ color: tipoColor }} />
                                </Box>

                                {/* Descripción */}
                                <Box sx={{ flexGrow: 1 }}>
                                    <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                        <Typography variant="body1" fontWeight={600}>
                                            {op.descripcion}
                                        </Typography>
                                        <Chip
                                            label={op.tipo}
                                            size="small"
                                            sx={{ bgcolor: `${tipoColor}1A`, color: tipoColor, fontWeight: 700, fontSize: '0.7rem' }}
                                        />
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
                                        {op.contraparte} · {op.fecha}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Ref. {op.id}
                                    </Typography>
                                </Box>

                                {/* Monto y estado */}
                                <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, flexShrink: 0 }}>
                                    <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 700 }}>
                                        {op.moneda === 'ARS' ? '$' : 'USD '}{op.monto.toLocaleString('es-AR')}
                                    </Typography>
                                    <Chip
                                        label={op.estado}
                                        size="small"
                                        sx={{
                                            bgcolor: estadoStyle.bg,
                                            color: estadoStyle.text,
                                            fontWeight: 700,
                                            fontSize: '0.7rem',
                                            mt: 0.5,
                                        }}
                                    />
                                </Box>
                            </Stack>
                        </Paper>
                    );
                })}
            </Stack>

            {MOCK_OPERACIONES.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                    <Typography sx={{ fontSize: '3rem' }}>📋</Typography>
                    <Typography variant="h5" sx={{ mt: 1 }}>Sin operaciones</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Cuando realices tu primera operación, aparecerá aquí.
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

// ══════════════════════ TAB: CUENTAS BANCARIAS ════════════════════════
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
                <Chip
                    label="Principal"
                    size="small"
                    sx={{
                        position: 'absolute', top: 12, right: 12,
                        bgcolor: 'primary.main', color: '#fff', fontWeight: 700, fontSize: '0.65rem',
                    }}
                />
            )}

            <Stack direction="row" spacing={2} alignItems="center">
                <Box
                    sx={{
                        width: 50, height: 50, borderRadius: 3, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        backgroundColor: 'action.selected',
                    }}
                >
                    <AccountBalanceOutlinedIcon sx={{ color: 'primary.main', fontSize: 26 }} />
                </Box>

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body1" fontWeight={700} noWrap>
                            {cuenta.banco}
                        </Typography>
                        <Chip
                            label={cuenta.moneda}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.65rem', color: 'text.secondary', borderColor: 'rgba(0,0,0,0.15)' }}
                        />
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                        {cuenta.tipo}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                        <Typography variant="caption" sx={{ fontFamily: 'monospace', color: 'text.secondary', letterSpacing: 1 }}>
                            {cbuOculto}
                        </Typography>
                        <Tooltip title={copiado ? '¡Copiado!' : 'Copiar CBU'}>
                            <IconButton size="small" onClick={copiarCBU} id={`btn-copiar-cbu-${cuenta.id}`}>
                                {copiado ? <CheckIcon fontSize="small" sx={{ color: 'primary.main' }} /> : <ContentCopyIcon fontSize="small" sx={{ color: 'text.secondary' }} />}
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                        Alias: <strong>{cuenta.alias}</strong>
                    </Typography>
                </Box>
            </Stack>
        </Paper>
    );
}

function TabCuentas() {
    return (
        <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
                <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AccountBalanceOutlinedIcon sx={{ color: 'primary.main' }} />
                    Cuentas Bancarias
                </Typography>
                <Button
                    id="btn-agregar-cuenta"
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: 3 }}
                    size="small"
                >
                    Agregar cuenta
                </Button>
            </Stack>

            <Stack spacing={2}>
                {MOCK_CUENTAS.map(cuenta => (
                    <CuentaCard key={cuenta.id} cuenta={cuenta} />
                ))}
            </Stack>

            <Paper
                elevation={0}
                sx={{
                    p: 2.5, mt: 2, borderRadius: 4,
                    border: '2px dashed rgba(0,0,0,0.12)',
                    textAlign: 'center', cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: 'primary.main', bgcolor: 'action.selected' },
                }}
                id="btn-agregar-cuenta-dashed"
                component="button"
                onClick={() => { }}
            >
                <AddIcon sx={{ color: 'text.secondary', fontSize: 28 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Agregar nueva cuenta
                </Typography>
            </Paper>
        </Box>
    );
}

// ════════════════════════ DIÁLOGO DE LOGOUT ════════════════════════════
function LogoutDialog({ open, onClose, onConfirm }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
            id="dialog-logout"
        >
            <DialogTitle sx={{ fontWeight: 700 }}>¿Cerrar sesión?</DialogTitle>
            <DialogContent>
                <Typography variant="body2" color="text.secondary">
                    Vas a salir de tu cuenta. Podés volver a ingresar cuando quieras.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ pb: 2, px: 3, gap: 1 }}>
                <Button id="btn-cancelar-logout" onClick={onClose} variant="outlined" sx={{ borderRadius: 3 }}>
                    Cancelar
                </Button>
                <Button id="btn-confirmar-logout" onClick={onConfirm} variant="contained" color="error" sx={{ borderRadius: 3 }}>
                    Cerrar sesión
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// ═════════════════════════════ PERFIL VIEW ════════════════════════════
function PerfilView({ usuario, logout, actualizarPerfil }) {
    const [tab, setTab] = useState(0);
    const [dialogOpen, setDialog] = useState(false);

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Navbar title="Perfil" />

            <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, width: '100%', mx: 'auto' }}>
                {/* Tabs + Logout */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                    <Tabs
                        value={tab}
                        onChange={(_, v) => setTab(v)}
                        aria-label="Secciones del perfil"
                        sx={{
                            '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minWidth: 80 },
                            '& .Mui-selected': { color: 'primary.main' },
                        }}
                    >
                        <Tab id="tab-info" label="Mi perfil" icon={<PersonOutlineIcon fontSize="small" />} iconPosition="start" />
                        <Tab id="tab-operaciones" label="Operaciones" icon={<ReceiptLongOutlinedIcon fontSize="small" />} iconPosition="start" />
                        <Tab id="tab-cuentas" label="Cuentas" icon={<AccountBalanceOutlinedIcon fontSize="small" />} iconPosition="start" />
                    </Tabs>

                    <Tooltip title="Cerrar sesión">
                        <IconButton
                            id="btn-logout"
                            onClick={() => setDialog(true)}
                            sx={{ color: 'error.main', '&:hover': { bgcolor: 'rgba(211,47,47,0.08)' } }}
                        >
                            <LogoutIcon />
                        </IconButton>
                    </Tooltip>
                </Stack>

                {/* Contenido de cada tab */}
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

// ═══════════════════════════ PANTALLA DE REGISTRO ════════════════════
function RegisterView({ register, loading, error, setError, onSwitchToLogin }) {
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre || !email || !password) { setError('Completá todos los campos.'); return; }
        if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return; }
        const result = await register(email, password, nombre);
        if (result?.ok) setSuccess(true);
    };

    return (
        <Fade in>
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'background.default', p: 2 }}>
                <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 5, width: '100%', maxWidth: 420, textAlign: 'center' }}>
                    <Box sx={{ mb: 3 }}>
                        <AgricultureIcon sx={{ fontSize: 52, color: 'primary.main' }} />
                        <Typography variant="h4" sx={{ color: 'primary.main', fontWeight: 700, mt: 0.5 }}>AgroVía</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Creá tu cuenta gratis</Typography>
                    </Box>

                    {success ? (
                        <Alert severity="success" sx={{ borderRadius: 3, textAlign: 'left' }}>
                            <strong>¡Cuenta creada!</strong> Revisá tu email para confirmar tu registro y luego iniciá sesión.
                            <Button size="small" sx={{ mt: 1, display: 'block' }} onClick={onSwitchToLogin}>Ir al login</Button>
                        </Alert>
                    ) : (
                        <>
                            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 3, textAlign: 'left' }} onClose={() => setError('')}>{error}</Alert>}
                            <form onSubmit={handleSubmit} noValidate>
                                <Stack spacing={2}>
                                    <TextField id="register-nombre" label="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} fullWidth />
                                    <TextField id="register-email" label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} fullWidth autoComplete="email"
                                        slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment> } }}
                                    />
                                    <TextField id="register-password" label="Contraseña" type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} fullWidth
                                        helperText="Mínimo 6 caracteres"
                                        slotProps={{
                                            input: {
                                                startAdornment: <InputAdornment position="start"><LockOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} /></InputAdornment>,
                                                endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={() => setShowPass(p => !p)} edge="end">{showPass ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}</IconButton></InputAdornment>,
                                            }
                                        }}
                                    />
                                    <Button id="btn-crear-cuenta" type="submit" variant="contained" fullWidth size="large" disabled={loading} sx={{ borderRadius: 3, fontWeight: 700, py: 1.4 }}>
                                        {loading ? <CircularProgress size={22} color="inherit" /> : 'Crear cuenta'}
                                    </Button>
                                </Stack>
                            </form>
                            <Divider sx={{ my: 2 }} />
                            <Button id="btn-volver-login" variant="outlined" fullWidth sx={{ borderRadius: 3 }} onClick={onSwitchToLogin}>Ya tengo cuenta</Button>
                        </>
                    )}
                </Paper>
            </Box>
        </Fade>
    );
}

// ─────────────────────────────── EXPORT ──────────────────────────────
export default function PerfilPage() {
    const { usuario, loading, error, setError, login, loginConGoogle, register, logout, actualizarPerfil } = useAuth();
    const [view, setView] = useState('login'); // 'login' | 'register'

    if (!usuario) {
        if (view === 'register') {
            return <RegisterView register={register} loading={loading} error={error} setError={setError} onSwitchToLogin={() => { setError(''); setView('login'); }} />;
        }
        return <LoginView login={login} loginConGoogle={loginConGoogle} loading={loading} error={error} setError={setError} onSwitchToRegister={() => { setError(''); setView('register'); }} />;
    }

    return <PerfilView usuario={usuario} logout={logout} actualizarPerfil={actualizarPerfil} />;
}