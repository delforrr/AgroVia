import { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, Box, useTheme, useMediaQuery, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';
import { Leaf } from "@boxicons/react"
import BottomNav from './BottomNav';

const drawerWidth = 100;

function AppDrawer() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    if (isMobile) {
        return (
            <BottomNav/>
        );
    }

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: 'background.sidebar',
                    boxShadow: '0px 5px 15px #00000059',
                    overflow: 'hidden',
                },
            }}
            variant="permanent"
            anchor="left"
        >

            <List
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    '& .MuiListItem-root, & .MuiListItemButton-root': {
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        width: '100%',
                        '&.Mui-selected': {
                            backgroundColor: 'action.selected',
                            borderLeft: '4px solid #6A8E5E',
                            '&:hover': {
                                backgroundColor: 'action.selected',
                            },
                            '& .MuiListItemIcon-root, & .MuiListItemText-root': {
                                color: 'primary.main',
                            },
                        },
                    },
                    '& .MuiListItemIcon-root': {
                        minWidth: 0,
                        mb: 0.5,
                        color: 'primary.muted',
                    },
                    '& .MuiListItemText-root': {
                        m: 0,
                        color: 'primary.muted',
                    },
                }}
            >
                <ListItem>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <Leaf fill="#6A8E5E" width={50} height={50}/>
                        <Typography sx={{
                            fontWeight: 'bold',
                            color: 'primary.main',
                            mt: 0.5,
                            fontSize: 18,
                        }}>
                            AgroVía
                        </Typography>
                    </Box>
                </ListItem>

                <Divider />

                <ListItem disablePadding>
                    <ListItemButton
                        selected={selectedIndex === 0}
                        onClick={(event) => handleListItemClick(event, 0)}
                    >
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant='body2'>Inicio</Typography>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        selected={selectedIndex === 1}
                        onClick={(event) => handleListItemClick(event, 1)}
                    >
                        <ListItemIcon>
                            <BusinessIcon />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant='body2'>Operaciones</Typography>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        selected={selectedIndex === 2}
                        onClick={(event) => handleListItemClick(event, 2)}
                    >
                        <ListItemIcon>
                            <TrendingUpIcon />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant='body2'>Mercado</Typography>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton
                        selected={selectedIndex === 3}
                        onClick={(event) => handleListItemClick(event, 3)}
                    >
                        <ListItemIcon>
                            <PersonIcon />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant='body2'>Perfil</Typography>
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
            </List>
        </Drawer>
    )
}

export default AppDrawer;