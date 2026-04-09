// Configuración del tema de Material UI

import { createTheme } from '@mui/material';

const commonTypography = {
  fontFamily: '"Inter", "Poppins", sans-serif',
  h4: {
    fontSize: '2.3rem',
    fontWeight: 600,
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.3rem',
  },
  h6: {
    fontSize: '1.2rem',
  },
};

const commonShape = {
  borderRadius: 3,
};

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6A8E5E',
      contrastText: '#ffffff',
      muted: '#667A66',
    },
    secondary: {
      main: '#A0785E',
      accent: '#6ab352',
    },
    background: {
      default: '#f1fff1',
      paper: '#FFFFFF',
      sidebar: '#fafcfa',
    },
    text: {
      primary: '#2C3E2D',
      secondary: '#5c7161',
    },
    action: {
      selected: '#6a8e5e1a',
    },
  },
  typography: commonTypography,
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
  shape: commonShape,
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#82B374',
      contrastText: '#ffffff',
      muted: '#6a9460',
    },
    secondary: {
      main: '#C49A7E',
      accent: '#7fcf62',
    },
    background: {
      default: '#121712',
      paper: '#1E2A1E',
      sidebar: '#172117',
    },
    text: {
      primary: '#D6EDD4',
      secondary: '#8aab86',
    },
    action: {
      selected: '#82b37426',
    },
    divider: 'rgba(130, 179, 116, 0.15)',
  },
  typography: commonTypography,
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '::selection': {
          backgroundColor: '#82B374',
          color: '#121712',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
  shape: commonShape,
});

// Default export mantiene compatibilidad con importaciones existentes
export default lightTheme;
