// client/src/App.jsx

// What is this file?
// The ROOT component of your entire React application.
// Every other component lives INSIDE this one.
// This is also where we'll set up routing later.

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <h1 className="text-4xl font-bold text-center pt-20">
        AI Career Companion
      </h1>
      <p className="text-center text-gray-500 mt-4">
        Project setup complete. Let's build.
      </p>
    </div>
  )
}

export default App