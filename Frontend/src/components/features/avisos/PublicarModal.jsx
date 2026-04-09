// Componente modal para publicar nuevos avisos

import { useState, useRef } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, 
    FormControl, InputLabel, Select, MenuItem, Box, Alert, CircularProgress, 
    IconButton, Typography, Paper, Stack
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { CATEGORIAS, CAMPOS_BASE } from '../../../hooks/useAvisos.js';

export default function PublicarModal({ open, onClose, onSubmit, guardando, errorGuardando }) {
    const [form, setForm] = useState({ categoria: 'Hacienda' });
    const [imagen, setImagen] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    
    const processFile = (file) => {
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert('Por favor, selecciona un archivo de imagen válido.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen es demasiado grande (máx 5MB)');
            return;
        }
        setImagen(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleFileChange = (e) => processFile(e.target.files[0]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        processFile(file);
    };

    const handleRemoveImage = () => {
        setImagen(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!imagen) {
            alert('La imagen es obligatoria');
            return;
        }

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                formData.append(key, value);
            }
        });
        formData.append('imagen', imagen);

        await onSubmit(formData);
        // Reset
        setForm({ categoria: 'Hacienda' });
        handleRemoveImage();
    };

    const campoTitulo = CAMPOS_BASE.find(c => c.name === 'titulo');
    const restoCampos = CAMPOS_BASE.filter(c => c.name !== 'titulo');

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

                    <Stack spacing={2.5}>
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

                        <TextField
                            name={campoTitulo.name}
                            label={campoTitulo.label + ' *'}
                            size="small"
                            value={form[campoTitulo.name] ?? ''}
                            onChange={handleChange}
                            required
                            fullWidth
                        />

                        {/* Input de Imagen Mejorado con Drag & Drop */}
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5, display: 'block' }}>
                                Imagen del aviso * (Máx 5MB)
                            </Typography>
                            
                            {!preview ? (
                                <Paper
                                    variant="outlined"
                                    onDragOver={handleDragOver}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                    sx={{
                                        p: 3,
                                        borderStyle: 'dashed',
                                        borderWidth: 2,
                                        borderColor: isDragging ? 'primary.main' : 'divider',
                                        bgcolor: isDragging ? 'action.hover' : 'background.paper',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer',
                                        '&:hover': { bgcolor: 'action.hover', borderColor: 'primary.main' }
                                    }}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <CloudUploadIcon sx={{ fontSize: 40, color: isDragging ? 'primary.main' : 'text.secondary', mb: 1 }} />
                                    <Typography variant="body2" color="text.secondary" textAlign="center">
                                        Arrastra una imagen aquí o haz clic para subir
                                    </Typography>
                                </Paper>
                            ) : (
                                <Box sx={{ position: 'relative', width: '100%', height: 180, borderRadius: 2, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
                                    <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    <IconButton 
                                        size="small" 
                                        onClick={handleRemoveImage}
                                        sx={{ 
                                            position: 'absolute', top: 8, right: 8, 
                                            bgcolor: 'rgba(255,255,255,0.9)', 
                                            '&:hover': { bgcolor: '#fff' },
                                            boxShadow: 1
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" color="error" />
                                    </IconButton>
                                </Box>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                ref={fileInputRef}
                                onChange={handleFileChange}
                            />
                        </Box>

                        {restoCampos.map(({ name, label, type, multiline, rows, required, placeholder }) => (
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
                    </Stack>
                </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2.5 }}>
                <Button onClick={onClose} disabled={guardando}>Cancelar</Button>
                <Button
                    type="submit"
                    form="form-publicar"
                    variant="contained"
                    disabled={guardando}
                    startIcon={guardando ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    {guardando ? 'Publicando…' : 'Publicar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
