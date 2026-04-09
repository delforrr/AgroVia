// Barra de navegación superior — muestra título de la sección, notificaciones,
// toggle de tema y el avatar del usuario autenticado (o acceso al login).

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    AppBar, Box, Toolbar, Typography, Autocomplete, TextField,
    InputAdornment, IconButton, Tooltip, Badge, Avatar,
} from '@mui/material';
import SearchIcon       from '@mui/icons-material/Search';
import DarkModeRoundedIcon  from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useThemeMode }      from '../../context/ThemeContext.jsx';
import { useAuth }           from '../../hooks/useAuth.js';
import NotificationsDrawer   from '../common/NotificationsDrawer.jsx';

// Notificaciones de ejemplo (hasta que el backend las implemente)
const MOCK_NOTIFICATIONS = [
    { title: 'Nueva oferta',          message: 'Has recibido una oferta por "Lote Hacienda 1"',        time: 'Hace 5 min'  },
    { title: 'Operación confirmada',  message: 'Se ha confirmado la documentación del tractor',         time: 'Hace 2 horas' },
    { title: 'Recordatorio',          message: 'No olvides completar tu perfil',                        time: 'Ayer'         },
];

function ResponsiveAppBar({ title, hasSearch = false }) {
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const { mode, toggleTheme } = useThemeMode();
    const { usuario }           = useAuth();
    const navigate              = useNavigate();

    const options = ['Hacienda', 'Maquinaria', 'Servicios'];

    // Iniciales del avatar: muestra las primeras letras de nombre y apellido
    const iniciales = usuario
        ? `${(usuario.nombre?.[0] ?? '')}${(usuario.apellido?.[0] ?? '')}`.toUpperCase() || '?'
        : null;

    return (
        <Box>
            <AppBar
                position="static"
                sx={{
                    boxShadow: 'none',
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.default',
                    color: 'text.secondary',
                }}
            >
                <Toolbar>
                    {/* Título de la sección */}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1, fontWeight: 700, color: 'primary.main' }}
                    >
                        {title}
                    </Typography>

                    {/* Buscador (opcional por sección) */}
                    {hasSearch && (
                        <Autocomplete
                            freeSolo
                            size="small"
                            options={options}
                            sx={{
                                width: { xs: 150, md: 250 },
                                mx: 2,
                                bgcolor: 'background.paper',
                                '& .MuiOutlinedInput-root': { borderRadius: '20px' },
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Buscar..."
                                    slotProps={{
                                        input: {
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <SearchIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                            type: 'search',
                                        },
                                    }}
                                />
                            )}
                        />
                    )}

                    {/* Notificaciones */}
                    <Tooltip title="Notificaciones">
                        <IconButton
                            id="btn-notificaciones"
                            onClick={() => setNotificationsOpen(true)}
                            color="inherit"
                            size="medium"
                            sx={{ mx: 0.5, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.1)' } }}
                        >
                            <Badge badgeContent={MOCK_NOTIFICATIONS.length} color="error">
                                <NotificationsIcon sx={{ fontSize: 22 }} />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    {/* Toggle de tema */}
                    <Tooltip title={mode === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
                        <IconButton
                            id="btn-toggle-tema"
                            onClick={toggleTheme}
                            color="inherit"
                            size="medium"
                            sx={{ mx: 0.5, transition: 'transform 0.3s', '&:hover': { transform: 'rotate(20deg)' } }}
                        >
                            {mode === 'dark'
                                ? <LightModeRoundedIcon sx={{ fontSize: 22 }} />
                                : <DarkModeRoundedIcon  sx={{ fontSize: 22 }} />
                            }
                        </IconButton>
                    </Tooltip>

                    {/* Avatar de usuario / acceso a perfil */}
                    <Tooltip title={usuario ? `${usuario.nombre ?? 'Mi perfil'}` : 'Iniciar sesión'}>
                        <IconButton
                            id="btn-perfil-navbar"
                            onClick={() => navigate('/perfil')}
                            size="small"
                            sx={{ ml: 0.5 }}
                        >
                            {usuario ? (
                                <Avatar
                                    src={usuario.avatar_url ?? undefined}
                                    sx={{
                                        width: 34,
                                        height: 34,
                                        bgcolor: 'primary.main',
                                        fontSize: '0.85rem',
                                        fontWeight: 700,
                                        border: '2px solid',
                                        borderColor: 'primary.light',
                                    }}
                                >
                                    {iniciales}
                                </Avatar>
                            ) : (
                                <AccountCircleIcon sx={{ fontSize: 30 }} />
                            )}
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>

            <NotificationsDrawer
                open={notificationsOpen}
                onClose={() => setNotificationsOpen(false)}
                notifications={MOCK_NOTIFICATIONS}
            />
        </Box>
    );
}

export default ResponsiveAppBar;
