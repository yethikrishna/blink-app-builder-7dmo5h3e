import { useState, useEffect } from 'react'
import { blink } from './blink/client'
import LogoScreen from './components/LogoScreen'
import AuthScreen from './components/AuthScreen'
import SplashScreen from './components/SplashScreen'
import OnboardingFlow from './components/OnboardingFlow'
import Dashboard from './components/Dashboard'

type AppState = 'logo' | 'auth' | 'splash' | 'onboarding' | 'dashboard'

function App() {
  const [appState, setAppState] = useState<AppState>('logo')
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Only set up auth listener after we've passed the initial screens
    if (appState === 'onboarding' || appState === 'dashboard') {
      const unsubscribe = blink.auth.onAuthStateChanged((state) => {
        setUser(state.user)
        setIsLoading(state.isLoading)
      })
      return unsubscribe
    }
  }, [appState])

  const handleLogoComplete = () => {
    setAppState('auth')
  }

  const handleAuthComplete = () => {
    setAppState('splash')
  }

  const handleSplashComplete = () => {
    setAppState('onboarding')
  }

  const handleOnboardingComplete = () => {
    setAppState('dashboard')
  }

  // Show loading only when we're in auth-required states
  if ((appState === 'onboarding' || appState === 'dashboard') && isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Handle authentication requirement for onboarding and dashboard
  if ((appState === 'onboarding' || appState === 'dashboard') && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Welcome to Kora</h2>
          <p className="text-muted-foreground">Please sign in to continue</p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  switch (appState) {
    case 'logo':
      return <LogoScreen onComplete={handleLogoComplete} />
    case 'auth':
      return <AuthScreen onComplete={handleAuthComplete} />
    case 'splash':
      return <SplashScreen onComplete={handleSplashComplete} />
    case 'onboarding':
      return <OnboardingFlow onComplete={handleOnboardingComplete} />
    case 'dashboard':
      return <Dashboard />
    default:
      return <LogoScreen onComplete={handleLogoComplete} />
  }
}

export default App