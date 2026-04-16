// Vista de registro de nuevo usuario.
// Extraído de Perfil.jsx para separar la responsabilidad de autenticación.

import { useState } from 'react';
import {
    Box, Typography, Stack, Button, Paper, TextField,
    Divider, CircularProgress, Alert, Fade, IconButton, InputAdornment,
} from '@mui/material';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

/**
 * @param {Function} register        - Handler de registro de cuenta
 * @param {boolean}  loading         - Estado de carga
 * @param {string}   error           - Mensaje de error
 * @param {Function} setError        - Setter del error
 * @param {Function} onSwitchToLogin - Cambiar a vista de login
 */
export default function RegisterView({ register, loading, error, setError, onSwitchToLogin }) {
    const [nombre, setNombre]               = useState('');
    const [apellido, setApellido]           = useState('');
    const [dni, setDni]                     = useState('');
    const [fechaNacimiento, setFechaNac]    = useState('');
    const [email, setEmail]                 = useState('');
    const [password, setPassword]           = useState('');
    const [showPass, setShowPass]           = useState(false);
    const [success, setSuccess]             = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!nombre || !apellido || !dni || !fechaNacimiento || !email || !password) {
            setError('Completá todos los campos incluyendo DNI y Fecha de Nacimiento.');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }
        const result = await register(email, password, nombre, apellido, dni, fechaNacimiento);
        if (result?.ok) setSuccess(true);
    };

    return (
        <Fade in>
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'background.default', p: 2 }}>
                <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 5, width: '100%', maxWidth: 450, textAlign: 'center' }}>
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
                            {error && (
                                <Alert severity="error" sx={{ mb: 2, borderRadius: 3, textAlign: 'left' }} onClose={() => setError('')}>
                                    {error}
                                </Alert>
                            )}
                            <form onSubmit={handleSubmit} noValidate>
                                <Stack spacing={2}>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <TextField id="register-nombre" label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} fullWidth />
                                        <TextField id="register-apellido" label="Apellido" value={apellido} onChange={(e) => setApellido(e.target.value)} fullWidth />
                                    </Stack>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                        <TextField
                                            id="register-dni"
                                            label="DNI"
                                            value={dni}
                                            onChange={(e) => setDni(e.target.value)}
                                            fullWidth
                                            helperText="DNI 12345678 fallará (Mock API)"
                                        />
                                        <TextField
                                            id="register-fecha"
                                            label="Fecha Nacimiento"
                                            type="date"
                                            value={fechaNacimiento}
                                            onChange={(e) => setFechaNac(e.target.value)}
                                            fullWidth
                                            slotProps={{ inputLabel: { shrink: true } }}
                                        />
                                    </Stack>
                                    <TextField
                                        id="register-email"
                                        label="Email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        fullWidth
                                        autoComplete="email"
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <EmailOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />
                                    <TextField
                                        id="register-password"
                                        label="Contraseña"
                                        type={showPass ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        fullWidth
                                        helperText="Mínimo 6 caracteres"
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton size="small" onClick={() => setShowPass((p) => !p)} edge="end">
                                                            {showPass
                                                                ? <VisibilityOffOutlinedIcon fontSize="small" />
                                                                : <VisibilityOutlinedIcon fontSize="small" />
                                                            }
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            },
                                        }}
                                    />
                                    <Button
                                        id="btn-crear-cuenta"
                                        type="submit"
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={loading}
                                        sx={{ borderRadius: 3, fontWeight: 700, py: 1.4 }}
                                    >
                                        {loading ? <CircularProgress size={22} color="inherit" /> : 'Crear cuenta'}
                                    </Button>
                                </Stack>
                            </form>
                            <Divider sx={{ my: 2 }} />
                            <Button id="btn-volver-login" variant="outlined" fullWidth sx={{ borderRadius: 3 }} onClick={onSwitchToLogin}>
                                Ya tengo cuenta
                            </Button>
                        </>
                    )}
                </Paper>
            </Box>
        </Fade>
    );
}
