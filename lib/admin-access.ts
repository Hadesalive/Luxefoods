// Discreet admin access utilities

export const ADMIN_ACCESS_KEY = 'kb_admin_2024'

export function checkAdminAccess(): boolean {
  if (typeof window === 'undefined') return false
  
  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search)
  const adminParam = urlParams.get('access')
  
  if (adminParam === ADMIN_ACCESS_KEY) {
    // Store in session storage for this session
    sessionStorage.setItem('admin_access', 'true')
    return true
  }
  
  // Check session storage
  return sessionStorage.getItem('admin_access') === 'true'
}

export function getAdminUrl(): string {
  return `${window.location.origin}/login?access=${ADMIN_ACCESS_KEY}`
}

export function clearAdminAccess(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('admin_access')
  }
}

// Mobile-specific admin access methods
export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

export function getMobileAdminInstructions(): string {
  return `Mobile Admin Access:
1. Triple tap bottom right corner of screen
2. Long press (3 seconds) on any logo image
3. Add ?access=kb_admin_2024 to URL
4. Tap the 🔧 icon in footer (barely visible)`
} 