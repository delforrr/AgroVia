import { Box, Container, CssBaseline, Paper, Grid } from '@mui/material';
import './App.css';
import Navbar from './components/Navbar.jsx';
import Drawer from './components/Drawer.jsx';

function App() {
  return (
    <Box sx={{
      display: 'flex',
    }}>
      <CssBaseline />
      <Drawer />

      <Box component="main" sx={{
        flexGrow: 1,
        height: '100vh',
        backgroundColor: 'var(--color-bg-app)',
        color: 'var(--color-text)',
      }}>
        
        <Navbar />

        <Grid container spacing={2} sx={{
          padding: 2,
        }}>
          <Grid size={{ md: 3, lg: 3, xs: 12 }}>
            <Paper>
              HOLA
            </Paper>
          </Grid>
          <Grid size={{ md: 9, lg: 9, xs: 12 }}>
            <Paper>
              MUNDO
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default App;