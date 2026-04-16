// Página de perfil — orquesta las vistas de autenticación y perfil del usuario.
// La lógica de cada vista está en features/auth/ y features/perfil/.

import { useState } from 'react';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../hooks/useAuth.js';

import LoginView    from '../components/features/auth/LoginView.jsx';
import RegisterView from '../components/features/auth/RegisterView.jsx';
import PerfilView   from '../components/features/perfil/PerfilView.jsx';

export default function PerfilPage() {
    const { usuario, loading, error, setError, login, loginConGoogle, register, logout, actualizarPerfil } = useAuth();
    const [view, setView] = useState('login');

    if (loading && !usuario) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (!usuario) {
        if (view === 'register') {
            return (
                <RegisterView
                    register={register}
                    loading={loading}
                    error={error}
                    setError={setError}
                    onSwitchToLogin={() => { setError(''); setView('login'); }}
                />
            );
        }
        return (
            <LoginView
                login={login}
                loginConGoogle={loginConGoogle}
                loading={loading}
                error={error}
                setError={setError}
                onSwitchToRegister={() => { setError(''); setView('register'); }}
            />
        );
    }

    return (
        <PerfilView
            usuario={usuario}
            logout={logout}
            actualizarPerfil={actualizarPerfil}
        />
    );
}