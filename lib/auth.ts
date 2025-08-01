// Simple Local Storage Authentication System

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

export interface LoginCredentials {
  email: string
  password: string
}

// Admin credentials (in production, this should be in environment variables)
const ADMIN_CREDENTIALS = {
  email: 'francis@thekingsbakerysl.com',
  password: 'kingsbakery123456', // Change this to a secure password
  name: 'Kings Bakery',
  role: 'admin'
}

export class AuthService {
  private static readonly AUTH_KEY = 'kings-bakery-auth'
  private static readonly SESSION_KEY = 'kings-bakery-session'

  // Login with credentials
  static async login(credentials: LoginCredentials): Promise<{ user: AuthUser }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check credentials
    if (credentials.email === ADMIN_CREDENTIALS.email && 
        credentials.password === ADMIN_CREDENTIALS.password) {
      
      const user: AuthUser = {
        id: '1',
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        role: ADMIN_CREDENTIALS.role
      }

      // Store in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(this.AUTH_KEY, JSON.stringify(user))
        localStorage.setItem(this.SESSION_KEY, JSON.stringify({
          access_token: 'fake-jwt-token-' + Date.now(),
          expires_at: Date.now() + (6 * 30 * 24 * 60 * 60 * 1000) // 6 months
        }))
      }

      return { user }
    }

    throw new Error('Invalid email or password')
  }

  // Logout
  static async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.AUTH_KEY)
      localStorage.removeItem(this.SESSION_KEY)
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<AuthUser | null> {
    if (typeof window === 'undefined') return null

    try {
      const userStr = localStorage.getItem(this.AUTH_KEY)
      const sessionStr = localStorage.getItem(this.SESSION_KEY)

      if (!userStr || !sessionStr) return null

      const user: AuthUser = JSON.parse(userStr)
      const session = JSON.parse(sessionStr)

      // Check if session is expired
      if (session.expires_at < Date.now()) {
        this.logout()
        return null
      }

      return user
    } catch (error) {
      console.error('Error getting current user:', error)
      return null
    }
  }

  // Get session
  static async getSession(): Promise<{ user: AuthUser } | null> {
    const user = await this.getCurrentUser()
    return user ? { user } : null
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser()
    return !!user
  }

  // Auth state change listener (simplified)
  static onAuthStateChange(callback: (event: string, session: any) => void) {
    if (typeof window === 'undefined') {
      return { data: { subscription: { unsubscribe: () => {} } } }
    }

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === this.AUTH_KEY) {
        if (e.newValue) {
          const user = JSON.parse(e.newValue)
          callback('SIGNED_IN', { user })
        } else {
          callback('SIGNED_OUT', null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Return subscription object
    return {
      data: {
        subscription: {
          unsubscribe: () => {
            window.removeEventListener('storage', handleStorageChange)
          }
        }
      }
    }
  }

  // Clear all auth data
  static clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.AUTH_KEY)
      localStorage.removeItem(this.SESSION_KEY)
    }
  }
} 