"use client"

import { useMenu } from "@/contexts/MenuContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QRCodeGenerator } from "@/components/admin/QRCodeGenerator"
import { 
  Plus, 
  Utensils, 
  Tag, 
  TrendingUp, 
  Star,
  Edit,
  Trash2,
  Eye
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function AdminDashboard() {
  const { categories, menuItems, isLoading } = useMenu()

  const stats = {
    totalCategories: categories.length,
    totalMenuItems: menuItems.length,
    popularItems: menuItems.filter(item => item.is_popular).length,
    availableItems: menuItems.filter(item => item.is_available).length,
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <h1 className="text-3xl lg:text-4xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">
          🍽️ Menu Management
        </h1>
        <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Manage your restaurant menu, categories, and menu items with ease
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-100 text-sm font-medium">Total Categories</p>
                <p className="text-2xl font-bold">{stats.totalCategories}</p>
              </div>
              <Tag className="h-8 w-8 text-indigo-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Menu Items</p>
                <p className="text-2xl font-bold">{stats.totalMenuItems}</p>
              </div>
              <Utensils className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Popular Items</p>
                <p className="text-2xl font-bold">{stats.popularItems}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Available Items</p>
                <p className="text-2xl font-bold">{stats.availableItems}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl lg:text-2xl text-indigo-900 dark:text-indigo-100 flex items-center gap-3">
              <Tag className="h-5 w-5 lg:h-6 lg:w-6" />
              Category Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
              Organize your menu with categories. Create, edit, and manage menu categories.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full sm:w-auto" asChild>
                <Link href="/admin/categories">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Link>
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/admin/categories">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-xl lg:text-2xl text-indigo-900 dark:text-indigo-100 flex items-center gap-3">
              <Utensils className="h-5 w-5 lg:h-6 lg:w-6" />
              Menu Items
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm lg:text-base">
              Manage your menu items, prices, and availability. Add new dishes and update existing ones.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto" asChild>
                <Link href="/admin/menu">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Menu Item
                </Link>
              </Button>
              <Button variant="outline" className="w-full sm:w-auto" asChild>
                <Link href="/admin/menu">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* QR Code Generator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <QRCodeGenerator />
      </motion.div>

      {/* Recent Menu Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <CardHeader>
            <CardTitle className="text-xl lg:text-2xl text-indigo-900 dark:text-indigo-100">
              Recent Menu Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.category?.name}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost">
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      NLe {item.price}
                    </span>
                    <div className="flex gap-1">
                      {item.is_popular && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                      {!item.is_available && (
                        <Badge variant="destructive">Unavailable</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {menuItems.length === 0 && (
              <div className="text-center py-8">
                <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No menu items yet</p>
                <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Menu Item
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
