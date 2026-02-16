import { Box, Container, CssBaseline, Paper, Grid, ThemeProvider, createTheme, Typography } from '@mui/material';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Drawer from './components/Drawer.jsx';
import HeroCard from './components/HeroCard.jsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6A8E5E',
      contrastText: '#ffffff',
      muted: '#667A66'
    },
    secondary: {
      main: '#A0785E',
      accent: '#6ab352'
    },
    background: {
      default: '#f1fff1',
      paper: '#FFFFFF',
      sidebar: '#fafcfa'
    },
    text: {
      primary: '#2C3E2D',
      secondary: '#5c7161',
    },
    action: {
      selected: '#6a8e5e1a',
    },
  },
  typography: {
    fontFamily: 'sans-serif, poppins, inter',
    h4: {
      fontSize: '2.3rem',
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontSize: '1.5rem'
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '::selection': {
          backgroundColor: '#667A66',
          color: '#ffffff',
        },
      },
    },
  },
  shape: {
    borderRadius: 3,
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
      }}>
        <Drawer />

        <Box component="main" sx={{
          flexGrow: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.default',
          color: 'var(--color-text)',
          pb: { xs: 7, md: 0 }, // Espacio para la navegación inferior en móviles
        }}>

          <Navbar />

          <Grid container spacing={2} sx={{
            padding: 3,
            flexGrow: 1,
            minHeight: 0,
          }}>
            <Grid size={{ md: 3, lg: 3, xs: 12 }}>
              <HeroCard userName="Delfor" />
            </Grid>
            <Grid size={{ md: 9, lg: 9, xs: 12 }}>
              <Paper sx={{ p: 3, height: '100%', borderRadius: 5 }}>
                <Typography variant="h5" gutterBottom>Panel de Control</Typography>
                <Typography variant="body1">Selecciona una opción del menú para comenzar.</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;