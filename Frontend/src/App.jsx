import { Box, CssBaseline, Paper, ThemeProvider, createTheme, Typography } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import AppDrawer from './components/Drawer.jsx';
import InicioPage from './pages/Inicio.jsx';
import AvisosPage from './pages/Avisos.jsx';
import OperacionesPage from './pages/Operaciones.jsx';
import MercadoPage from './pages/Mercado.jsx';
import PerfilPage from './pages/Perfil.jsx';


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
      fontSize: '1.3rem'
    },
    h6: {
      fontSize: '1.2rem'
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
      <Router>
        <CssBaseline />
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
            <Routes>
              <Route path="/" element={<InicioPage />} />
              <Route path="/avisos" element={<AvisosPage />} />
              <Route path="/operaciones" element={<OperacionesPage />} />
              <Route path="/mercado" element={<MercadoPage />} />
              <Route path="/perfil" element={<PerfilPage />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;