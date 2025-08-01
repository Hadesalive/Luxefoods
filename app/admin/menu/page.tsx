"use client"

import { useState } from "react"
import { useMenu } from "@/contexts/MenuContext"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Plus, 
  Search, 
  Utensils,
  Edit,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Tag,
  Grid3X3,
  List,
  X
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"

export default function MenuManagement() {
  const { menuItems, categories, deleteMenuItem, updateMenuItem, addMenuItem, isLoading } = useMenu()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image_url: "",
    category_id: "",
    is_available: true,
    is_popular: false,
  })
  const [addFormData, setAddFormData] = useState({
    name: "",
    description: "",
    price: 0,
    image_url: "",
    category_id: "",
    is_available: true,
    is_popular: false,
    sort_order: 0,
  })
  
  // Size options for the menu item
  const [sizes, setSizes] = useState([
    { size_name: "Regular", price: 0, is_default: true }
  ])
  
  // Custom options (like grilled vs fried chicken)
  const [customOptions, setCustomOptions] = useState([
    { name: "", price_adjustment: 0 }
  ])

  // Edit size options
  const [editSizes, setEditSizes] = useState([
    { size_name: "Regular", price: 0, is_default: true }
  ])
  
  // Edit custom options
  const [editCustomOptions, setEditCustomOptions] = useState([
    { name: "", price_adjustment: 0 }
  ])

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)

  const filteredItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || item.category?.slug === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setEditFormData({
      name: item.name,
      description: item.description || "",
      price: item.price,
      image_url: item.image_url || "",
      category_id: item.category_id || "",
      is_available: item.is_available,
      is_popular: item.is_popular,
    })
    
    // Set edit sizes from existing data
    if (item.sizes && item.sizes.length > 0) {
      setEditSizes(item.sizes.map((size: any) => ({
        id: size.id,
        size_name: size.size_name,
        price: size.price,
        is_default: size.is_default
      })))
    } else {
      setEditSizes([{ size_name: "Regular", price: 0, is_default: true }])
    }
    
    // Set edit custom options from existing data
    if (item.options && item.options.length > 0) {
      setEditCustomOptions(item.options.map((option: any) => ({
        id: option.id,
        name: option.option_name,
        price_adjustment: option.price_adjustment,
        sort_order: option.sort_order || 0
      })))
    } else {
      setEditCustomOptions([{ name: "", price_adjustment: 0 }])
    }
    
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditSubmitting(true)
    try {
      // Update the main menu item
      await updateMenuItem(editingItem.id, editFormData)
      
      // TODO: Update sizes and options
      // This would require additional API endpoints or methods to update sizes/options
      // For now, we'll just update the main item
      
      setIsEditDialogOpen(false)
      setEditingItem(null)
    } catch (error) {
      console.error("Error updating menu item:", error)
    } finally {
      setIsEditSubmitting(false)
    }
  }

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Calculate the default price from size options
      const defaultSize = sizes.find(size => size.is_default)
      const defaultPrice = defaultSize ? defaultSize.price : 0
      
      // Create menu item data with the calculated default price
      const menuItemData = {
        ...addFormData,
        price: defaultPrice
      }
      
      await addMenuItem(menuItemData, sizes, customOptions)
      setIsAddDialogOpen(false)
      setAddFormData({
        name: "",
        description: "",
        price: 0,
        image_url: "",
        category_id: "",
        is_available: true,
        is_popular: false,
        sort_order: 0,
      })
      setSizes([{ size_name: "Regular", price: 0, is_default: true }])
      setCustomOptions([{ name: "", price_adjustment: 0 }])
    } catch (error) {
      console.error("Error adding menu item:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this menu item?")) {
      try {
        await deleteMenuItem(id)
      } catch (error) {
        console.error("Error deleting menu item:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black dark:border-white mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading menu items...</p>
        </div>
      </div>
    )
  }

  // Debug info
  console.log("Menu items:", menuItems)
  console.log("Categories:", categories)
  console.log("Filtered items:", filteredItems)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-black dark:text-white mb-2">
            🍽️ Menu Items
          </h1>
          <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400">
            Manage your restaurant menu items and pricing
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white w-full lg:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add New Menu Item</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddSubmit} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="add-name">Name</Label>
                      <Input
                        id="add-name"
                        value={addFormData.name}
                        onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                        placeholder="Menu item name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="add-category">Category</Label>
                      <Select
                        value={addFormData.category_id}
                        onValueChange={(value) => setAddFormData({ ...addFormData, category_id: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="add-description">Description</Label>
                    <Textarea
                      id="add-description"
                      value={addFormData.description}
                      onChange={(e) => setAddFormData({ ...addFormData, description: e.target.value })}
                      placeholder="Brief description"
                      rows={3}
                    />
                  </div>
                  
                  <ImageUpload
                    value={addFormData.image_url}
                    onChange={(url) => setAddFormData({ ...addFormData, image_url: url })}
                    label="Item Image"
                    placeholder="https://example.com/image.jpg or upload a file"
                  />

                  {/* Size Options */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Size Options</Label>
                    {sizes.map((size, index) => (
                      <div key={index} className="flex gap-3 items-end">
                        <div className="flex-1">
                          <Label>Size Name</Label>
                          <Input
                            value={size.size_name}
                            onChange={(e) => {
                              const newSizes = [...sizes]
                              newSizes[index].size_name = e.target.value
                              setSizes(newSizes)
                            }}
                            placeholder="e.g., Small, Medium, Large"
                          />
                        </div>
                        <div className="w-24">
                          <Label>Price</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={size.price}
                            onChange={(e) => {
                              const newSizes = [...sizes]
                              newSizes[index].price = parseFloat(e.target.value) || 0
                              setSizes(newSizes)
                            }}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={size.is_default}
                            onCheckedChange={(checked) => {
                              const newSizes = sizes.map((s, i) => ({
                                ...s,
                                is_default: i === index ? checked : false
                              }))
                              setSizes(newSizes)
                            }}
                          />
                          <Label className="text-sm">Default</Label>
                        </div>
                        {sizes.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSizes(sizes.filter((_, i) => i !== index))
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSizes([...sizes, { size_name: "", price: 0, is_default: false }])}
                    >
                      + Add Size Option
                    </Button>
                  </div>

                  {/* Custom Options */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">Custom Options (e.g., Grilled vs Fried Chicken)</Label>
                    {customOptions.map((option, index) => (
                      <div key={index} className="flex gap-3 items-end">
                        <div className="flex-1">
                          <Label>Option Name</Label>
                          <Input
                            value={option.name}
                            onChange={(e) => {
                              const newOptions = [...customOptions]
                              newOptions[index].name = e.target.value
                              setCustomOptions(newOptions)
                            }}
                            placeholder="e.g., Grilled Chicken, Fried Chicken"
                          />
                        </div>
                        <div className="w-24">
                          <Label>Price Adjustment</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={option.price_adjustment}
                            onChange={(e) => {
                              const newOptions = [...customOptions]
                              newOptions[index].price_adjustment = parseFloat(e.target.value) || 0
                              setCustomOptions(newOptions)
                            }}
                            placeholder="+/- 0.00"
                          />
                        </div>
                        {customOptions.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setCustomOptions(customOptions.filter((_, i) => i !== index))
                            }}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setCustomOptions([...customOptions, { name: "", price_adjustment: 0 }])}
                    >
                      + Add Custom Option
                    </Button>
                  </div>

                  {/* Settings */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="add-available"
                        checked={addFormData.is_available}
                        onCheckedChange={(checked) => setAddFormData({ ...addFormData, is_available: checked })}
                      />
                      <Label htmlFor="add-available">Available</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="add-popular"
                        checked={addFormData.is_popular}
                        onCheckedChange={(checked) => setAddFormData({ ...addFormData, is_popular: checked })}
                      />
                      <Label htmlFor="add-popular">Popular</Label>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Adding...
                        </>
                      ) : (
                        "Add Menu Item"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
        </Dialog>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-black to-gray-800 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/90 text-sm font-medium">Total Items</p>
                <p className="text-2xl font-bold">{menuItems.length}</p>
              </div>
              <Utensils className="h-8 w-8 text-white/80" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Available</p>
                <p className="text-2xl font-bold">{menuItems.filter(item => item.is_available).length}</p>
              </div>
              <Eye className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Popular</p>
                <p className="text-2xl font-bold">{menuItems.filter(item => item.is_popular).length}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Categories</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <Tag className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="space-y-4"
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
              size="sm"
              className={cn(
                "px-3 py-1 rounded-lg font-medium transition-all duration-200 text-sm",
                selectedCategory === "all"
                  ? "bg-black text-white shadow-lg shadow-black/20 dark:shadow-black/20"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              )}
            >
              All Items
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.slug ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.slug)}
                size="sm"
                className={cn(
                  "px-3 py-1 rounded-lg font-medium transition-all duration-200 text-sm",
                  selectedCategory === category.slug
                    ? "bg-black text-white shadow-lg shadow-black/20 dark:shadow-black/20"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                )}
              >
                {category.name}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="px-3 py-1"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="px-3 py-1"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Menu Items Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className={cn(
          "gap-4 lg:gap-6",
          viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "flex flex-col space-y-4"
        )}
      >
        {filteredItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
              <CardContent className="p-4 lg:p-6">
                <div className="relative h-40 lg:h-48 mb-4 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                  <Image
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="bg-white/80 hover:bg-white hover:bg-white/90"
                      onClick={() => handleEdit(item)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="bg-white/80 hover:bg-white text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  {item.is_popular && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Popular
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-bold text-black dark:text-white">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {item.category?.name}
                    </p>
                  </div>

                  {item.description && (
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                      {item.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-black dark:text-white">
                      NLe {item.price}
                    </span>
                    <div className="flex gap-2">
                      {item.is_available ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                          <Eye className="h-3 w-3 mr-1" />
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <EyeOff className="h-3 w-3 mr-1" />
                          Unavailable
                        </Badge>
                      )}
                    </div>
                  </div>

                  {item.sizes && item.sizes.length > 0 && (
                    <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Available Sizes:</p>
                      <div className="flex gap-2">
                        {item.sizes.map((size) => (
                          <Badge key={size.id} variant="outline" className="text-xs">
                            {size.size_name}: NLe {size.price}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredItems.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center py-12"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 max-w-md mx-auto">
            <CardContent className="p-8">
              <Utensils className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {menuItems.length === 0 ? "No Menu Items Yet" : "No Items Found"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                {menuItems.length === 0 
                  ? "Create your first menu item to get started"
                  : searchTerm || selectedCategory !== "all" 
                    ? "No items match your search criteria."
                    : "No items in this category"
                }
              </p>
              <Button className="bg-black hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                {menuItems.length === 0 ? "Add Your First Menu Item" : "Add Menu Item"}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Edit Menu Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  placeholder="Menu item name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={editFormData.category_id}
                  onValueChange={(value) => setEditFormData({ ...editFormData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                placeholder="Brief description of the menu item"
                rows={3}
              />
            </div>

            {/* Image Upload */}
            <ImageUpload
              value={editFormData.image_url}
              onChange={(url) => setEditFormData({ ...editFormData, image_url: url })}
              label="Item Image"
              placeholder="https://example.com/image.jpg or upload a file"
            />

            {/* Size Options Section */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Size Options</Label>
              {editSizes.map((size, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <Input
                      placeholder="Size name (e.g., Small, Medium, Large)"
                      value={size.size_name}
                      onChange={(e) => {
                        const newSizes = [...editSizes]
                        newSizes[index].size_name = e.target.value
                        setEditSizes(newSizes)
                      }}
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      value={size.price || ""}
                      onChange={(e) => {
                        const value = e.target.value
                        const numValue = value === "" ? 0 : parseFloat(value)
                        const newSizes = [...editSizes]
                        newSizes[index].price = isNaN(numValue) ? 0 : numValue
                        setEditSizes(newSizes)
                      }}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={size.is_default}
                      onCheckedChange={(checked) => {
                        const newSizes = editSizes.map((s, i) => ({
                          ...s,
                          is_default: i === index ? checked : false
                        }))
                        setEditSizes(newSizes)
                      }}
                    />
                    <Label className="text-sm">Default</Label>
                  </div>
                  {editSizes.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newSizes = editSizes.filter((_, i) => i !== index)
                        setEditSizes(newSizes)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditSizes([...editSizes, { size_name: "", price: 0, is_default: false }])}
              >
                + Add Size Option
              </Button>
            </div>

            {/* Custom Options Section */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Custom Options (e.g., Grilled vs Fried Chicken)</Label>
              {editCustomOptions.map((option, index) => (
                <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <Input
                      placeholder="Option name (e.g., Grilled Chicken, Fried Chicken)"
                      value={option.name}
                      onChange={(e) => {
                        const newOptions = [...editCustomOptions]
                        newOptions[index].name = e.target.value
                        setEditCustomOptions(newOptions)
                      }}
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Price +/–"
                      value={option.price_adjustment || ""}
                      onChange={(e) => {
                        const value = e.target.value
                        const numValue = value === "" ? 0 : parseFloat(value)
                        const newOptions = [...editCustomOptions]
                        newOptions[index].price_adjustment = isNaN(numValue) ? 0 : numValue
                        setEditCustomOptions(newOptions)
                      }}
                    />
                  </div>
                  {editCustomOptions.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newOptions = editCustomOptions.filter((_, i) => i !== index)
                        setEditCustomOptions(newOptions)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditCustomOptions([...editCustomOptions, { name: "", price_adjustment: 0 }])}
              >
                + Add Custom Option
              </Button>
            </div>

            {/* Settings */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-available"
                  checked={editFormData.is_available}
                  onCheckedChange={(checked) => setEditFormData({ ...editFormData, is_available: checked })}
                />
                <Label htmlFor="edit-available">Available</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="edit-popular"
                  checked={editFormData.is_popular}
                  onCheckedChange={(checked) => setEditFormData({ ...editFormData, is_popular: checked })}
                />
                <Label htmlFor="edit-popular">Popular</Label>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isEditSubmitting} className="flex-1">
                {isEditSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  "Update Menu Item"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
