import { Link, useLocation } from 'react-router-dom';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, Typography, Box, useTheme, useMediaQuery, SpeedDial, SpeedDialAction, SpeedDialIcon } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import BusinessIcon from '@mui/icons-material/Business';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { Leaf, PiggyBank } from "@boxicons/react"
import BottomNav from './BottomNav';

const drawerWidth = 100;

const MENU_ITEMS = [
    { text: 'Inicio', icon: <HomeIcon />, path: '/' },
    { text: 'Avisos', icon: <StorefrontIcon />, path: '/avisos' },
    { text: 'Operaciones', icon: <BusinessIcon />, path: '/operaciones' },
    { text: 'Mercado', icon: <TrendingUpIcon />, path: '/mercado' },
    { text: 'Perfil', icon: <PersonIcon />, path: '/perfil' },
];

function AppDrawer() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const location = useLocation();

    if (isMobile) {
        return (
            <BottomNav />
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
                        <Leaf fill="#6A8E5E" width={50} height={50} />
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

                {MENU_ITEMS.map((item) => (
                    <ListItem key={item.path} disablePadding>
                        <ListItemButton
                            component={Link}
                            to={item.path}
                            selected={item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText>
                                <Typography variant='body2'>{item.text}</Typography>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Drawer>
    )
}

export default AppDrawer;