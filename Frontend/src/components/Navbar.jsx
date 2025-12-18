import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function ResponsiveAppBar() {

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{
        boxShadow: 'none',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        backgroundColor: 'var(--color-bg-app)',
        color: 'var(--color-text)',
      }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Inicio
          </Typography>
          <Button color="inherit">Iniciar Sesión</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
export default ResponsiveAppBar;
