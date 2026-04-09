// Componente de panel lateral para notificaciones

import { Drawer, List, ListItem, ListItemText, Typography, Divider, Box, IconButton, Stack, Badge } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CircleIcon from '@mui/icons-material/Circle';

function NotificationsDrawer({ open, onClose, notifications = [] }) {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{
                '& .MuiDrawer-paper': {
                    width: { xs: '100%', sm: 400 }, p: 0
                }
            }}
        >
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                    <NotificationsIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>Notificaciones</Typography>
                    <Badge badgeContent={notifications.length} color="error" />
                </Stack>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider />

            <List sx={{ py: 0 }}>
                {notifications.length === 0 ? (
                    <Box sx={{ p: 4, textAlign: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                            No tienes notificaciones pendientes
                        </Typography>
                    </Box>
                ) : (
                    notifications.map((notification, index) => (
                        <Box key={index}>
                            <ListItem
                                alignItems="flex-start"
                                sx={{
                                    py: 2,
                                    '&:hover': { bgcolor: 'action.hover' },
                                    cursor: 'pointer'
                                }}
                            >
                                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                                    
                                    <CircleIcon sx={{ fontSize: 8, mr: 2, color: 'primary.main' }} />
                                    
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle2" fontWeight={700}>
                                                {notification.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <Stack spacing={0.5}>
                                                <Typography variant="body2" color="text.primary">
                                                    {notification.message}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {notification.time}
                                                </Typography>
                                            </Stack>
                                        }
                                    />
                                </Stack>
                            </ListItem>
                            <Divider component="li" />
                        </Box>
                    ))
                )}
            </List>

            {notifications.length > 0 && (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography
                        variant="caption"
                        color="primary"
                        sx={{ cursor: 'pointer', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
                    >
                        Marcar todas como leídas
                    </Typography>
                </Box>
            )}
        </Drawer>
    )
}

export default NotificationsDrawer;
