/**
 * Cost Optimization Strategies for Free Tier Usage
 */

export const OPTIMIZATION_STRATEGIES = {
  // 1. Reduce Function Invocations
  staticGeneration: {
    strategy: "Use Next.js Static Site Generation (SSG)",
    implementation: [
      "Generate menu pages at build time",
      "Use revalidate for periodic updates",
      "Cache API responses aggressively",
    ],
    impact: "Reduces function calls by 80%",
  },

  // 2. Optimize Database Usage
  databaseOptimization: {
    strategy: "Minimize database queries",
    implementation: [
      "Use in-memory caching for menu items",
      "Batch operations where possible",
      "Use JSONB for flexible data storage",
      "Implement connection pooling",
    ],
    impact: "Reduces DB bandwidth by 60%",
  },

  // 3. Image Optimization
  imageOptimization: {
    strategy: "Optimize image delivery",
    implementation: [
      "Use Next.js Image component with optimization",
      "Implement lazy loading",
      "Use WebP format with fallbacks",
      "Consider external CDN for images",
    ],
    impact: "Reduces bandwidth by 70%",
  },

  // 4. Edge Caching
  edgeCaching: {
    strategy: "Leverage Vercel Edge Network",
    implementation: [
      "Use Edge Functions for static content",
      "Implement proper cache headers",
      "Use SWR for client-side caching",
    ],
    impact: "Reduces origin requests by 90%",
  },
}

// Realistic usage calculation with optimizations
export const OPTIMIZED_USAGE = {
  monthlyUsers: 5000,

  // With optimizations
  functionInvocations: 5000, // Down from 60,000 (orders + admin actions only)
  bandwidth: 25, // GB (down from 38GB with image optimization)
  databaseBandwidth: 1.5, // GB (down from 5GB with caching)

  feasibility: {
    vercelFree: "POSSIBLE with heavy optimization",
    supabaseFree: "TIGHT but manageable",
    recommendation: "Start with free tiers, upgrade when needed",
  },
}
