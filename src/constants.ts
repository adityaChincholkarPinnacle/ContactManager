// Global constants shared across the app
// The API base URL can be configured at build/runtime via the Vite env variable `VITE_API_URL`.
// During local development `.env` or `.env.local` can define:
//    VITE_API_URL=http://localhost:3001
// In production set it in your hosting provider's environment variables panel (e.g., Vercel).

export const API_BASE_URL =
  // Vite injects `import.meta.env` values at build time
  import.meta.env.VITE_API_URL ?? '/api';
