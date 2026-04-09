// Hook personalizado para manejar operaciones

import { useState, useEffect, useCallback } from 'react';
import { getOperaciones, toggleDocumento } from '../services/operacionesService.js';

/**
 * useOperaciones — hook para gestionar operaciones de negociación
 * Retorna: { operaciones, loading, error, refetch, toggleDoc }
 */
export function useOperaciones() {
    const [operaciones, setOperaciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getOperaciones();
            setOperaciones(data);
        } catch (err) {
            setError(err?.message ?? 'Error al cargar operaciones');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const toggleDoc = useCallback(async (opId, docId) => {
        try {
            const updated = await toggleDocumento(opId, docId);
            setOperaciones((prev) =>
                prev.map((op) => (op.id === updated.id ? { ...updated } : op))
            );
        } catch (err) {
            console.error('Error al actualizar documento:', err);
        }
    }, []);

    return { operaciones, loading, error, refetch: fetchData, toggleDoc };
}
