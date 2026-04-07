import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';

// ─────────────────────────────────────────────────────────────────────────────
export function useAuth() {
    const [session,  setSession]  = useState(null);   // sesión activa de Supabase
    const [usuario,  setUsuario]  = useState(null);   // perfil extendido (public.usuarios)
    const [loading,  setLoading]  = useState(true);   // carga inicial
    const [error,    setError]    = useState('');

    // ── Cargar perfil extendido desde public.usuarios ─────────────────────
    const cargarPerfil = useCallback(async (userId) => {
        const { data, error: err } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', userId)
            .single();

        if (err) {
            console.warn('[useAuth] No se encontró perfil extendido:', err.message);
            return null;
        }
        return data;
    }, []);

    // ── Escuchar cambios de sesión (login, logout, refresco de token) ─────
    useEffect(() => {
        // Obtener sesión inicial
        supabase.auth.getSession().then(async ({ data: { session: s } }) => {
            setSession(s);
            if (s?.user) {
                const perfil = await cargarPerfil(s.user.id);
                setUsuario(perfil ? { ...perfil, email: s.user.email } : { id: s.user.id, email: s.user.email });
            }
            setLoading(false);
        });

        // Suscribirse a cambios de auth (login, logout, refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
            setSession(s);
            if (s?.user) {
                const perfil = await cargarPerfil(s.user.id);
                setUsuario(perfil ? { ...perfil, email: s.user.email } : { id: s.user.id, email: s.user.email });
            } else {
                setUsuario(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [cargarPerfil]);

    // ── LOGIN ─────────────────────────────────────────────────────────────
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

    // ── REGISTRO ──────────────────────────────────────────────────────────
    const register = useCallback(async (email, password, nombre) => {
        setLoading(true);
        setError('');
        try {
            const { error: err } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { nombre }, // pasado al trigger handle_new_user
                },
            });
            if (err) {
                setError(err.message);
                return { ok: false };
            }
            // En Supabase, después de signUp el usuario puede necesitar confirmar email
            // Si está en modo desarrollo con email confirmation OFF, la sesión se crea sola.
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

            // Actualizar estado local
            setUsuario(prev => ({ ...prev, ...datos }));
            return { ok: true };
        } catch {
            setError('Error al guardar el perfil.');
            return { ok: false };
        }
    }, [session]);

    // ── Acceso token JWT para el backend ─────────────────────────────────
    const getAccessToken = useCallback(() => {
        return session?.access_token ?? null;
    }, [session]);

    return {
        usuario,
        session,
        loading,
        error,
        setError,
        login,
        register,
        logout,
        actualizarPerfil,
        getAccessToken,
    };
}
