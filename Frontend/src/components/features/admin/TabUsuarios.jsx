// Tab de gestión de usuarios — tabla con cambio de rol y suspensión de cuentas.

import { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Stack, Avatar, Chip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Paper, CircularProgress, Alert, IconButton, Tooltip, Select, MenuItem, FormControl,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

import api from '../../../services/api.js';
import ConfirmDialog from './ConfirmDialog.jsx';

/**
 * @param {Function} getToken - Función que retorna el access token actual
 */
export default function TabUsuarios({ getToken }) {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState('');
    const [confirm, setConfirm]   = useState(null); // { id, suspendido, label }

    const cargar = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/usuarios');
            setUsuarios(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cargar usuarios.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { cargar(); }, [cargar]);

    const cambiarRol = async (id, nuevoRol) => {
        try {
            await api.put(`/admin/usuarios/${id}/rol`, { rol: nuevoRol });
            setUsuarios((prev) => prev.map((u) => u.id === id ? { ...u, rol: nuevoRol } : u));
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cambiar rol.');
        }
    };

    const toggleSuspendido = async (id, suspendido) => {
        try {
            await api.put(`/admin/usuarios/${id}/estado`, { suspendido });
            setUsuarios((prev) => prev.map((u) => u.id === id ? { ...u, suspendido } : u));
        } catch (err) {
            setError(err.response?.data?.error || 'Error al cambiar estado.');
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
                            <TableCell>Usuario</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Provincia</TableCell>
                            <TableCell>Rol</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell align="center">Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(usuarios || []).map((u) => (
                            <TableRow
                                key={u.id}
                                sx={{ opacity: u.suspendido ? 0.5 : 1, '&:hover': { bgcolor: 'action.hover' } }}
                            >
                                <TableCell>
                                    <Stack direction="row" spacing={1.5} alignItems="center">
                                        <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: 'primary.main' }}>
                                            {u.nombre?.[0]?.toUpperCase() ?? <PersonIcon fontSize="small" />}
                                        </Avatar>
                                        <Typography variant="body2" fontWeight={600}>
                                            {u.nombre ?? ''} {u.apellido ?? ''}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">{u.email}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2" color="text.secondary">{u.provincia ?? '—'}</Typography>
                                </TableCell>
                                <TableCell>
                                    <FormControl size="small" variant="outlined" sx={{ minWidth: 110 }}>
                                        <Select
                                            value={u.rol ?? 'usuario'}
                                            onChange={(e) => cambiarRol(u.id, e.target.value)}
                                            sx={{ fontSize: '0.8rem' }}
                                        >
                                            <MenuItem value="usuario">Usuario</MenuItem>
                                            <MenuItem value="admin">Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={u.suspendido ? 'Suspendido' : 'Activo'}
                                        size="small"
                                        color={u.suspendido ? 'error' : 'success'}
                                        variant="outlined"
                                        sx={{ fontWeight: 600, fontSize: '0.7rem' }}
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title={u.suspendido ? 'Reactivar cuenta' : 'Suspender cuenta'}>
                                        <IconButton
                                            size="small"
                                            color={u.suspendido ? 'success' : 'error'}
                                            onClick={() => setConfirm({
                                                id: u.id,
                                                suspendido: !u.suspendido,
                                                label: u.suspendido
                                                    ? `¿Reactivar la cuenta de ${u.nombre}?`
                                                    : `¿Suspender la cuenta de ${u.nombre}?`,
                                            })}
                                        >
                                            {u.suspendido
                                                ? <CheckCircleOutlineIcon fontSize="small" />
                                                : <BlockIcon fontSize="small" />
                                            }
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <ConfirmDialog
                open={!!confirm}
                onClose={() => setConfirm(null)}
                onConfirm={() => toggleSuspendido(confirm.id, confirm.suspendido)}
                title="Confirmar acción"
                message={confirm?.label}
                confirmLabel="Confirmar"
                confirmColor={confirm?.suspendido ? 'error' : 'success'}
            />
        </Box>
    );
}
