

interface UsageMetrics {
  apiCalls: number
  bandwidth: number // in bytes
  lastReset: string
}

class SupabaseOptimizer {
  private static instance: SupabaseOptimizer
  private metrics: UsageMetrics = {
    apiCalls: 0,
    bandwidth: 0,
    lastReset: new Date().toISOString().split('T')[0] // YYYY-MM-DD
  }

  private constructor() {
    this.loadMetrics()
  }

  static getInstance(): SupabaseOptimizer {
    if (!SupabaseOptimizer.instance) {
      SupabaseOptimizer.instance = new SupabaseOptimizer()
    }
    return SupabaseOptimizer.instance
  }

  private loadMetrics() {
    if (typeof window === 'undefined') return
    
    try {
      const saved = localStorage.getItem('supabase-metrics')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Reset metrics if it's a new day
        if (parsed.lastReset !== this.metrics.lastReset) {
          this.metrics = {
            apiCalls: 0,
            bandwidth: 0,
            lastReset: new Date().toISOString().split('T')[0]
          }
        } else {
          this.metrics = parsed
        }
      }
    } catch (error) {
      console.warn('Failed to load Supabase metrics:', error)
    }
  }

  private saveMetrics() {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem('supabase-metrics', JSON.stringify(this.metrics))
    } catch (error) {
      console.warn('Failed to save Supabase metrics:', error)
    }
  }

  // Track API call
  trackApiCall(responseSize: number = 0) {
    this.metrics.apiCalls++
    this.metrics.bandwidth += responseSize
    this.saveMetrics()
  }

  // Get current usage
  getUsage(): UsageMetrics {
    return { ...this.metrics }
  }

  // Check if we're approaching limits
  checkLimits(): {
    apiCallsRemaining: number
    bandwidthRemaining: number
    isNearLimit: boolean
  } {
    const API_LIMIT = 50000 // 50k requests per month
    const BANDWIDTH_LIMIT = 2 * 1024 * 1024 * 1024 // 2GB per month
    
    const apiCallsRemaining = Math.max(0, API_LIMIT - this.metrics.apiCalls)
    const bandwidthRemaining = Math.max(0, BANDWIDTH_LIMIT - this.metrics.bandwidth)
    const isNearLimit = apiCallsRemaining < 1000 || bandwidthRemaining < 100 * 1024 * 1024 // 100MB

    return {
      apiCallsRemaining,
      bandwidthRemaining,
      isNearLimit
    }
  }

  // Get usage percentage
  getUsagePercentage(): { api: number; bandwidth: number } {
    const API_LIMIT = 50000
    const BANDWIDTH_LIMIT = 2 * 1024 * 1024 * 1024

    return {
      api: Math.min(100, (this.metrics.apiCalls / API_LIMIT) * 100),
      bandwidth: Math.min(100, (this.metrics.bandwidth / BANDWIDTH_LIMIT) * 100)
    }
  }

  // Reset metrics (useful for testing)
  reset() {
    this.metrics = {
      apiCalls: 0,
      bandwidth: 0,
      lastReset: new Date().toISOString().split('T')[0]
    }
    this.saveMetrics()
  }
}

// Export singleton instance
export const supabaseOptimizer = SupabaseOptimizer.getInstance()

// Cache management utilities
export class CacheManager {
  private static readonly CACHE_PREFIX = 'luxe-foods-cache'
  private static readonly DEFAULT_TTL = 15 * 60 * 1000 // 15 minutes

  static set(key: string, data: any, ttl: number = this.DEFAULT_TTL) {
    if (typeof window === 'undefined') return

    try {
      const cacheData = {
        data,
        expiry: Date.now() + ttl,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem(`${this.CACHE_PREFIX}-${key}`, JSON.stringify(cacheData))
    } catch (error) {
      console.warn('Failed to set cache:', error)
    }
  }

  static get(key: string): any | null {
    if (typeof window === 'undefined') return null

    try {
      const item = localStorage.getItem(`${this.CACHE_PREFIX}-${key}`)
      if (!item) return null

      const cacheData = JSON.parse(item)
      if (Date.now() > cacheData.expiry) {
        localStorage.removeItem(`${this.CACHE_PREFIX}-${key}`)
        return null
      }

      return cacheData.data
    } catch (error) {
      console.warn('Failed to get cache:', error)
      return null
    }
  }

  static clear(pattern?: string) {
    if (typeof window === 'undefined') return

    try {
      const keys = Object.keys(localStorage)
      const prefix = `${this.CACHE_PREFIX}-${pattern || ''}`
      
      keys.forEach(key => {
        if (key.startsWith(prefix)) {
          localStorage.removeItem(key)
        }
      })
    } catch (error) {
      console.warn('Failed to clear cache:', error)
    }
  }

  static clearAll() {
    this.clear()
  }
}

// Database query optimization
export const optimizeQuery = {
  // Add pagination to queries
  paginate: (page: number = 1, pageSize: number = 12) => ({
    from: (page - 1) * pageSize,
    to: page * pageSize - 1
  }),

  // Select only necessary fields
  selectFields: (fields: string[]) => fields.join(', '),

  // Add caching headers
  getCacheHeaders: (duration: number = 900) => ({
    'Cache-Control': `public, s-maxage=${duration}, stale-while-revalidate=${duration * 2}`,
    'CDN-Cache-Control': `public, s-maxage=${duration}`,
    'Vercel-CDN-Cache-Control': `public, s-maxage=${duration}`
  })
}

// Image optimization utilities
export const imageOptimization = {
  // Get optimized image URL
  getOptimizedUrl: (url: string, width: number = 400, quality: number = 80) => {
    if (!url || url.startsWith('data:') || url.startsWith('blob:')) {
      return url
    }
    
    // For external images, you might want to use a CDN or image optimization service
    // For now, return the original URL
    return url
  },

  // Lazy loading helper
  getLazyLoadingProps: (priority: boolean = false) => ({
    loading: priority ? 'eager' : 'lazy' as const,
    decoding: 'async' as const
  })
}

// Export usage tracking for components
export const trackUsage = {
  apiCall: (responseSize: number = 0) => {
    supabaseOptimizer.trackApiCall(responseSize)
  },

  getUsage: () => supabaseOptimizer.getUsage(),
  
  checkLimits: () => supabaseOptimizer.checkLimits(),
  
  getUsagePercentage: () => supabaseOptimizer.getUsagePercentage()
} 