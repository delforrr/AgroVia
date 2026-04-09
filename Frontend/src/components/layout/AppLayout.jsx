// Componente de diseño base para la aplicación

import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom';
import AppDrawer from './Drawer.jsx';

export default function AppLayout() {
  return (
    <Box sx={{ display: 'flex' }}>
      <AppDrawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
