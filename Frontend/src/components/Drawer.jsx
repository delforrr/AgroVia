import { useState } from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';
import { LeafIcon } from "@phosphor-icons/react"

const drawerWidth = 100;

function AppDrawer() {
    const [selectedIndex, setSelectedIndex] = useState(1);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    backgroundColor: 'var(--color-bg-sidebar)',
                    borderRight: '1px solid rgba(0, 0, 0, 0.08)',
                },
            }}
            variant="permanent"
            anchor="left"
        >

            <List
                sx={{
                    p: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    '& .MuiListItem-root, & .MuiListItemButton-root': {
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        borderRadius: 2,
                        '&.Mui-selected': {
                            backgroundColor: 'rgba(106, 142, 94, 0.1)', // Fondo verde suave basado en el primario
                            '&:hover': {
                                backgroundColor: 'rgba(106, 142, 94, 0.2)',
                            },
                            '& .MuiListItemIcon-root, & .MuiListItemText-root': {
                                color: 'var(--color-primary)', // Icono y texto en verde principal
                            },
                        },
                    },
                    '& .MuiListItemIcon-root': {
                        minWidth: 0,
                        mb: 0.5,
                        color: 'var(--color-text-muted)',
                    },
                    '& .MuiListItemText-root': {
                        m: 0,
                        color: 'var(--color-text)',
                    },
                }}
            >
                <ListItem>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                        <LeafIcon size={32} color="var(--color-primary)" />
                        <Typography sx={{
                            fontWeight: 'bold',
                            color: 'var(--color-primary)',
                            mt: 0.5
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

                <ListItem >
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

                <ListItem >
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

                <ListItem>
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