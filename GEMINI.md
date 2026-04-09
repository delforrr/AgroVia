# AgroVia - Platform for the Agricultural Sector

AgroVia is a marketplace and service platform designed for the agricultural sector in Argentina. It allows users to publish and search for listings related to livestock (Hacienda), machinery (Maquinaria), grains (Granos), and various agricultural services.

## Project Overview

The project is structured as a **monorepo** using **Turbo** for task orchestration and workspace management.

### Key Technologies

- **Monorepo Manager:** [Turbo](https://turbo.build/)
- **Frontend:**
  - [React 19](https://react.dev/)
  - [Vite](https://vitejs.dev/)
  - [Material UI (MUI) v7](https://mui.com/)
  - [React Router 7](https://reactrouter.com/)
  - [Axios](https://axios-http.com/)
- **Backend:**
  - [Node.js](https://nodejs.org/)
  - [Express](https://expressjs.com/)
  - [PostgreSQL](https://www.postgresql.org/) (Running on Supabase)
  - [Swagger](https://swagger.io/) (API documentation)

## Project Structure

```text
/
├── Backend/              # Node.js/Express server
│   ├── config/           # Database & environment configuration
│   ├── controllers/      # Route controllers (Aviso, etc.)
│   ├── models/           # Data models (SQL queries)
│   ├── routes/           # REST API routes (e.g., /api/avisos)
│   ├── docs/             # Swagger documentation
│   └── utils/            # Helper functions
└── Frontend/             # React application
    ├── src/
    │   ├── components/   # Reusable MUI components
    │   ├── hooks/        # Custom React hooks (e.g., useAvisos)
    │   ├── pages/        # Application views (Inicio, Mercado, Avisos, etc.)
    │   ├── services/     # API service layer (Axios)
    │   └── App.jsx       # Main application component & routing
```

## Getting Started

### Prerequisites

- Node.js (v20+ recommended)
- npm

### Installation

From the root directory, install all dependencies for both Frontend and Backend:

```bash
npm install
```

### Running the Project

To start both the Frontend and Backend in development mode:

```bash
npm run dev
```

- **Frontend:** Usually runs on [http://localhost:5173](http://localhost:5173)
- **Backend:** Runs on [http://localhost:3000](http://localhost:3000)
- **API Docs:** Available at [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Deployment & Production Notes

### Current Deployment Issues
1. **Build Scripts:** The Backend `package.json` is missing a `build` script, which prevents `turbo build` from executing tasks for the backend correctly.
2. **Static Files:** Uploads are currently stored in `Backend/public/uploads/`. For production, a cloud storage solution (like Supabase Storage or AWS S3) is required, as local files will be lost on container/server restarts.
3. **Frontend Start:** The `npm run start` in Frontend uses `vite preview`. In production, the `dist/` folder should be served by a dedicated web server (Nginx/Cloudflare/Vercel).
4. **Environment Variables:** `DATABASE_URL` and `SUPABASE_JWT_SECRET` are required. The current fallback only warns but fails when queries are executed.

## Development Conventions

- **Headers:** All source files (.js, .jsx, .css) MUST include a brief descriptive header at the top.
- **Styling:** Use Material UI (MUI) components and the established `theme` defined in `Frontend/src/App.jsx`. Avoid custom CSS when MUI components can achieve the same result.
- **State Management:** Use custom hooks (like `useAvisos`) to encapsulate logic and API interactions.
- **API Integration:** All API calls should be centralized in `Frontend/src/services/api.js`.
- **Database:** Use `pool.query` in Models for any DB interaction. Ensure queries are optimized and handle errors.
- **Supabase Auth:** Use Supabase for authentication. Ensure `authMiddleware` is applied to protected routes.

## Roadmap & Next Steps

### Phase 1: Authentication & Authorization (High Priority)
- [ ] Complete Supabase Auth integration in the Frontend.
- [ ] Implement user profile page and permissions (Admin vs Regular User).
- [ ] Secure all relevant Backend routes with `authMiddleware`.

### Phase 2: Core Functionality Enhancements
- [ ] Add advanced filtering by price range, date, and specific category attributes (e.g., HP in Machinery).
- [ ] Implement "Mis Operaciones" logic for tracking purchases/sales.
- [ ] Add support for multiple images per listing.

### Phase 3: UX & Infrastructure
- [ ] Transition local uploads to Supabase Storage.
- [ ] Implement real-time notifications for new offers or messages.
- [ ] Configure CI/CD pipelines (GitHub Actions) and Dockerize the application.
