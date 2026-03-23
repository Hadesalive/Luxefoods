"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, Lock } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase-browser"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createSupabaseBrowserClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError("Invalid email or password.")
      setLoading(false)
      return
    }

    const role = data.user?.app_metadata?.role ?? 'cashier'
    const dest = role === 'admin' ? '/admin/dashboard' : '/admin/pos'
    router.push(dest)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 relative mb-3">
            <Image src="/images/logo.png" alt="LUXE FOOD" fill className="object-contain" />
          </div>
          <p className="text-sm font-bold text-yellow-400 tracking-wider">LUXE FOOD</p>
          <p className="text-xs text-stone-500 mt-0.5">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-4 h-4 text-stone-400" />
            <h1 className="text-sm font-semibold text-stone-300">Sign in to continue</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-stone-400 block mb-1.5">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-yellow-500 transition-colors"
                placeholder="admin@luxefood.com"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-stone-400 block mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-stone-800 border border-stone-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-stone-600 focus:outline-none focus:border-yellow-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 disabled:cursor-not-allowed text-stone-900 font-semibold text-sm py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-stone-600 mt-6">
          LUXE FOOD · Restricted Access
        </p>
      </div>
    </div>
  )
}
