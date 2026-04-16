// Componente de tarjeta para mostrar detalles de un producto/aviso

import {
    Card, CardContent, CardMedia, CardActions,
    Typography, Stack, Button, Chip, Box, Divider, Tooltip, IconButton
} from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import ScaleOutlinedIcon from '@mui/icons-material/ScaleOutlined';
import PetsIcon from '@mui/icons-material/Pets';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import GrainIcon from '@mui/icons-material/Grain';
import HandymanOutlinedIcon from '@mui/icons-material/HandymanOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

const CATEGORIA_CONFIG = {
    Hacienda: { icon: <PetsIcon fontSize="small" />, color: '#6A8E5E' },
    Maquinaria: { icon: <AgricultureIcon fontSize="small" />, color: '#A0785E' },
    Granos: { icon: <GrainIcon fontSize="small" />, color: '#C6A84B' },
    Servicios: { icon: <HandymanOutlinedIcon fontSize="small" />, color: '#5E7FA0' },
};

function DetallesCat({ aviso }) {
    const { categoria, peso, cantidad, tipo, marca, modelo, anio, horas, cultivo, humedad, servicio, disponibilidad } = aviso;

    const filas = [];

    if (categoria === 'Hacienda') {
        if (cantidad) filas.push(['Cantidad', cantidad]);
        if (peso) filas.push(['Peso prom.', peso]);
        if (tipo) filas.push(['Raza', tipo]);
    } else if (categoria === 'Maquinaria') {
        if (marca) filas.push(['Marca', marca]);
        if (modelo) filas.push(['Modelo', modelo]);
        if (anio) filas.push(['Año', anio]);
        if (horas) filas.push(['Horas', horas]);
    } else if (categoria === 'Granos') {
        if (cultivo) filas.push(['Cultivo', cultivo]);
        if (cantidad) filas.push(['Cantidad', cantidad]);
        if (humedad) filas.push(['Humedad', humedad]);
    } else if (categoria === 'Servicios') {
        if (servicio) filas.push(['Tipo', servicio]);
        if (disponibilidad) filas.push(['Disponib.', disponibilidad]);
    }

    if (filas.length === 0) return null;

    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mt: 1.5 }}>
            {filas.map(([label, val]) => (
                <Box key={label}>
                    <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        {label}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.9rem' }}>
                        {val}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
}

export default function ProductCard({ aviso }) {
    const cat = CATEGORIA_CONFIG[aviso.categoria] ?? CATEGORIA_CONFIG['Servicios'];
    const BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:3000';
    
    // Si la imagen es una ruta relativa que empieza con /uploads, le concatenamos la base URL
    const imageUrl = aviso.imagen?.startsWith('/uploads') 
        ? `${BASE_URL}${aviso.imagen}` 
        : aviso.imagen;

    return (
        <Card
            sx={{
                width: '100%',
                borderRadius: 4,
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 32px rgba(106,142,94,0.18)',
                },
            }}
        >
            {/* Imagen */}
            <Box sx={{ position: 'relative' }}>
                <CardMedia
                    component="img"
                    height="200"
                    image={imageUrl}
                    alt={aviso.titulo}
                    sx={{ objectFit: 'cover' }}
                />
                {/* Categoría */}
                <Chip
                    icon={cat.icon}
                    label={aviso.categoria}
                    size="small"
                    sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        backgroundColor: cat.color,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        '& .MuiChip-icon': { color: '#fff' },
                    }}
                />
                {/* Acciones */}
                <Box sx={{ position: 'absolute', top: 6, right: 6, display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Guardar">
                        <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: '#fff' } }}>
                            <FavoriteOutlinedIcon fontSize="small" sx={{ color: '#A0785E' }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Compartir">
                        <IconButton size="small" sx={{ bgcolor: 'rgba(255,255,255,0.85)', '&:hover': { bgcolor: '#fff' } }}>
                            <ShareOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Contenido */}
            <CardContent sx={{ flexGrow: 1, pb: 0 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 0.5, lineHeight: 1.3 }}>
                    {aviso.titulo}
                </Typography>

                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mb: 1 }}>
                    <LocationOnOutlinedIcon fontSize="small" sx={{ color: 'text.secondary' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {aviso.localidad}, {aviso.provincia}
                    </Typography>
                </Stack>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, display: '-webkit-box', overflow: 'hidden', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>
                    {aviso.descripcion}
                </Typography>

                <DetallesCat aviso={aviso} />
            </CardContent>

            <Divider sx={{ mx: 2, mt: 2, opacity: 0.5 }} />

            {/* Footer */}
            <CardActions sx={{ p: 2, pt: 1.5 }}>
                <Stack direction="row" sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700, lineHeight: 1 }}>
                            {aviso.precioTexto}
                        </Typography>
                        <Stack direction="row" spacing={0.4} alignItems="center" sx={{ mt: 0.5 }}>
                            <AccessTimeOutlinedIcon sx={{ fontSize: 12, color: 'text.secondary' }} />
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {aviso.publicadoHace}
                            </Typography>
                        </Stack>
                    </Box>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<MessageIcon />}
                        sx={{ borderRadius: 3, fontWeight: 600, px: 2 }}
                    >
                        Consultar
                    </Button>
                </Stack>
            </CardActions>
        </Card>
    );
}
