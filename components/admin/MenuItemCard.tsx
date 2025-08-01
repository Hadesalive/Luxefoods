"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Edit, Trash2, Star } from "lucide-react"
import { useAdmin } from "@/contexts/AdminContext"
import { EditMenuItemDialog } from "./EditMenuItemDialog"
import type { MenuItem } from "@/types/admin"

interface MenuItemCardProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { updateMenuItem, deleteMenuItem } = useAdmin()
  const [isEditOpen, setIsEditOpen] = useState(false)

  const handleToggleAvailability = () => {
    updateMenuItem(item.id, { available: !item.available })
  }

  const handleTogglePopular = () => {
    updateMenuItem(item.id, { popular: !item.popular })
  }

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      deleteMenuItem(item.id)
    }
  }

  const renderPrice = () => {
    if (typeof item.price === "number") {
      return `NLe${item.price.toFixed(2)}`
    } else {
      return Object.entries(item.price)
        .map(([size, price]) => `${size}: NLe${price.toFixed(2)}`)
        .join(", ")
    }
  }

  return (
    <>
      <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 relative">
          {item.image ? (
            <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-4xl">🍕</span>
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            {item.popular && (
              <Badge className="bg-yellow-500 text-white">
                <Star className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
            <Badge variant={item.available ? "default" : "secondary"}>
              {item.available ? "Available" : "Unavailable"}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-lg text-indigo-900 dark:text-indigo-100">{item.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.description}</p>
            </div>

            <div className="flex items-center justify-between">
              <Badge variant="outline" className="capitalize">
                {item.category.replace("-", " ")}
              </Badge>
              <span className="font-bold text-indigo-900 dark:text-indigo-100">{renderPrice()}</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch checked={item.available} onCheckedChange={handleToggleAvailability} size="sm" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Switch checked={item.popular} onCheckedChange={handleTogglePopular} size="sm" />
                  <span className="text-xs text-gray-600 dark:text-gray-400">Popular</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDelete}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EditMenuItemDialog item={item} open={isEditOpen} onOpenChange={setIsEditOpen} />
    </>
  )
}
