// server/server.js

// What is this file?
// The ENTRY POINT of your backend.
// Its only job: start the HTTP server on a port and listen for incoming requests.
// All the real setup (routes, middleware) happens in src/app.js

import app from './src/app.js'

// process.env.PORT — On Render (your deployment platform), they set this automatically.
// The || 3000 means: if PORT isn't set, use 3000 locally.
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})