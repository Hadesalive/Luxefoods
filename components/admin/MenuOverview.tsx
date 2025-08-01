"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAdmin } from "@/contexts/AdminContext"
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

export function MenuOverview() {
  const { menuItems } = useAdmin()

  const categoryData = [
    { name: "Pizza", count: menuItems.filter((item) => item.category === "pizza").length, color: "#6366f1" },
    { name: "Mini Pizza", count: menuItems.filter((item) => item.category === "mini-pizza").length, color: "#10b981" },
    { name: "Kebbeh", count: menuItems.filter((item) => item.category === "kebbeh").length, color: "#f59e0b" },
    { name: "Fataya", count: menuItems.filter((item) => item.category === "fataya").length, color: "#ef4444" },
  ]

  const availabilityData = [
    { name: "Available", count: menuItems.filter((item) => item.available).length, color: "#10b981" },
    { name: "Unavailable", count: menuItems.filter((item) => !item.available).length, color: "#ef4444" },
  ]

  const popularItems = menuItems.filter((item) => item.popular)

  return (
    <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-black dark:text-white">Menu Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Category Distribution */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Items by Category</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {categoryData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {entry.name}: {entry.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Availability Status */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Availability Status</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={availabilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" />
              </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {availabilityData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {entry.name}: {entry.count}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Popular Items */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Popular Items</h4>
            <div className="space-y-3">
              {popularItems.length > 0 ? (
                popularItems.slice(0, 6).map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div>
                      <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{item.name}</span>
                      <Badge variant="outline" className="ml-2 text-xs capitalize">
                        {item.category.replace("-", " ")}
                      </Badge>
                    </div>
                    <Badge className="bg-yellow-500 text-white text-xs">Popular</Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No popular items marked yet.</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
