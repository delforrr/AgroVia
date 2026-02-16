import { useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';


export default function BottonNav() {
    const [selectedIndex, setSelectedIndex] = useState(0);

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1100 }} elevation={4}>
            <BottomNavigation
                showLabels
                value={selectedIndex}
                onChange={(event, newValue) => {
                    setSelectedIndex(newValue);
                }}
                sx={{
                    '& .MuiBottomNavigationAction-root': {
                        borderBottom: '3px solid transparent',
                    },
                    '& .Mui-selected': {
                        borderColor: 'primary.main',
                    }
                }}
            >
                <BottomNavigationAction label="Inicio" icon={<HomeIcon />} />
                <BottomNavigationAction label="Operaciones" icon={<BusinessIcon />} />
                <BottomNavigationAction label="Mercado" icon={<TrendingUpIcon />} />
                <BottomNavigationAction label="Perfil" icon={<PersonIcon />} />
            </BottomNavigation>
        </Paper>
    )
}