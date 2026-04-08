import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, Alert, CircularProgress, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { CATEGORIAS, CAMPOS_BASE } from '../../../hooks/useAvisos.js';

export default function PublicarModal({ open, onClose, onSubmit, guardando, errorGuardando }) {
    const [form, setForm] = useState({ categoria: 'Hacienda' });

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(form);
        setForm({ categoria: 'Hacienda' });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700 }}>
                Publicar aviso
                <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', right: 12, top: 12 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box component="form" id="form-publicar" onSubmit={handleSubmit}>
                    {errorGuardando && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            Error al publicar el aviso. Intenta de nuevo.
                        </Alert>
                    )}

                    <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                        <InputLabel id="pub-cat-label">Categoría *</InputLabel>
                        <Select
                            labelId="pub-cat-label"
                            name="categoria"
                            value={form.categoria ?? 'Hacienda'}
                            label="Categoría *"
                            onChange={handleChange}
                        >
                            {CATEGORIAS.filter(c => c !== 'Todos').map(c => (
                                <MenuItem key={c} value={c}>{c}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {CAMPOS_BASE.map(({ name, label, type, multiline, rows, required, placeholder }) => (
                        <TextField
                            key={name}
                            name={name}
                            label={label + (required ? ' *' : '')}
                            type={type ?? 'text'}
                            size="small"
                            multiline={!!multiline}
                            rows={rows}
                            placeholder={placeholder}
                            value={form[name] ?? ''}
                            onChange={handleChange}
                            required={!!required}
                            fullWidth
                            sx={{ mb: 2 }}
                        />
                    ))}
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} disabled={guardando}>Cancelar</Button>
                <Button
                    type="submit"
                    form="form-publicar"
                    variant="contained"
                    disabled={guardando}
                    startIcon={guardando ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
                >
                    {guardando ? 'Publicando…' : 'Publicar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}