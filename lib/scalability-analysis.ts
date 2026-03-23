/**
 * Scalability Analysis for LUXE FOOD
 * Supporting 5000 users/month on free tiers
 */

export const SCALABILITY_ANALYSIS = {
  // User behavior assumptions
  monthlyUsers: 5000,
  avgPagesPerUser: 4, // Home, Menu, Cart, Checkout
  avgApiCallsPerPage: 3, // Menu data, cart operations, order submission
  avgPageSizeKB: 2000, // 2MB per page (with images)

  // Calculated monthly usage
  monthlyPageViews: 5000 * 4, // 20,000 page views
  monthlyApiCalls: 5000 * 4 * 3, // 60,000 API calls
  monthlyBandwidthGB: (5000 * 4 * 2000) / (1024 * 1024), // ~38 GB

  // Service limits (FREE TIERS)
  vercelFree: {
    bandwidth: 100, // GB/month
    functionInvocations: 100 * 30, // 3,000/month (100/day)
    edgeFunctionInvocations: 6000, // /month
    deployments: 100, // /day
    limitation: "MAJOR BOTTLENECK: Function invocations too low",
  },

  supabaseFree: {
    database: 500, // MB
    bandwidth: 2, // GB/month
    monthlyActiveUsers: 50000,
    apiRequests: 500000, // /month
    limitation: "Database bandwidth might be tight",
  },

  vercelBlobFree: {
    storage: 1, // GB
    bandwidth: 100, // GB/month
    limitation: "Storage might be insufficient for many images",
  },

  // Verdict
  feasibility: {
    canSupport5000Users: false,
    mainBottlenecks: [
      "Vercel function invocations (3,000/month vs 60,000 needed)",
      "Supabase bandwidth (2GB vs ~5GB needed for DB operations)",
      "Image storage and delivery optimization needed",
    ],
    recommendedTier: "Vercel Pro ($20/month) + Supabase Pro ($25/month)",
    alternativeSolution: "Optimize for static generation and edge caching",
  },
}
