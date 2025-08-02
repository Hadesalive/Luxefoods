"use client"

import { useState } from "react"
import { User, Settings, LogOut, LayoutDashboard, Menu, Utensils, MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import ThemeToggle from "@/components/ThemeToggle"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"
import Image from "next/image"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, emoji: "📊" },
  { name: "Categories", href: "/admin/categories", icon: Menu, emoji: "🏷️" },
  { name: "Menu Items", href: "/admin/menu", icon: Utensils, emoji: "🍽️" },
]

export function AdminHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="bg-black dark:bg-gray-900 text-white sticky top-0 z-50 shadow-lg transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo and Brand */}
          <Link href="/admin" className="flex items-center space-x-2 lg:space-x-3">
            <div className="w-10 h-10 lg:w-12 lg:h-12 relative rounded-full overflow-hidden bg-white p-1 shadow-lg">
              <Image src="/images/logo.jpg" alt="Kings Bakery Logo" fill className="object-contain" />
            </div>
            <div className="hidden sm:block">
              <span className="text-base lg:text-xl font-bold">Kings Bakery</span>
              <div className="text-xs lg:text-sm text-yellow-300 dark:text-yellow-400 italic">
                Admin Panel
              </div>
            </div>
            <span className="sm:hidden text-base font-bold">Admin</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-gradient-to-r from-yellow-400/20 to-yellow-300/20 text-yellow-300 dark:text-yellow-400 border border-yellow-300/30 shadow-lg"
                      : "text-white hover:text-yellow-300 dark:hover:text-yellow-400 hover:bg-white/10 backdrop-blur-sm"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            <ThemeToggle />

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="relative h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 hover:border-yellow-300/40 transition-all duration-300"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700" align="end" forceMount>
                <DropdownMenuLabel className="font-normal text-white">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.email || "Admin User"}</p>
                    <p className="text-xs leading-none text-yellow-300/70">{user?.email || "admin@thekingsbakerysl.com"}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem className="text-white hover:bg-gray-800 focus:bg-gray-800">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700" />
                <DropdownMenuItem 
                  onClick={handleLogout}
                  className="text-white hover:bg-gray-800 focus:bg-gray-800"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-300/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center group border border-yellow-300/30"
                aria-label="Toggle menu"
              >
                <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                  <span
                    className={`block w-6 h-0.5 bg-yellow-300 transition-all duration-300 transform ${
                      isMobileMenuOpen ? "rotate-45 translate-y-0.5" : "-translate-y-1.5"
                    }`}
                  />
                  <span
                    className={`block w-6 h-0.5 bg-yellow-300 transition-all duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`block w-6 h-0.5 bg-yellow-300 transition-all duration-300 transform ${
                      isMobileMenuOpen ? "-rotate-45 -translate-y-0.5" : "translate-y-1.5"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-gradient-to-br from-black via-gray-900 to-black shadow-2xl border-t border-yellow-300/20 backdrop-blur-lg transition-colors duration-300">
            <nav className="py-6 px-4">
              <div className="flex flex-col space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "group flex items-center text-white transition-all duration-300 py-4 px-6 rounded-2xl backdrop-blur-sm",
                        isActive
                          ? "bg-gradient-to-r from-yellow-400/20 to-yellow-300/20 text-yellow-300 border border-yellow-300/30"
                          : "hover:text-yellow-300 hover:bg-white/10"
                      )}
                    >
                      <span className="text-2xl mr-4 group-hover:scale-110 transition-transform duration-300">
                        {item.emoji}
                      </span>
                      <span className="font-medium text-lg">{item.name}</span>
                    </Link>
                  )
                })}

                {/* User Info Section */}
                <div className="mt-4 pt-4 border-t border-yellow-300/20">
                  <div className="flex items-center text-white py-4 px-6 rounded-2xl bg-white/5 backdrop-blur-sm">
                    <User className="h-6 w-6 mr-4 text-yellow-300" />
                    <div>
                      <span className="font-medium text-lg block">{user?.email || "Admin User"}</span>
                      <span className="text-yellow-300/70 text-sm">Administrator</span>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={() => {
                    handleLogout()
                    setIsMobileMenuOpen(false)
                  }}
                  className="group flex items-center text-white hover:text-red-400 transition-all duration-300 py-4 px-6 rounded-2xl hover:bg-red-500/10 backdrop-blur-sm mt-2"
                >
                  <LogOut className="h-6 w-6 mr-4 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-medium text-lg">Log Out</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
