import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

const Navbar = ({ children, toggleTheme, isDarkMode }) => {
  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#2E7D32' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold', textAlign: 'left' }}>
            AgroVia
          </Typography>
          <Box>
            <Button color="inherit" onClick={toggleTheme}>
              {isDarkMode ? '☀️' : '🌙'}
            </Button>
            <Button color="inherit">Login</Button>
            <Button color="inherit">Registro</Button>
            {children}
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </>
  );
};

export default Navbar;