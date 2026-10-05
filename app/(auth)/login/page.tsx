'use client'

import React, { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { GraduationCap, Lock, User as UserIcon, LogIn, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const res = await signIn('credentials', {
        username,
        password,
        redirect: false,
      })

      if (res?.error) {
        setError('Invalid username/email or password')
        setIsLoading(false)
        return
      }

      // Check session role & redirect
      router.refresh()
      router.push('/dashboard')
    } catch (err: any) {
      setError('An error occurred during login. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400 backdrop-blur-md shadow-xl shadow-indigo-500/10">
            <GraduationCap className="h-9 w-9" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase">Academy Lexa</h1>
            <p className="text-xs text-indigo-300 font-medium">Student & Administrator Portal Login</p>
          </div>
        </div>

        {/* Glassmorphism Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-200 text-xs font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Username or Email"
              type="text"
              placeholder="e.g. admin or LEX-001"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              leftIcon={<UserIcon className="h-4 w-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full justify-center font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 py-3"
              icon={<LogIn className="h-4 w-4" />}
            >
              Sign In to Portal
            </Button>
          </form>

          <div className="pt-4 border-t border-white/10 text-center space-y-2 text-xs text-slate-400">
            <p>Admin Account: <code className="text-indigo-300 font-mono">admin</code> / <code className="text-indigo-300 font-mono">admin123</code></p>
          </div>
        </div>

        <div className="text-center">
          <a href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← Back to Public Website
          </a>
        </div>
      </div>
    </div>
  )
}
