import { useState, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, Box, Alert, CircularProgress, IconButton, Typography, Stack, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { CATEGORIAS, CAMPOS_BASE, PROVINCIAS } from '../../../hooks/useAvisos.js';

const MONEDAS = ['ARS', 'USD'];

export default function PublicarModal({ open, onClose, onSubmit, guardando, errorGuardando }) {
    const [form, setForm] = useState({ categoria: 'Hacienda', moneda: 'ARS' });
    const [dragging, setDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

    const handleFile = (file) => {
        if (!file || !file.type.startsWith('image/')) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setForm(prev => ({ ...prev, imagen: reader.result }));
        };
        reader.readAsDataURL(file);
    };

    const handleFileChange = (e) => handleFile(e.target.files[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setDragging(true);
    };

    const handleDragLeave = () => setDragging(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await onSubmit(form);
        setForm({ categoria: 'Hacienda', moneda: 'ARS' });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth scroll="paper">
            <DialogTitle sx={{ fontWeight: 700 }}>
                Publicar aviso
                <IconButton onClick={onClose} size="small" sx={{ position: 'absolute', right: 12, top: 12 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box component="form" id="form-publicar" onSubmit={handleSubmit} sx={{ py: 1 }}>
                    {errorGuardando && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            Error al publicar el aviso. Intenta de nuevo.
                        </Alert>
                    )}

                    <Stack spacing={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel id="pub-cat-label">Categoría *</InputLabel>
                            <Select
                                labelId="pub-cat-label"
                                name="categoria"
                                value={form.categoria ?? 'Hacienda'}
                                label="Categoría *"
                                onChange={handleChange}
                                required
                            >
                                {CATEGORIAS.filter(c => c !== 'Todos').map(c => (
                                    <MenuItem key={c} value={c}>{c}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* Imagen del aviso */}
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                                Imagen del aviso
                            </Typography>
                            
                            {form.imagen ? (
                                <Paper variant="outlined" sx={{ position: 'relative', overflow: 'hidden', mb: 1 }}>
                                    <Box
                                        component="img"
                                        src={form.imagen}
                                        alt="Vista previa"
                                        sx={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block' }}
                                    />
                                    <IconButton
                                        onClick={() => setForm(prev => ({ ...prev, imagen: '' }))}
                                        sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(255,255,255,0.8)', '&:hover': { bgcolor: '#fff' } }}
                                        size="small"
                                    >
                                        <DeleteIcon fontSize="small" color="error" />
                                    </IconButton>
                                </Paper>
                            ) : (
                                <Paper
                                    variant="outlined"
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    onClick={() => fileInputRef.current?.click()}
                                    sx={{
                                        p: 3,
                                        textAlign: 'center',
                                        cursor: 'pointer',
                                        borderStyle: 'dashed',
                                        bgcolor: dragging ? 'action.hover' : 'background.paper',
                                        borderColor: dragging ? 'primary.main' : 'divider',
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' },
                                        mb: 1
                                    }}
                                >
                                    <input
                                        type="file"
                                        hidden
                                        ref={fileInputRef}
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <CloudUploadIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Arrastra una imagen aquí o haz clic para subir
                                    </Typography>
                                </Paper>
                            )}
                            
                            <TextField
                                name="imagen"
                                label="O pega el link de la imagen"
                                size="small"
                                fullWidth
                                value={form.imagen?.startsWith('data:') ? '' : (form.imagen ?? '')}
                                onChange={handleChange}
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                        </Box>

                        {/* Campos dinámicos */}
                        {CAMPOS_BASE.filter(f => f.name !== 'moneda' && f.name !== 'provincia').map(({ name, label, type, multiline, rows, required, placeholder }) => (
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
                            />
                        ))}

                        <Stack direction="row" spacing={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel id="pub-mon-label">Moneda</InputLabel>
                                <Select
                                    labelId="pub-mon-label"
                                    name="moneda"
                                    value={form.moneda ?? 'ARS'}
                                    label="Moneda"
                                    onChange={handleChange}
                                >
                                    {MONEDAS.map(m => (
                                        <MenuItem key={m} value={m}>{m}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl fullWidth size="small">
                                <InputLabel id="pub-prov-label">Provincia *</InputLabel>
                                <Select
                                    labelId="pub-prov-label"
                                    name="provincia"
                                    value={form.provincia ?? ''}
                                    label="Provincia *"
                                    onChange={handleChange}
                                    required
                                >
                                    {PROVINCIAS.filter(p => p !== 'Todas').map(p => (
                                        <MenuItem key={p} value={p}>{p}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </Stack>
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