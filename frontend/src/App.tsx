import { ThemeProvider } from './design-tokens/SimpleThemeProvider'
import { Homepage } from './components/Homepage'

function AppContent() {
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
