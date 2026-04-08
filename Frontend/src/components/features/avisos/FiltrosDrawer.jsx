import { Drawer, Stack, Typography, IconButton, Divider, FormControl, InputLabel, Select, MenuItem, TextField, Button } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import CloseIcon from '@mui/icons-material/Close';
import { PROVINCIAS } from '../../../hooks/useAvisos.js';

export default function FiltrosDrawer({ open, onClose, provincia, setProvincia, precioMin, setPrecioMin, precioMax, setPrecioMax, resetFiltros, hayFiltrosActivos }) {
    const isError = precioMin !== '' && precioMax !== '' && Number(precioMax) < Number(precioMin);
    const isMinNegative = precioMin !== '' && Number(precioMin) < 0;
    const isMaxNegative = precioMax !== '' && Number(precioMax) < 0;

    const handleApply = () => {
        if (!isError && !isMinNegative && !isMaxNegative) {
            onClose();
        }
    };

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: { xs: '90vw', sm: 340 }, p: 3, backgroundColor: 'background.paper' }
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <TuneIcon sx={{ color: 'primary.main' }} />
                    <Typography variant="h5">Filtros</Typography>
                </Stack>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel id="prov-label">Provincia</InputLabel>
                <Select
                    labelId="prov-label"
                    id="filtro-provincia"
                    value={provincia}
                    label="Provincia"
                    onChange={e => setProvincia(e.target.value)}
                >
                    {PROVINCIAS.map(p => (
                        <MenuItem key={p} value={p}>{p}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontWeight: 600 }}>
                Rango de precio
            </Typography>
            <Stack direction="column" spacing={2} sx={{ mb: 3 }}>
                <Stack direction="row" spacing={1.5}>
                    <TextField
                        id="filtro-precio-min"
                        label="Mínimo"
                        size="small"
                        type="number"
                        value={precioMin}
                        onChange={e => setPrecioMin(e.target.value)}
                        fullWidth
                        error={isMinNegative || isError}
                        slotProps={{ input: { min: 0 } }}
                    />
                    <TextField
                        id="filtro-precio-max"
                        label="Máximo"
                        size="small"
                        type="number"
                        value={precioMax}
                        onChange={e => setPrecioMax(e.target.value)}
                        fullWidth
                        error={isMaxNegative || isError}
                        slotProps={{ input: { min: 0 } }}
                    />
                </Stack>
                {(isError || isMinNegative || isMaxNegative) && (
                    <Typography variant="caption" color="error">
                        {isMinNegative || isMaxNegative
                            ? "Los precios no pueden ser negativos"
                            : "El máximo no puede ser menor que el mínimo"}
                    </Typography>
                )}
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Stack spacing={1.5}>
                <Button
                    id="btn-aplicar-filtros"
                    variant="contained"
                    fullWidth
                    onClick={handleApply}
                    disabled={isError || isMinNegative || isMaxNegative}
                    sx={{ borderRadius: 3 }}
                >
                    Aplicar filtros
                </Button>
                {hayFiltrosActivos && (
                    <Button
                        id="btn-reset-filtros"
                        variant="outlined"
                        fullWidth
                        onClick={() => { resetFiltros(); onClose(); }}
                        sx={{ borderRadius: 3 }}
                    >
                        Limpiar filtros
                    </Button>
                )}
            </Stack>
        </Drawer>
    );
}