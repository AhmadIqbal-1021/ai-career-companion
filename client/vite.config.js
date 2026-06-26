// client/vite.config.js

// What is this file?
// Vite's configuration file. It controls how Vite builds and serves your app.
// We're adding the Tailwind plugin here so Vite processes Tailwind CSS automatically.

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),        // Enables JSX transformation and React Fast Refresh
    tailwindcss(),  // Enables Tailwind CSS processing
  ],
})