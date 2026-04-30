# AgroVia - Technical Skills & Coding Conventions

When generating code for AgroVia, strictly follow these technical implementations:

## 1. Frontend Development (React 19)
- **Components:** Use functional components and hooks (`useState`, `useEffect`, `useContext`). Create custom hooks (e.g., `useAvisos`) to encapsulate business logic and API interactions.
- **Styling (MUI v7):** 
  - Use Material UI components for everything (Buttons, Typography, Layouts).
  - Use the `sx` prop for custom styling. **Do not use `styled-components` or raw CSS files** unless modifying the global `App.css`.
  - Rely on the application's predefined `theme` (defined in `src/App.jsx`) for spacing, primary/secondary colors, and typography.
- **API Calls:** 
  - Centralize all Axios calls in `src/services/api.js`.
  - Handle asynchronous operations with `async/await` and wrap calls in `try/catch` blocks.
  - Show user feedback (e.g., MUI `Snackbar` or `Alert`) on API success/failure.
- **Routing:** Use React Router 7 (`createBrowserRouter`). Use the `<ProtectedRoute />` wrapper for routes requiring authentication or specific roles.

## 2. Backend Development (Node/Express)
- **Structure:** Maintain the MVC-like structure (`routes/` -> `controllers/` -> `models/`).
- **Database Access:** 
  - Use the `pg` pool object (likely exported from `db/` or `config/`).
  - Write raw SQL queries in the `models/` directory. Example: `pool.query('SELECT * FROM users WHERE id = $1', [userId])`.
  - Always parameterize queries to prevent SQL Injection.
- **Authentication:** Use Supabase for auth. Secure endpoints using the existing `authMiddleware`.
- **API Responses:** Use a consistent JSON response format. For errors: `res.status(400).json({ error: 'Mensaje de error' })`.

## 3. Best Practices & Refactoring
- **DRY (Don't Repeat Yourself):** Extract repeated UI patterns into reusable components in `src/components/`.
- **State Management:** Avoid prop drilling. Use Context API for global state (Theme, Auth) and pass minimal required props to children.
- **Modern Syntax:** Utilize ES6+ features (destructuring, optional chaining `?.`, nullish coalescing `??`, template literals).
