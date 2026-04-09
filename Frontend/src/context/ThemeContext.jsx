// Contexto para manejar el tema claro/oscuro de la aplicación

import { createContext, useContext, useState, useMemo } from 'react';

const ThemeContext = createContext({
  mode: 'light',
  toggleTheme: () => {},
});

export function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState(() => {
    return localStorage.getItem('agrovia-theme') || 'light';
  });

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('agrovia-theme', next);
      return next;
    });
  };

  const value = useMemo(() => ({ mode, toggleTheme }), [mode]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeMode() {
  return useContext(ThemeContext);
}
