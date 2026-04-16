// ProtectedRoute — wrapper para rutas que requieren autenticación o un rol específico.
// Si el usuario no cumple los requisitos, redirige a /perfil.

import { Navigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAuth } from '../../hooks/useAuth.js';

/**
 * @param {string}  [requiredRole] - Rol requerido para acceder ('admin', etc.). Opcional.
 * @param {node}    children       - Contenido a renderizar si se cumplen los requisitos.
 */
export default function ProtectedRoute({ requiredRole, children }) {
    const { usuario, loading } = useAuth();

    // Mientras se verifica la sesión, mostramos un spinner centrado
    if (loading) {
        return (
            <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    // No autenticado → redirigir a /perfil (login)
    if (!usuario) {
        return <Navigate to="/perfil" replace />;
    }

    // Rol requerido no cumplido → redirigir a inicio
    if (requiredRole && usuario.rol !== requiredRole) {
        return <Navigate to="/" replace />;
    }

    return children;
}
