// Barra de navegación inferior para dispositivos móviles

import { Link, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';
import StorefrontIcon from '@mui/icons-material/Storefront';


export default function BottonNav() {
    const location = useLocation();

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={4}>
            <BottomNavigation
                showLabels
                value={location.pathname}
                sx={{
                    '& .MuiBottomNavigationAction-root': {
                        borderBottom: '3px solid transparent',
                        color: 'primary.muted',
                        '&.Mui-selected': {
                            color: 'primary.main',
                            borderBottom: '3px solid #6A8E5E',
                            backgroundColor: 'action.selected',
                        },
                        '&:hover': {
                            color: 'primary.main',
                            backgroundColor: 'action.selected',
                        },
                    },
                }}
            >
                <BottomNavigationAction label="Inicio" icon={<HomeIcon />} component={Link} to="/" value="/" />
                <BottomNavigationAction label="Avisos" icon={<StorefrontIcon />} component={Link} to="/avisos" value="/avisos" />
                <BottomNavigationAction label="Operaciones" icon={<BusinessIcon />} component={Link} to="/operaciones" value="/operaciones" />
                <BottomNavigationAction label="Mercado" icon={<TrendingUpIcon />} component={Link} to="/mercado" value="/mercado" />
                <BottomNavigationAction label="Perfil" icon={<PersonIcon />} component={Link} to="/perfil" value="/perfil" />
            </BottomNavigation>
        </Paper>
    )
}