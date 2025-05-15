# magen-project

This guide will help you set up and run the MAGEN project, including both the backend (Node.js/Express) and the frontend (Next.js/React) applications.

---

## Prerequisites

- **Node.js** (v18 or later recommended)
- **npm** (v9 or later)
- **MongoDB** (local or cloud instance)

---

## Backend Setup

1. **Navigate to the project root:**
   ```sh
   cd magen-project
   ```
2. **Install backend dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Create a `.env` file in the root directory (if not present).
   - Add your MongoDB connection string and any other required environment variables.
4. **Start the backend server:**
   ```sh
   npm start
   ```
   - The backend should now be running (default: http://localhost:3000 or as configured).

---

## Frontend Setup (Next.js)

1. **Navigate to the frontend directory:**
   ```sh
   cd magen-frontend
   ```
2. **Install frontend dependencies:**
   - If you encounter peer dependency issues, use the legacy peer deps flag:
     ```sh
     npm install --legacy-peer-deps
     ```
   - Alternatively, you can use pnpm (recommended for this project):
     ```sh
     pnpm install
     ```
3. **Start the frontend development server:**
   ```sh
   npm run dev
   # or
   pnpm dev
   ```
   - The frontend should now be running at http://localhost:3000 (or as configured in `next.config.mjs`).

---

## Additional Notes

- **API Endpoints:**
  - Backend API endpoints are available under `/api` (see `routes/` directory).
- **Frontend Pages:**
  - Main pages are in `magen-frontend/app/`.
- **Styling:**
  - Tailwind CSS is used for styling. See `tailwind.config.ts` and `postcss.config.mjs`.
- **Environment Variables:**
  - Make sure to set up any required environment variables for both backend and frontend.

---

## Troubleshooting

- If you encounter dependency or build errors, try deleting `node_modules` and `pnpm-lock.yaml`/`package-lock.json`, then reinstall dependencies.
- For peer dependency issues with npm, always use `--legacy-peer-deps`.

---

## Scripts

- **Backend:**
  - `npm start` – Start backend server
- **Frontend:**
  - `npm run dev` or `pnpm dev` – Start frontend dev server

---

# Project Documentation

## Overview

MAGEN is a full-stack web application designed to provide security breach detection, alerting, and user privacy recommendations. The project is split into two main parts:

- **Backend:** Node.js with Express, connected to MongoDB, providing RESTful APIs for authentication, breach management, alerts, and user management.
- **Frontend:** Next.js (React) application, styled with Tailwind CSS, providing a modern dashboard and user interface for interacting with the backend services.

---

## Project Structure

```text
magen-project/
│
├── app.js                  # Main backend entry point
├── package.json            # Backend dependencies and scripts
├── config/                 # Database and configuration files
├── controllers/            # Express route controllers
├── middlewares/            # Express middlewares (auth, validation)
├── models/                 # Mongoose models (User, Breach, Alert)
├── public/                 # Static assets for backend
├── routes/                 # Express route definitions
├── services/               # Backend services (email, breach detection, etc.)
├── utils/                  # Utility functions and logger
├── magen-frontend/         # Next.js frontend application
│   ├── app/                # Next.js app directory (pages, API routes)
│   ├── components/         # React components (UI, forms, charts, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Frontend utility functions
│   ├── public/             # Frontend static assets
│   ├── services/           # Frontend API/database service wrappers
│   ├── styles/             # Global and component styles
│   ├── ...                 # Config files (tsconfig, tailwind, etc.)
│
├── README.md               # Project documentation (this file)
└── LICENSE                 # License file
```

---

## Backend (Node.js/Express)

### Key Features Implemented

- **User Authentication:** Registration, login, and JWT-based authentication.
- **Breach Management:** CRUD operations for breaches, including detection and storage.
- **Alerts System:** Generation and management of alerts related to breaches.
- **User Management:** User profile, onboarding, and settings.
- **Database Integration:** MongoDB via Mongoose, with models for User, Breach, and Alert.
- **API Routing:** Modular route definitions for `/api/auth`, `/api/breaches`, `/api/alerts`, `/api/users`.
- **Middleware:** Authentication and validation middleware for route protection and input checking.
- **Services:** Email notifications, breach detection logic, dark web scanning, and logging utilities.

#### Directory Details

- `app.js`: Main Express app setup, middleware registration, and route mounting.
- `config/`: Database connection logic (`db.js`, `mongo.js`).
- `controllers/`: Business logic for each route (e.g., `authController.js`, `breachController.js`).
- `middlewares/`: Auth and validation middleware.
- `models/`: Mongoose schemas for `User`, `Breach`, and `Alert`.
- `routes/`: Express routers for each API endpoint.
- `services/`: Core backend services (breach detection, email, dark web scanning).
- `utils/`: Helper functions and logger.

#### Backend Scripts

- `npm start`: Starts the backend server (default: http://localhost:3000).
- `npm install`: Installs backend dependencies.

---

## Frontend (Next.js/React)

### Key Features Implemented

- **Modern Dashboard UI:** Built with Next.js App Router and React components.
- **Authentication Pages:** Login, registration, and onboarding flows.
- **Dashboard:** Displays breach statistics, recent alerts, and privacy recommendations.
- **Breach Details:** View and interact with breach data.
- **User Settings:** Update user profile and preferences.
- **API Integration:** Communicates with backend via RESTful endpoints.
- **Styling:** Tailwind CSS for rapid, responsive UI development.
- **Reusable Components:** Sidebar, header, cards, charts, tables, dialogs, and more.
- **Custom Hooks:** For mobile detection, toast notifications, etc.

#### Directory Details

- `app/`: Next.js pages and API routes (e.g., `/dashboard`, `/login`, `/register`, `/settings`).
- `components/`: UI and functional components (sidebar, forms, charts, onboarding steps, etc.).
- `hooks/`: Custom React hooks (`use-mobile`, `use-toast`).
- `lib/`: Utility functions for the frontend.
- `public/`: Static assets (images, logos, placeholders).
- `services/`: API and database service wrappers.
- `styles/`: Global and component-specific CSS.

#### Frontend Scripts

- `npm run dev`: Starts the frontend development server (http://localhost:3000).
- `pnpm dev`: Alternative using pnpm (recommended).
- `npm install --legacy-peer-deps`: Installs dependencies, resolving peer issues.
- `pnpm install`: Installs dependencies using pnpm.

---

## Environment Variables

- **Backend:** `.env` file in the root directory for MongoDB connection string and other secrets.
- **Frontend:** May require environment variables for API endpoints or third-party services.

---

## API Endpoints

- **Backend:** All API endpoints are under `/api` (see `routes/` directory).
  - `/api/auth`: Authentication (login, register)
  - `/api/breaches`: Breach management
  - `/api/alerts`: Alerts system
  - `/api/users`: User management

---

## Frontend Pages

- **Main Pages:** Located in `magen-frontend/app/`
  - `/dashboard`: Main dashboard
  - `/login`: Login page
  - `/register`: Registration page
  - `/settings`: User settings
  - `/onboarding/[step]`: Onboarding flow
  - `/breach/[id]`: Breach details
  - `/recommendations`: Privacy recommendations

---

## Styling

- **Tailwind CSS:** Configured via `tailwind.config.ts` and `postcss.config.mjs`.
- **Global Styles:** In `globals.css`.

---

## Troubleshooting

- Delete `node_modules` and lock files (`pnpm-lock.yaml`/`package-lock.json`) if you encounter dependency issues, then reinstall.
- Use `--legacy-peer-deps` with npm if peer dependency errors occur.

---

## What Has Been Implemented

### Backend

- Express server with modular routing and middleware.
- MongoDB integration with Mongoose models for users, breaches, and alerts.
- Authentication and authorization (JWT).
- Breach detection and alerting logic.
- Email and dark web scanning services.
- Logging and utility helpers.

### Frontend

- Next.js App Router structure.
- Authentication, onboarding, and dashboard pages.
- UI components for displaying breaches, alerts, and recommendations.
- Responsive design with Tailwind CSS.
- API integration with backend endpoints.
- Custom hooks and utility functions.

---

## Next Steps / Possible Improvements

- Add more detailed API documentation (e.g., Swagger/OpenAPI).
- Implement more granular user roles and permissions.
- Add unit and integration tests for backend and frontend.
- Enhance error handling and user feedback.
- Expand breach detection logic and alert types.
- Add deployment scripts and CI/CD configuration.

---

## References

- See `README.md` for setup instructions and scripts.
- Explore `routes/`, `controllers/`, and `models/` for backend logic.
- Explore `magen-frontend/app/` and `components/` for frontend UI.

---

This documentation provides a comprehensive overview of the MAGEN project and what has been implemented so far. If you need even more detail on a specific part (e.g., API contracts, component props, or service logic), let me know!