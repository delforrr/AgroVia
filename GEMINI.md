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
  - [PostgreSQL](https://www.postgresql.org/) (Dependency included, implementation currently uses mock data)
  - [Swagger](https://swagger.io/) (API documentation)

## Project Structure

```text
/
├── Backend/              # Node.js/Express server
│   ├── index.js          # Entry point
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

### Other Commands

- `npm run build`: Build both workspaces.
- `npm run lint`: Run ESLint across the project.
- `npm run start`: Start the production build.

## Development Conventions

- **Styling:** Use Material UI (MUI) components and the established `theme` defined in `Frontend/src/App.jsx`. Avoid custom CSS when MUI components can achieve the same result.
- **State Management:** Use custom hooks (like `useAvisos`) to encapsulate logic and API interactions.
- **API Integration:** All API calls should be centralized in `Frontend/src/services/api.js`.
- **Backend Routes:** New features should be added as separate files in `Backend/routes/` and registered in `Backend/routes/index.js`.
- **Database:** The backend currently uses an in-memory mock database in `Backend/routes/avisos.js`. Future development should transition this to PostgreSQL using the `pg` library.
- **Linting:** Ensure code adheres to the ESLint configuration. Run `npm run lint` before committing.
