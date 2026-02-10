import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import { Box, Button, Container, Grid, Typography, createTheme, ThemeProvider, CssBaseline, Stack } from '@mui/material';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [mode, setMode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode],
  );

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const handleTestApi = async () => {
    try {
      const response = await fetch('http://localhost:3000');
      const text = await response.text();
      setMessage(text);
    } catch (error) {
      setMessage('Error al conectar con el backend');
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Navbar toggleTheme={toggleTheme} isDarkMode={mode === 'dark'} />
      <CssBaseline />
      <Container maxWidth={false}>

        <Grid container className="main-layout">

          <Grid size={{xs: 12, md: 8}}>
            <Box sx={{ backgroundColor: 'grey.300', p: 2, flexGrow: 1 }}>
              <Typography>Contenido Principal (xs=12, md=8)</Typography>
            </Box>
          </Grid>

          <Grid size={{xs: 12, md: 4}}>
            <Box sx={{ backgroundColor: 'grey.400', p: 2, flexGrow: 1 }}>
              <Typography>Barra Lateral (xs=12, md=4)</Typography>
            </Box>
          </Grid>

        </Grid>

      </Container>
    </ThemeProvider>
  );
}

export default App;