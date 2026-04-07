import { useState, useEffect, useCallback } from 'react';
import { getCotizaciones } from '../services/cotizacionesService.js';

/**
 * useCotizaciones — hook para gestionar cotizaciones de mercado
 * Retorna: { data, loading, error, refetch, lastUpdated }
 */
export function useCotizaciones() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await getCotizaciones();
            setData(result);
            setLastUpdated(new Date());
        } catch (err) {
            setError(err?.message ?? 'Error al obtener cotizaciones');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData, lastUpdated };
}
