"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated auth
    router.push("/dashboard")
    onClose()
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-8 animate-in fade-in duration-300">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-[1000px] bg-white rounded-[3rem] shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 ease-out">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors z-30"
        >
          <X size={20} className="text-black" />
        </button>

        <div className="relative flex min-h-[650px] w-full overflow-hidden p-4">
          
          {/* Form Layer */}
          <div 
            className={`absolute inset-y-0 w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 bg-white transition-all duration-700 ease-in-out ${
              mode === 'signup' ? 'left-1/2' : 'left-0'
            }`}
          >
            <div className="w-full max-w-[380px] space-y-6">
              <div className="text-left">
                <h2 className="text-[32px] font-semibold tracking-tight text-black">
                  {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-500 mt-2">
                  {mode === 'login' 
                    ? 'Enter your credentials to access Career AI' 
                    : 'Join thousands of professionals landing dream jobs'}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-[50px] bg-gray-50 hover:bg-gray-100 text-black border border-gray-200 rounded-2xl font-medium"
                >
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  {mode === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
                </Button>

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-100" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-400">Or continue with</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[13px] font-medium text-gray-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@email.com"
                    className="h-[55px] bg-white border border-gray-200 rounded-2xl focus:ring-black text-[15px] text-black"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[13px] font-medium text-gray-700">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-[55px] bg-white border border-gray-200 rounded-2xl focus:ring-black text-[15px] text-black"
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  className="w-full h-[55px] bg-black text-white hover:bg-black/90 font-semibold rounded-2xl text-[15px] shadow-lg shadow-black/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {mode === 'login' ? 'Login to Dashboard' : 'Create My Account'}
                </Button>

                <div className="text-center pt-2">
                  <button 
                    type="button" 
                    onClick={toggleMode}
                    className="text-[14px] font-medium text-gray-400 hover:text-black transition-colors"
                  >
                    {mode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Image Card Layer - Always Rounded and Floating */}
          <div 
            className={`hidden lg:block absolute inset-y-4 w-[calc(50%-16px)] overflow-hidden rounded-[3rem] transition-all duration-700 ease-in-out z-20 ${
              mode === 'signup' 
                ? 'left-4 translate-x-0' 
                : 'left-[calc(50%+4px)] translate-x-0'
            }`}
          >
            <img
              src="/headphone.jpg"
              alt="Premium Experience"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md rounded-[2rem] p-8 shadow-2xl border border-white/20">
              <p className="text-base text-black font-semibold leading-relaxed">
                "We're not just building a tool; we're crafting a new standard for career growth. Join us in defining the future of professional success."
              </p>
              
              <div className="flex items-center gap-4 mt-6">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white font-bold text-lg">
                  AB
                </div>
                <div>
                  <p className="text-base font-bold text-black">Abdullah Balfaqih</p>
                  <p className="text-sm text-gray-500">Full Stack Engineer</p>
                </div>
                <div className={`ml-auto px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-blue-600 text-white shadow-lg shadow-blue-500/20`}>
                  FOUNDER
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
