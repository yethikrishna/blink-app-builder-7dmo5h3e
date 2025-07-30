import { useEffect } from 'react'

interface LogoScreenProps {
  onComplete: () => void
}

export default function LogoScreen({ onComplete }: LogoScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete()
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(/auth-screen.jpg)'
      }}
      onClick={onComplete}
    >
      {/* The image contains everything - just display it as the full screen */}
    </div>
  )
}