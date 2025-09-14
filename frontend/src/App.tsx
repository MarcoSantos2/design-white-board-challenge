import { ThemeProvider } from './design-tokens/SimpleThemeProvider'
import { Homepage } from './components/Homepage'
import { FreeSession } from './components/FreeSession'

function AppContent() {
  // Simple routing based on URL path
  const path = window.location.pathname;
  
  if (path === '/session' || path === '/free-session') {
    return <FreeSession />
  }
  
  return <Homepage />
}

function App() {
  return (
    <ThemeProvider defaultMode="light">
      <AppContent />
    </ThemeProvider>
  )
}

export default App
