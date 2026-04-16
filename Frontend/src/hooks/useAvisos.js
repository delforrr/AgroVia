// Hook personalizado para manejar avisos

import { useState, useMemo, useEffect } from 'react';
import { getAvisos, postAviso, putAviso, deleteAviso } from '../services/api.js';

export const CATEGORIAS = ['Todos', 'Hacienda', 'Maquinaria', 'Granos', 'Servicios'];
export const PROVINCIAS = ['Todas', 'Buenos Aires', 'Córdoba', 'Santa Fe', 'Entre Ríos', 'La Pampa', 'Mendoza'];
export const ORDEN_OPTIONS = [
    { label: 'Más recientes', value: 'reciente' },
    { label: 'Menor precio', value: 'precio_asc' },
    { label: 'Mayor precio', value: 'precio_desc' },
];
export const CAMPOS_BASE = [
    { name: 'titulo', label: 'Título', required: true },
    { name: 'descripcion', label: 'Descripción', multiline: true, rows: 3, required: true },
    { name: 'precio', label: 'Precio', type: 'number' },
    { name: 'moneda', label: 'Moneda', placeholder: 'ARS / USD' },
    { name: 'provincia', label: 'Provincia', required: true },
    { name: 'localidad', label: 'Localidad', required: true },
];

export function useAvisos() {
    const [avisos, setAvisos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const [busqueda, setBusqueda] = useState('');
    const [categoria, setCategoria] = useState('Todos');
    const [provincia, setProvincia] = useState('Todas');
    const [orden, setOrden] = useState('reciente');
    const [precioMin, setPrecioMin] = useState('');
    const [precioMax, setPrecioMax] = useState('');
    const [drawerFiltros, setDrawerFiltros] = useState(false);

    useEffect(() => {
        const fetchAvisos = async () => {
            try {
                setCargando(true);
                const data = await getAvisos();
                setAvisos(data);
            } catch (err) {
                console.error("Error al cargar avisos:", err);
                setError(err);
            } finally {
                setCargando(false);
            }
        };
        fetchAvisos();
    }, []);

    const avisosFiltrados = useMemo(() => {
        let lista = [...avisos];

        // Filtro por texto
        if (busqueda.trim()) {
            const q = busqueda.toLowerCase();
            lista = lista.filter(a =>
                a.titulo?.toLowerCase().includes(q) ||
                a.descripcion?.toLowerCase().includes(q) ||
                a.localidad?.toLowerCase().includes(q)
            );
        }

        // Filtro por categoría
        if (categoria !== 'Todos') {
            lista = lista.filter(a => a.categoria === categoria);
        }

        // Filtro por provincia
        if (provincia !== 'Todas') {
            lista = lista.filter(a => a.provincia === provincia);
        }

        // Filtro por precio mínimo
        if (precioMin !== '' && !isNaN(Number(precioMin))) {
            lista = lista.filter(a => a.precio !== null && a.precio >= Number(precioMin));
        }

        // Filtro por precio máximo
        if (precioMax !== '' && !isNaN(Number(precioMax))) {
            lista = lista.filter(a => a.precio !== null && a.precio <= Number(precioMax));
        }

        // Orden
        if (orden === 'precio_asc') lista.sort((a, b) => (a.precio ?? Infinity) - (b.precio ?? Infinity));
        if (orden === 'precio_desc') lista.sort((a, b) => (b.precio ?? -Infinity) - (a.precio ?? -Infinity));

        return lista;
    }, [avisos, busqueda, categoria, provincia, orden, precioMin, precioMax]);

    const resetFiltros = () => {
        setBusqueda('');
        setCategoria('Todos');
        setProvincia('Todas');
        setOrden('reciente');
        setPrecioMin('');
        setPrecioMax('');
    };

    const hayFiltrosActivos =
        busqueda !== '' ||
        categoria !== 'Todos' ||
        provincia !== 'Todas' ||
        precioMin !== '' ||
        precioMax !== '';

    const agregarAviso = async (datos) => {
        const nuevo = await postAviso(datos);
        setAvisos(prev => [nuevo, ...prev]);
        return nuevo;
    };

    const editarAviso = async (id, datos) => {
        const actualizado = await putAviso(id, datos);
        setAvisos(prev => prev.map(a => a.id === id ? actualizado : a));
        return actualizado;
    };

    const eliminarAviso = async (id) => {
        await deleteAviso(id);
        setAvisos(prev => prev.filter(a => a.id !== id));
    };

    return {
        busqueda, setBusqueda,
        categoria, setCategoria,
        provincia, setProvincia,
        orden, setOrden,
        precioMin, setPrecioMin,
        precioMax, setPrecioMax,
        drawerFiltros, setDrawerFiltros,
        avisosFiltrados,
        resetFiltros,
        hayFiltrosActivos,
        cargando,
        error,
        agregarAviso,
        editarAviso,
        eliminarAviso,
    };
}
