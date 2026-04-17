// Contexto global de autenticación — provee el estado de sesión a toda la app.
// Llama a setApiSession() en cada cambio de sesión para que el interceptor
// de api.js tenga siempre el token actualizado de forma sincrónica.
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { setApiSession } from '../services/api.js';

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

        // ── Paso 1: Hidratación desde el caché local de Supabase ───────────────────
        // setLoading(false) se mueve al final del bloque (después de cargarPerfil)
        // para garantizar que usuario.rol sea correcto antes del primer render.
        supabase.auth.getSession().then(async ({ data: { session: s } }) => {
            if (!montado) return;
            setApiSession(s);   // sincroniza el interceptor de api.js
            setSession(s);
            if (s?.user) {
                setUsuario(mapearUsuario(s.user));
                const perfil = await cargarPerfil(s.user.id);
                if (montado && perfil) setUsuario(mapearUsuario(s.user, perfil));
            } else {
                setUsuario(null);
            }
            if (montado) setLoading(false); // siempre al final, rol ya correcto
        });

        // ── Paso 2: Listener para cambios futuros (login, logout, refresh) ────────
        // INITIAL_SESSION ya fue manejado por getSession(); lo ignoramos para
        // evitar doble procesamiento y posibles parpadeos de rol.
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, s) => {
            if (!montado) return;
            if (event === 'INITIAL_SESSION') return;

            setApiSession(s);   // mantiene el interceptor siempre actualizado
            setSession(s);
            if (s?.user) {
                setUsuario(mapearUsuario(s.user));
                const perfil = await cargarPerfil(s.user.id);
                if (montado && perfil) setUsuario(mapearUsuario(s.user, perfil));
            } else {
                setUsuario(null);
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
