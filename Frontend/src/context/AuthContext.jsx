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
    // Reintenta hasta 3 veces si no encuentra el perfil (por si el trigger tarda)
    const cargarPerfil = useCallback(async (userId, reintentos = 3) => {
        for (let i = 0; i < reintentos; i++) {
            const { data, error: err } = await supabase
                .from('usuarios')
                .select('*')
                .eq('id', userId)
                .single();

            if (!err && data) return data;
            
            // Si es un error de "no encontrado", esperamos un poco y reintentamos
            if (i < reintentos - 1) {
                await new Promise(res => setTimeout(res, 500 * (i + 1)));
            }
        }
        return null;
    }, []);

    // ── Suscripción única a cambios de sesión ─────────────────────────────
    useEffect(() => {
        let montado = true;

        // El listener se dispara inmediatamente al suscribirse con la sesión actual
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
            if (!montado) return;

            setSession(s);
            
            if (s?.user) {
                // Solo cargamos perfil si no lo tenemos o si cambió el usuario
                const perfil = await cargarPerfil(s.user.id);
                if (montado) {
                    setUsuario(perfil
                        ? { ...perfil, email: s.user.email }
                        : { id: s.user.id, email: s.user.email, nombre: s.user.email }
                    );
                    setLoading(false);
                }
            } else {
                if (montado) {
                    setUsuario(null);
                    setLoading(false);
                }
            }
        });

        return () => {
            montado = false;
            subscription.unsubscribe();
        };
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
                setLoading(false); // Solo apagamos loading si hay error
                return { ok: false };
            }
            // Si no hay error, NO apagamos loading aquí. 
            // Dejamos que onAuthStateChange detecte el login, cargue el perfil y apague el loading.
            return { ok: true };
        } catch {
            setError('Error de conexión. Intentá de nuevo.');
            setLoading(false);
            return { ok: false };
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
    // Mockea la búsqueda de DNI para simular integración con API de Renaper/Personas
    const buscarDni = async (dni) => {
        // Simulación de delay de API externa
        await new Promise(res => setTimeout(res, 800));
        
        // Mock de respuesta: si el DNI es '12345678', simulamos que no es válido
        if (dni === '12345678') throw new Error('DNI no encontrado en el Registro Nacional.');
        
        return { valido: true, origen: 'Mock API Renaper' };
    };

    const register = useCallback(async (email, password, nombre, apellido, dni, fechaNacimiento) => {
        setLoading(true);
        setError('');
        try {
            // Validar DNI antes de registrar (Mock)
            await buscarDni(dni);

            const { error: err } = await supabase.auth.signUp({
                email,
                password,
                options: { 
                    data: { 
                        nombre, 
                        apellido, 
                        dni, 
                        fecha_nacimiento: fechaNacimiento 
                    } 
                },
            });

            if (err) { setError(err.message); return { ok: false }; }
            return { ok: true, needsConfirmation: true };
        } catch (err) {
            setError(err.message || 'Error al registrar. Intentá de nuevo.');
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
