// Contexto global de autenticación — provee el estado de sesión a toda la app.
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session,  setSession]  = useState(null);
    const [usuario,  setUsuario]  = useState(null);
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState('');

    // ─── Función para transformar datos de Auth/DB en un objeto de usuario único ───
    const mapearUsuario = useCallback((userAuth, perfilDb = null) => {
        if (!userAuth) return null;
        
        // La "Fuente de Verdad" inicial son los metadatos del token de Supabase.
        // Esto garantiza que la UI tenga datos ANTES de que el trigger termine.
        const meta = userAuth.user_metadata || {};
        
        return {
            id: userAuth.id,
            email: userAuth.email,
            nombre: perfilDb?.nombre || meta.nombre || userAuth.email.split('@')[0],
            apellido: perfilDb?.apellido || meta.apellido || '',
            dni: perfilDb?.dni || meta.dni || '',
            fecha_nacimiento: perfilDb?.fecha_nacimiento || meta.fecha_nacimiento || '',
            rol: perfilDb?.rol || 'usuario',
            miembro_desde: perfilDb?.miembro_desde || userAuth.created_at,
            telefono: perfilDb?.telefono || '',
            provincia: perfilDb?.provincia || '',
            localidad: perfilDb?.localidad || '',
            cuit: perfilDb?.cuit || '',
            avatar: perfilDb?.avatar_url || meta.avatar_url || null,
            // Flag para saber si los datos vienen de la DB o solo del token
            sync: !!perfilDb
        };
    }, []);

    const cargarPerfil = useCallback(async (userId) => {
        const { data, error: err } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (err) return null;
        return data;
    }, []);

    useEffect(() => {
        let montado = true;

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, s) => {
            if (!montado) return;

            setSession(s);

            if (s?.user) {
                // 1. Inmediatamente mostramos datos desde el Metadata (Sin esperar a la DB)
                const userInicial = mapearUsuario(s.user);
                setUsuario(userInicial);
                setLoading(false);

                // 2. Intentamos enriquecer con datos de la DB en segundo plano
                const perfil = await cargarPerfil(s.user.id);
                if (montado && perfil) {
                    setUsuario(mapearUsuario(s.user, perfil));
                }
            } else {
                setUsuario(null);
                setLoading(false);
            }
        });

        return () => { montado = false; subscription.unsubscribe(); };
    }, [cargarPerfil, mapearUsuario]);

    // ─── LOGIN ────────────────────────────────────────────────────────────
    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError('');
        const { error: err } = await supabase.auth.signInWithPassword({ email, password });
        if (err) {
            setError(err.message === 'Invalid login credentials' ? 'Email o contraseña incorrectos.' : err.message);
            setLoading(false);
            return { ok: false };
        }
        return { ok: true };
    }, []);

    // ─── LOGIN CON GOOGLE ─────────────────────────────────────────────────
    const loginConGoogle = useCallback(async () => {
        setError('');
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: `${window.location.origin}/perfil` },
        });
    }, []);

    // ─── REGISTRO ─────────────────────────────────────────────────────────
    const register = useCallback(async (email, password, nombre, apellido, dni, fechaNacimiento) => {
        setLoading(true);
        setError('');
        try {
            // Mock validación DNI (puedes mantenerlo aquí o moverlo al backend)
            if (dni === '12345678') throw new Error('DNI no válido.');

            const { data, error: err } = await supabase.auth.signUp({
                email,
                password,
                options: { 
                    data: { nombre, apellido, dni, fecha_nacimiento: fechaNacimiento } 
                },
            });

            if (err) { setError(err.message); return { ok: false }; }
            
            // Si el registro es exitoso y no requiere confirmación, onAuthStateChange hará el resto.
            return { ok: true, needsConfirmation: data.session === null };
        } catch (err) {
            setError(err.message);
            return { ok: false };
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        await supabase.auth.signOut();
        setUsuario(null);
        setSession(null);
    }, []);

    const actualizarPerfil = useCallback(async (datos) => {
        if (!session?.user?.id) return { ok: false };
        const { error: err } = await supabase
            .from('usuarios')
            .update({ ...datos, updated_at: new Date().toISOString() })
            .eq('id', session.user.id);

        if (err) { setError(err.message); return { ok: false }; }
        
        // Actualizamos el estado local inmediatamente
        setUsuario(prev => ({ ...prev, ...datos }));
        return { ok: true };
    }, [session]);

    const getAccessToken = useCallback(() => session?.access_token ?? null, [session]);

    return (
        <AuthContext.Provider value={{
            usuario, session, loading, error, setError,
            login, loginConGoogle, register, logout, actualizarPerfil, getAccessToken
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuthContext debe usarse dentro de <AuthProvider>');
    return ctx;
}
