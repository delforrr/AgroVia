// Vista de inicio de sesión.
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
 * @param {Function} login             - Handler de login con email/password
 * @param {Function} loginConGoogle    - Handler de login con OAuth Google
 * @param {boolean}  loading           - Estado de carga
 * @param {string}   error             - Mensaje de error
 * @param {Function} setError          - Setter del error
 * @param {Function} onSwitchToRegister - Cambiar a vista de registro
 */
export default function LoginView({ login, loginConGoogle, loading, error, setError, onSwitchToRegister }) {
    const [email, setEmail]     = useState('');
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
                <Paper elevation={3} sx={{ p: { xs: 3, sm: 5 }, borderRadius: 5, width: '100%', maxWidth: 420, textAlign: 'center' }}>
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
                                id="login-password"
                                label="Contraseña"
                                type={showPass ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                                                <IconButton size="small" onClick={() => setShowPass((p) => !p)} edge="end">
                                                    {showPass ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    },
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
