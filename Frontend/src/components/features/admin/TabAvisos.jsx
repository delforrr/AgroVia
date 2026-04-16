// Tab de gestión de avisos del panel admin.

import { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Stack, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, CircularProgress, Alert, IconButton, Tooltip, Select, MenuItem, FormControl,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import api from '../../../services/api.js';
import ConfirmDialog from './ConfirmDialog.jsx';
import { ESTADO_AVISO_CONFIG } from '../../../constants/colores.js';

export default function TabAvisos() {
    const [avisos, setAvisos]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState('');
    const [confirm, setConfirm] = useState(null); // { id, titulo }

    const cargar = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/avisos');
            setAvisos(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar avisos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    const cambiarEstado = async (id, estado) => {
        try {
            await api.put(`/admin/avisos/${id}/estado`, { estado });
            setAvisos((prev) => prev.map((a) => a.id === id ? { ...a, estado } : a));
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cambiar estado.');
        }
    };

    const eliminar = async () => {
        if (!confirm) return;
        try {
            await api.delete(`/admin/avisos/${confirm.id}`);
            setAvisos((prev) => prev.filter((a) => a.id !== confirm.id));
        } catch (err) {
            setError(err.response?.data?.error || 'Error al eliminar aviso.');
        } finally {
            setConfirm(null);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
        </Box>
    );

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: '1px solid', borderColor: 'divider' }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ '& th': { fontWeight: 700, color: 'text.secondary', fontSize: '0.78rem' } }}>
                            <TableCell>Título</TableCell>
                            <TableCell>Categoría</TableCell>
                            <TableCell>Vendedor</TableCell>
                            <TableCell>Provincia</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(avisos || []).map((a) => {
                            const estadoCfg = ESTADO_AVISO_CONFIG[a.estado] ?? { label: a.estado, color: 'default' };
                            return (
                                <TableRow key={a.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>{a.titulo}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={a.categoria} size="small" variant="outlined" sx={{ fontSize: '0.7rem' }} />
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="caption" color="text.secondary">
                                            {a.vendedor_nombre ?? ''} {a.vendedor_apellido ?? ''}
                                        </Typography>
                                        <br />
                                        <Typography variant="caption" color="text.secondary">{a.vendedor_email}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" color="text.secondary">{a.provincia ?? '—'}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
                                            <Select
                                                value={a.estado ?? 'activo'}
                                                onChange={(e) => cambiarEstado(a.id, e.target.value)}
                                                sx={{ fontSize: '0.8rem' }}
                                            >
                                                {Object.entries(ESTADO_AVISO_CONFIG).map(([val, cfg]) => (
                                                    <MenuItem key={val} value={val}>{cfg.label}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Eliminar aviso permanentemente">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => setConfirm({ id: a.id, titulo: a.titulo })}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>

            <ConfirmDialog
                open={!!confirm}
                onClose={() => setConfirm(null)}
                onConfirm={eliminar}
                title="Eliminar aviso"
                message={`¿Estás seguro que querés eliminar permanentemente "${confirm?.titulo}"? Esta acción no se puede deshacer.`}
                confirmLabel="Eliminar"
                confirmColor="error"
            />
        </Box>
    );
}
