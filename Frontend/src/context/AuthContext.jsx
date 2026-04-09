// Contexto global de autenticación — provee el estado de sesión a toda la app.
// Envuelve el árbol de componentes en App.jsx para evitar múltiples suscripciones
// a Supabase y permite acceder al usuario desde cualquier componente con useAuthContext().

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';

// ─── Contexto ─────────────────────────────────────────────────────────────────
const AuthContext = createContext(null);

// ─── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
    const [session,  setSession]  = useState(null);
    const [usuario,  setUsuario]  = useState(null);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState('');

    // ── Cargar perfil extendido desde public.usuarios ─────────────────────
    const cargarPerfil = useCallback(async (userId) => {
        const { data, error: err } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', userId)
            .single();

        if (err) {
            console.warn('[AuthContext] Perfil extendido no encontrado:', err.message);
            return null;
        }
        return data;
    }, []);

    // ── Suscripción única a cambios de sesión ─────────────────────────────
    useEffect(() => {
        // Sesión inicial
        supabase.auth.getSession().then(async ({ data: { session: s } }) => {
            setSession(s);
            if (s?.user) {
                const perfil = await cargarPerfil(s.user.id);
                setUsuario(perfil
                    ? { ...perfil, email: s.user.email }
                    : { id: s.user.id, email: s.user.email, nombre: s.user.email }
                );
            }
            setLoading(false);
        });

        // Listener de cambios (login, logout, refresh token)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
            setSession(s);
            if (s?.user) {
                const perfil = await cargarPerfil(s.user.id);
                setUsuario(perfil
                    ? { ...perfil, email: s.user.email }
                    : { id: s.user.id, email: s.user.email, nombre: s.user.email }
                );
            } else {
                setUsuario(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [cargarPerfil]);

    // ── LOGIN con email/contraseña ────────────────────────────────────────
    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError('');
        try {
            const { error: err } = await supabase.auth.signInWithPassword({ email, password });
            if (err) {
                const msg = err.message === 'Invalid login credentials'
                    ? 'Email o contraseña incorrectos.'
                    : err.message;
                setError(msg);
                return { ok: false };
            }
            return { ok: true };
        } catch {
            setError('Error de conexión. Intentá de nuevo.');
            return { ok: false };
        } finally {
            setLoading(false);
        }
    }, []);

    // ── LOGIN con Google (OAuth) ───────────────────────────────────────────
    const loginConGoogle = useCallback(async () => {
        setError('');
        const { error: err } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/perfil`,
            },
        });
        if (err) setError(err.message);
    }, []);

    // ── REGISTRO con email/contraseña ─────────────────────────────────────
    const register = useCallback(async (email, password, nombre) => {
        setLoading(true);
        setError('');
        try {
            const { error: err } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { nombre } },
            });
            if (err) { setError(err.message); return { ok: false }; }
            return { ok: true, needsConfirmation: true };
        } catch {
            setError('Error al registrar. Intentá de nuevo.');
            return { ok: false };
        } finally {
            setLoading(false);
        }
    }, []);

    // ── LOGOUT ────────────────────────────────────────────────────────────
    const logout = useCallback(async () => {
        await supabase.auth.signOut();
        setUsuario(null);
        setSession(null);
        setError('');
    }, []);

    // ── ACTUALIZAR PERFIL ─────────────────────────────────────────────────
    const actualizarPerfil = useCallback(async (datos) => {
        if (!session?.user?.id) return { ok: false };
        try {
            const { error: err } = await supabase
                .from('usuarios')
                .update({
                    nombre:    datos.nombre,
                    apellido:  datos.apellido,
                    telefono:  datos.telefono,
                    provincia: datos.provincia,
                    localidad: datos.localidad,
                    cuit:      datos.cuit,
                    rol:       datos.rol,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', session.user.id);

            if (err) { setError(err.message); return { ok: false }; }
            setUsuario(prev => ({ ...prev, ...datos }));
            return { ok: true };
        } catch {
            setError('Error al guardar el perfil.');
            return { ok: false };
        }
    }, [session]);

    // ── Access token para requests autenticados al backend ────────────────
    const getAccessToken = useCallback(() => {
        return session?.access_token ?? null;
    }, [session]);

    return (
        <AuthContext.Provider value={{
            usuario,
            session,
            loading,
            error,
            setError,
            login,
            loginConGoogle,
            register,
            logout,
            actualizarPerfil,
            getAccessToken,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// ─── Hook de consumo ─────────────────────────────────────────────────────────
export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuthContext debe usarse dentro de <AuthProvider>');
    }
    return ctx;
}
