import { ThemeProvider } from './design-tokens/SimpleThemeProvider'
import { Homepage } from './components/Homepage'
import { FreeSession } from './components/FreeSession'
import FreeSessionNoCanvas from './components/FreeSessionNoCanvas'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import SignIn from './components/auth/SignIn'
import SignUp from './components/auth/SignUp'

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        {/* Anonymous chat allowed */}
        <Route path="/session-chat" element={<FreeSessionNoCanvas />} />
        <Route path="/free-session-chat" element={<FreeSessionNoCanvas />} />

        {/* Auth pages */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/session" element={<FreeSession />} />
          <Route path="/free-session" element={<FreeSession />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <ThemeProvider defaultMode="light">
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
