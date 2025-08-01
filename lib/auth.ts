import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Check if environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface AuthUser {
  id: string
  email: string
  role?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export class AuthService {
  static async login(credentials: LoginCredentials) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    })

    if (error) {
      throw new Error(error.message)
    }

    return data
  }

  static async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      throw new Error(error.message)
    }
  }

  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error) {
      throw new Error(error.message)
    }

    return user
  }

  static async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      throw new Error(error.message)
    }

    return session
  }

  static onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback)
  }
} 