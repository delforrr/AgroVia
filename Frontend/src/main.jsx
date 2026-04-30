// Punto de entrada principal de la aplicación React
// StrictMode se activa solo en desarrollo para detectar side-effects sin
// penalizar producción con el doble montaje intencional de componentes.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const app = import.meta.env.DEV ? (
  <StrictMode>
    <App />
  </StrictMode>
) : (
  <App />
);

createRoot(document.getElementById('root')).render(app);
