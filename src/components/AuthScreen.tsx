import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Facebook, Apple } from 'lucide-react'

interface AuthScreenProps {
  onComplete: () => void
}

export default function AuthScreen({ onComplete }: AuthScreenProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simulate sign up process
    setTimeout(() => {
      setIsLoading(false)
      onComplete()
    }, 1500)
  }

  const handleSocialSignUp = (provider: string) => {
    setIsLoading(true)
    // Simulate social sign up
    setTimeout(() => {
      setIsLoading(false)
      onComplete()
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#E8A87C' }}>
      {/* Decorative leaves in top right */}
      <div className="absolute top-8 right-8 opacity-60">
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
          <path d="M20 10C25 5 35 8 40 15C45 22 42 32 35 35C30 38 20 35 15 28C10 21 15 15 20 10Z" fill="#D4956B"/>
          <path d="M35 25C40 20 50 23 55 30C60 37 57 47 50 50C45 53 35 50 30 43C25 36 30 30 35 25Z" fill="#C8875F"/>
          <path d="M25 45C30 40 40 43 45 50C50 57 47 67 40 70C35 73 25 70 20 63C15 56 20 50 25 45Z" fill="#D4956B"/>
        </svg>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        {/* Circular Logo */}
        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/30">
          <div className="text-white text-2xl font-bold">K</div>
          <div className="absolute inset-0 rounded-full border border-white/40"></div>
        </div>

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Your Community,</h1>
          <h2 className="text-2xl font-bold text-white">your place</h2>
        </div>

        {/* Social Sign Up Buttons */}
        <div className="w-full max-w-sm space-y-3 mb-6">
          <Button
            onClick={() => handleSocialSignUp('facebook')}
            disabled={isLoading}
            className="w-full bg-white text-gray-800 hover:bg-gray-50 flex items-center justify-center gap-2 py-3 rounded-full"
          >
            <Facebook className="w-5 h-5 text-blue-600" />
            Sign up with Facebook
          </Button>

          <Button
            onClick={() => handleSocialSignUp('apple')}
            disabled={isLoading}
            className="w-full bg-white text-gray-800 hover:bg-gray-50 flex items-center justify-center gap-2 py-3 rounded-full"
          >
            <Apple className="w-5 h-5 text-black" />
            Sign up with Apple
          </Button>
        </div>

        {/* Divider */}
        <div className="text-center text-white/80 text-sm mb-6">
          Or start<br />with your email
        </div>

        {/* Email Form */}
        <form onSubmit={handleEmailSignUp} className="w-full max-w-sm space-y-4">
          <div>
            <Label htmlFor="email" className="sr-only">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/90 border-0 rounded-full py-3 px-4 placeholder:text-gray-500"
            />
          </div>

          <div>
            <Label htmlFor="password" className="sr-only">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-white/90 border-0 rounded-full py-3 px-4 placeholder:text-gray-500"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-900 hover:bg-amber-800 text-white py-3 rounded-full font-medium"
          >
            {isLoading ? 'Signing up...' : 'Sign up'}
          </Button>
        </form>

        {/* Bottom decorative leaves */}
        <div className="absolute bottom-8 right-8 opacity-40">
          <svg width="40" height="60" viewBox="0 0 40 60" fill="none">
            <path d="M15 5C20 0 30 3 35 10C40 17 37 27 30 30C25 33 15 30 10 23C5 16 10 10 15 5Z" fill="#D4956B"/>
            <path d="M20 25C25 20 35 23 40 30C45 37 42 47 35 50C30 53 20 50 15 43C10 36 15 30 20 25Z" fill="#C8875F"/>
          </svg>
        </div>
      </div>
    </div>
  )
}