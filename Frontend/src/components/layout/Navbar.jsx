import { AppBar, Box, Button, Toolbar, Typography, Autocomplete, TextField, InputAdornment, IconButton, Tooltip } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded';
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded';
import { useThemeMode } from '../../theme/ThemeContext.jsx';

function ResponsiveAppBar({ title, hasSearch = false }) {
  const { mode, toggleTheme } = useThemeMode();
  const options = ['Hacienda', 'Maquinaria', 'Servicios'];

  return (
    <Box>
      <AppBar position="static" sx={{
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.default',
        color: 'text.secondary',
      }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          {hasSearch && (
            <Autocomplete
              freeSolo
              size="small"
              options={options}
              sx={{ 
                width: { xs: 150, md: 250 }, 
                mx: 2, 
                bgcolor: 'background.paper',
                '& .MuiOutlinedInput-root': { borderRadius: '20px' }
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Buscar..."
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
                      ),
                      type: 'search',
                    },
                  }}
                />
              )}
            />
          )}

          <Tooltip title={mode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}>
            <IconButton
              onClick={toggleTheme}
              color="inherit"
              size="medium"
              sx={{
                mx: 0.5,
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'rotate(20deg)' },
              }}
            >
              {mode === 'dark'
                ? <LightModeRoundedIcon sx={{ fontSize: 22 }} />
                : <DarkModeRoundedIcon sx={{ fontSize: 22 }} />
              }
            </IconButton>
          </Tooltip>

          <Button color="inherit"><AccountCircleIcon sx={{ fontSize: 30 }} /></Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default ResponsiveAppBar;
