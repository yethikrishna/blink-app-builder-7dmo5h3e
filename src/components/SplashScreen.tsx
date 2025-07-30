import { useEffect } from 'react'

interface SplashScreenProps {
  onComplete: () => void
}

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 3000) // 3 seconds

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div 
      className="fixed inset-0 w-full h-full flex items-center justify-center"
      style={{ backgroundColor: '#F4AC8E' }}
    >
      <img 
        src="/splash-screen.png" 
        alt="Kora Splash Screen" 
        className="w-full h-full object-contain"
      />
    </div>
  )
}