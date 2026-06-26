// client/src/main.jsx

// What is this file?
// The ENTRY POINT of your React application.
// This is the first JavaScript file that runs.
// Its only job: find the <div id="root"> in index.html and mount React into it.

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'   // ← This imports Tailwind (the @import "tailwindcss" line)
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* StrictMode is a development tool. It intentionally runs your components
        twice to help catch bugs. It does NOTHING in production. */}
    <App />
  </StrictMode>,
)