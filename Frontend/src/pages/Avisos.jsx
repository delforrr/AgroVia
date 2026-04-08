import { useState } from 'react';
import {
    Box, Typography, Stack, TextField, InputAdornment,
    Chip, Select, MenuItem, FormControl, InputLabel, Button, IconButton, Badge,
    Tooltip, Fade
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

import Navbar from '../components/layout/Navbar.jsx';
import ProductCard from '../components/features/avisos/ProductCard.jsx';
import FiltrosDrawer from '../components/features/avisos/FiltrosDrawer.jsx';
import PublicarModal from '../components/features/avisos/PublicarModal.jsx';
import { useAvisos, CATEGORIAS, ORDEN_OPTIONS } from '../hooks/useAvisos.js';
import { useAuth } from '../hooks/useAuth.js';

function EmptyState({ onReset }) {
    return (
        <Box sx={{ textAlign: 'center', py: 10, px: 3 }}>
            <Typography variant="h4" sx={{ mb: 1, fontSize: '3rem' }}>🌾</Typography>
            <Typography variant="h5" sx={{ mb: 1 }}>Sin resultados</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                No encontramos avisos que coincidan con tu búsqueda.
            </Typography>
            <Button id="btn-limpiar-busqueda" variant="outlined" onClick={onReset} sx={{ borderRadius: 3 }}>
                Limpiar filtros
            </Button>
        </Box>
    );
}

export default function AvisosPage() {
    const { usuario } = useAuth();
    const isAdmin = usuario?.rol === 'admin';

    const {
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
        agregarAviso,
        eliminarAviso,
    } = useAvisos();

    const [modalPublicar, setModalPublicar] = useState(false);
    const [guardando, setGuardando] = useState(false);
    const [errorGuardando, setErrorGuardando] = useState(false);

    const handlePublicar = async (datos) => {
        try {
            setGuardando(true);
            setErrorGuardando(false);
            await agregarAviso(datos);
            setModalPublicar(false);
        } catch {
            setErrorGuardando(true);
        } finally {
            setGuardando(false);
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Eliminar este aviso?')) return;
        await eliminarAviso(id);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: 'background.default' }}>
            <Navbar title="Avisos" />

            {/* Barra de búsqueda y acciones */}
            <Box
                component="section"
                aria-label="Búsqueda y filtros"
                sx={{
                    px: { xs: 2, md: 3 },
                    py: 2,
                    backgroundColor: 'background.paper',
                    borderBottom: '1px solid rgba(0,0,0,0.07)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                }}
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    alignItems={{ xs: 'stretch', sm: 'center' }}
                >
                    <TextField
                        id="busqueda-avisos"
                        placeholder="Buscar por título, descripción o localidad…"
                        size="small"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        sx={{
                            flexGrow: 1,
                            '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                        }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: busqueda ? (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setBusqueda('')}>
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null,
                            }
                        }}
                    />

                    <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel id="orden-label">
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <SortIcon fontSize="small" />
                                <span>Ordenar</span>
                            </Stack>
                        </InputLabel>
                        <Select
                            labelId="orden-label"
                            id="selector-orden"
                            value={orden}
                            label="Ordenar"
                            onChange={e => setOrden(e.target.value)}
                            sx={{ borderRadius: '20px' }}
                        >
                            {ORDEN_OPTIONS.map(o => (
                                <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Tooltip title="Filtros avanzados">
                        <Badge color="error" variant="dot" invisible={!hayFiltrosActivos}>
                            <Button
                                id="btn-abrir-filtros"
                                variant="outlined"
                                startIcon={<FilterListIcon />}
                                onClick={() => setDrawerFiltros(true)}
                                sx={{ borderRadius: '20px', whiteSpace: 'nowrap' }}
                            >
                                Filtros
                            </Button>
                        </Badge>
                    </Tooltip>

                    <Button
                        id="btn-publicar-aviso"
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setModalPublicar(true)}
                        sx={{ borderRadius: '20px', whiteSpace: 'nowrap', fontWeight: 600 }}
                    >
                        Publicar aviso
                    </Button>
                </Stack>
            </Box>

            {/* Chips de categorías */}
            <Box
                component="nav"
                aria-label="Filtro por categoría"
                sx={{
                    px: { xs: 2, md: 3 },
                    py: 1.5,
                    display: 'flex',
                    gap: 1,
                    flexWrap: 'wrap',
                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                    backgroundColor: 'background.paper',
                }}
            >
                {CATEGORIAS.map(cat => (
                    <Chip
                        key={cat}
                        id={`chip-cat-${cat.toLowerCase()}`}
                        label={cat}
                        clickable
                        onClick={() => setCategoria(cat)}
                        sx={{
                            fontWeight: categoria === cat ? 700 : 500,
                            backgroundColor: categoria === cat ? 'primary.main' : 'transparent',
                            color: categoria === cat ? '#fff' : 'text.secondary',
                            border: categoria === cat ? 'none' : '1px solid rgba(0,0,0,0.12)',
                            transition: 'all 0.2s',
                            '&:hover': {
                                backgroundColor: categoria === cat ? 'primary.dark' : 'action.hover',
                            },
                        }}
                    />
                ))}
                <Typography variant="body2" sx={{ color: 'text.secondary', ml: 'auto', alignSelf: 'center' }}>
                    {avisosFiltrados.length} {avisosFiltrados.length === 1 ? 'aviso' : 'avisos'}
                </Typography>
            </Box>

            {/* Lista de avisos */}
            <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 } }}>
                {avisosFiltrados.length === 0 ? (
                    <EmptyState onReset={resetFiltros} />
                ) : (
                    <Fade in>
                        <Box
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: {
                                    xs: '1fr',
                                    sm: 'repeat(2, 1fr)',
                                    lg: 'repeat(3, 1fr)',
                                    xl: 'repeat(4, 1fr)',
                                },
                                gap: 3,
                            }}
                        >
                            {avisosFiltrados.map(aviso => (
                                <Box key={aviso.id} sx={{ position: 'relative' }}>
                                    <ProductCard aviso={aviso} />
                                    {isAdmin && (
                                        <Tooltip title="Eliminar aviso">
                                            <IconButton
                                                id={`btn-eliminar-${aviso.id}`}
                                                size="small"
                                                onClick={() => handleEliminar(aviso.id)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    backgroundColor: 'rgba(0,0,0,0.45)',
                                                    color: '#fff',
                                                    '&:hover': { backgroundColor: 'error.main' },
                                                }}
                                            >
                                                <DeleteOutlineIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </Fade>
                )}
            </Box>

            {/* Modal Publicar */}
            <PublicarModal
                open={modalPublicar}
                onClose={() => setModalPublicar(false)}
                onSubmit={handlePublicar}
                guardando={guardando}
                errorGuardando={errorGuardando}
            />

            {/* Drawer Filtros */}
            <FiltrosDrawer
                open={drawerFiltros}
                onClose={() => setDrawerFiltros(false)}
                provincia={provincia}
                setProvincia={setProvincia}
                precioMin={precioMin}
                setPrecioMin={setPrecioMin}
                precioMax={precioMax}
                setPrecioMax={setPrecioMax}
                resetFiltros={resetFiltros}
                hayFiltrosActivos={hayFiltrosActivos}
            />
        </Box>
    );
}