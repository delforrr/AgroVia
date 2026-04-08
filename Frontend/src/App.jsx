import { CssBaseline, ThemeProvider } from '@mui/material';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lightTheme, darkTheme } from './context/theme.js';
import { ThemeContextProvider, useThemeMode } from './context/ThemeContext.jsx';
import './App.css';
import AppLayout from './components/layout/AppLayout.jsx';
import InicioPage from './pages/Inicio.jsx';
import AvisosPage from './pages/Avisos.jsx';
import OperacionesPage from './pages/Operaciones.jsx';
import MercadoPage from './pages/Mercado.jsx';
import PerfilPage from './pages/Perfil.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <InicioPage /> },
      { path: "avisos", element: <AvisosPage /> },
      { path: "operaciones", element: <OperacionesPage /> },
      { path: "mercado", element: <MercadoPage /> },
      { path: "perfil", element: <PerfilPage /> },
    ],
  },
]);

function ThemedApp() {
  const { mode } = useThemeMode();
  const theme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

function App() {
  return (
    <ThemeContextProvider>
      <ThemedApp />
    </ThemeContextProvider>
  );
}

export default App;
