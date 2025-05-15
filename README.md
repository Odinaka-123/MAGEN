# magen-project

This guide will help you set up and run the MAGEN project, including both the backend (Node.js/Express) and the frontend (Next.js/React) applications.

---

## Prerequisites

- **Node.js** (v18 or later recommended)
- **npm** (v9 or later) or (for frontend)
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