import { ThemeProvider } from './design-tokens/SimpleThemeProvider'
import { Homepage } from './components/Homepage'
import { FreeSession } from './components/FreeSession'
import FreeSessionNoCanvas from './components/FreeSessionNoCanvas'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function AppContent() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/session" element={<FreeSession />} />
        <Route path="/free-session" element={<FreeSession />} />
        <Route path="/session-chat" element={<FreeSessionNoCanvas />} />
        <Route path="/free-session-chat" element={<FreeSessionNoCanvas />} />
      </Routes>
    </BrowserRouter>
  )
}

function App() {
  return (
    <ThemeProvider defaultMode="light">
      <AppContent />
    </ThemeProvider>
  )
}

export default App
