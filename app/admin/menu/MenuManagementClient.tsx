"use client"

import { useState } from "react"
import { useMenu } from "@/contexts/MenuContext"
import { MenuService } from "@/lib/menu-service"
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

export default function MenuManagementClient() {
  const { menuItems, categories, deleteMenuItem, updateMenuItem, addMenuItem, isLoading } = useMenu()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("sort_order")
  const [editingItem, setEditingItem] = useState<any>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
    is_available: true,
    is_popular: false,
    sort_order: "",
  })
  const [addFormData, setAddFormData] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    category_id: "",
    is_available: true,
    is_popular: false,
    sort_order: "",
  })
  
  // Size options for the menu item
  const [sizes, setSizes] = useState([
    { size_name: "Regular", price: "", is_default: true }
  ])
  
  // Custom options (like grilled vs fried chicken)
  const [customOptions, setCustomOptions] = useState([
    { name: "", price_adjustment: "" }
  ])

  // Toggles for enabling sizes and options
  const [enableSizes, setEnableSizes] = useState(false)
  const [enableOptions, setEnableOptions] = useState(false)

  // Edit size options
  const [editSizes, setEditSizes] = useState([
    { size_name: "Regular", price: "", is_default: true }
  ])
  
  // Edit custom options
  const [editCustomOptions, setEditCustomOptions] = useState([
    { name: "", price_adjustment: "" }
  ])

  // Edit toggles
  const [editEnableSizes, setEditEnableSizes] = useState(false)
  const [editEnableOptions, setEditEnableOptions] = useState(false)

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)

  // Helper functions for managing sizes
  const addSize = () => {
    setSizes([...sizes, { size_name: "", price: "", is_default: false }])
  }

  const removeSize = (index: number) => {
    const newSizes = sizes.filter((_, i) => i !== index)
    // If we're removing the last size and toggle is on, add a default size
    if (newSizes.length === 0 && enableSizes) {
      setSizes([{ size_name: "Regular", price: "", is_default: true }])
    } else {
      setSizes(newSizes)
    }
  }

  const updateSize = (index: number, field: string, value: any) => {
    const newSizes = [...sizes]
    newSizes[index] = { ...newSizes[index], [field]: value }
    setSizes(newSizes)
  }

  // Helper functions for managing custom options
  const addOption = () => {
    setCustomOptions([...customOptions, { name: "", price_adjustment: "" }])
  }

  const removeOption = (index: number) => {
    const newOptions = customOptions.filter((_, i) => i !== index)
    // If we're removing the last option and toggle is on, add a default empty option
    if (newOptions.length === 0 && enableOptions) {
      setCustomOptions([{ name: "", price_adjustment: "" }])
    } else {
      setCustomOptions(newOptions)
    }
  }

  const updateOption = (index: number, field: string, value: any) => {
    const newOptions = [...customOptions]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setCustomOptions(newOptions)
  }

  // Helper functions for edit form
  const addEditSize = () => {
    setEditSizes([...editSizes, { size_name: "", price: "", is_default: false }])
  }

  const removeEditSize = (index: number) => {
    const newSizes = editSizes.filter((_, i) => i !== index)
    // If we're removing the last size and toggle is on, add a default size
    if (newSizes.length === 0 && editEnableSizes) {
      setEditSizes([{ size_name: "Regular", price: "", is_default: true }])
    } else {
      setEditSizes(newSizes)
    }
  }

  const updateEditSize = (index: number, field: string, value: any) => {
    const newSizes = [...editSizes]
    newSizes[index] = { ...newSizes[index], [field]: value }
    setEditSizes(newSizes)
  }

  const addEditOption = () => {
    setEditCustomOptions([...editCustomOptions, { name: "", price_adjustment: "" }])
  }

  const removeEditOption = (index: number) => {
    const newOptions = editCustomOptions.filter((_, i) => i !== index)
    // If we're removing the last option and toggle is on, add a default empty option
    if (newOptions.length === 0 && editEnableOptions) {
      setEditCustomOptions([{ name: "", price_adjustment: "" }])
    } else {
      setEditCustomOptions(newOptions)
    }
  }

  const updateEditOption = (index: number, field: string, value: any) => {
    const newOptions = [...editCustomOptions]
    newOptions[index] = { ...newOptions[index], [field]: value }
    setEditCustomOptions(newOptions)
  }

  const filteredItems = menuItems
    .filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || item.category?.slug === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "sort_order":
          return (a.sort_order || 0) - (b.sort_order || 0)
        case "name":
          return a.name.localeCompare(b.name)
        case "price_low":
          return (a.price || 0) - (b.price || 0)
        case "price_high":
          return (b.price || 0) - (a.price || 0)
        case "newest":
          return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        case "oldest":
          return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
        default:
          return (a.sort_order || 0) - (b.sort_order || 0)
      }
    })

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setEditFormData({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      image_url: item.image_url || "",
      category_id: item.category_id || "",
      is_available: item.is_available,
      is_popular: item.is_popular,
      sort_order: item.sort_order?.toString() || "0",
    })
    
    // Load existing sizes and options
    if (item.sizes && item.sizes.length > 0) {
      setEditSizes(item.sizes.map((size: any) => ({
        size_name: size.size_name,
        price: size.price.toString(),
        is_default: size.is_default
      })))
      setEditEnableSizes(true)
    } else {
      setEditSizes([{ size_name: "Regular", price: "", is_default: true }])
      setEditEnableSizes(false)
    }
    
    if (item.options && item.options.length > 0) {
      setEditCustomOptions(item.options.map((option: any) => ({
        name: option.option_name,
        price_adjustment: option.price_adjustment.toString()
      })))
      setEditEnableOptions(true)
    } else {
      setEditCustomOptions([{ name: "", price_adjustment: "" }])
      setEditEnableOptions(false)
    }
    
    setIsEditDialogOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsEditSubmitting(true)
    
    try {
      const formDataToSubmit = {
        ...editFormData,
        price: parseFloat(editFormData.price) || 0,
        sort_order: parseInt(editFormData.sort_order) || 0,
      }
      
      // Convert size and option prices to numbers
      const sizesToSubmit = editEnableSizes ? editSizes
        .filter(size => size.size_name.trim())
        .map(size => ({
          ...size,
          price: parseFloat(size.price) || 0
        })) : []
      
      const optionsToSubmit = editEnableOptions ? editCustomOptions
        .filter(option => option.name.trim())
        .map(option => ({
          ...option,
          price_adjustment: parseFloat(option.price_adjustment) || 0
        })) : []
      
      // Update the menu item with sizes and options
      await updateMenuItem(
        editingItem.id, 
        formDataToSubmit,
        sizesToSubmit,
        optionsToSubmit
      )
      
      setIsEditDialogOpen(false)
      setEditingItem(null)
      setEditFormData({
        name: "",
        description: "",
        price: "",
        image_url: "",
        category_id: "",
        is_available: true,
        is_popular: false,
        sort_order: "",
      })
      setSortBy("sort_order")
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
      const formDataToSubmit = {
        ...addFormData,
        price: parseFloat(addFormData.price) || 0,
        sort_order: parseInt(addFormData.sort_order) || 0,
      }
      
      // Convert size and option prices to numbers
      const sizesToSubmit = enableSizes ? sizes
        .filter(size => size.size_name.trim())
        .map(size => ({
          ...size,
          price: parseFloat(size.price) || 0
        })) : undefined
      
      const optionsToSubmit = enableOptions ? customOptions
        .filter(option => option.name.trim())
        .map(option => ({
          ...option,
          price_adjustment: parseFloat(option.price_adjustment) || 0
        })) : undefined
      
      // Add the menu item with sizes and options
      await addMenuItem(
        formDataToSubmit,
        sizesToSubmit,
        optionsToSubmit
      )
      
      setIsAddDialogOpen(false)
      setAddFormData({
        name: "",
        description: "",
        price: "",
        image_url: "",
        category_id: "",
        is_available: true,
        is_popular: false,
        sort_order: "",
      })
      setSizes([{ size_name: "Regular", price: "", is_default: true }])
      setCustomOptions([{ name: "", price_adjustment: "" }])
      setEnableSizes(false)
      setEnableOptions(false)
      setSortBy("sort_order")
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading menu items...</p>
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
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">
            🍽️ Menu Management
          </h1>
          <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400">
            Manage your restaurant menu items, prices, and availability
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add Menu Item
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[98vw] max-w-2xl max-h-[95vh] overflow-y-auto p-3 sm:p-4 md:p-6 mx-2">
            <DialogHeader className="pb-3 sm:pb-4">
              <DialogTitle className="text-lg sm:text-xl md:text-2xl">Add New Menu Item</DialogTitle>
            </DialogHeader>
                         <form onSubmit={handleAddSubmit} className="space-y-3 sm:space-y-4">
               <div className="space-y-3 sm:space-y-4">
                 <div>
                   <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                   <Input
                     id="name"
                     value={addFormData.name}
                     onChange={(e) => setAddFormData({ ...addFormData, name: e.target.value })}
                     className="mt-1 h-11 sm:h-10 text-base"
                     required
                   />
                 </div>
                 <div>
                   <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                   <Select
                     value={addFormData.category_id}
                     onValueChange={(value) => setAddFormData({ ...addFormData, category_id: value })}
                   >
                     <SelectTrigger className="mt-1 h-11 sm:h-10 text-base">
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
                 <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                 <Textarea
                   id="description"
                   value={addFormData.description}
                   onChange={(e) => setAddFormData({ ...addFormData, description: e.target.value })}
                   rows={3}
                   className="mt-1 text-base"
                 />
               </div>
               <div className="space-y-3 sm:space-y-4 sm:grid sm:grid-cols-2 sm:gap-4">
                 <div>
                   <Label htmlFor="price" className="text-sm font-medium">Price (NLe)</Label>
                   <Input
                     id="price"
                     type="number"
                     step="0.01"
                     value={addFormData.price}
                     onChange={(e) => setAddFormData({ ...addFormData, price: e.target.value })}
                     className="mt-1 h-11 sm:h-10 text-base"
                     required
                   />
                 </div>
                 <div>
                   <Label htmlFor="sort_order" className="text-sm font-medium">Sort Order</Label>
                   <Input
                     id="sort_order"
                     type="number"
                     value={addFormData.sort_order}
                     onChange={(e) => setAddFormData({ ...addFormData, sort_order: e.target.value })}
                     className="mt-1 h-11 sm:h-10 text-base"
                   />
                 </div>
               </div>
              <div>
                <Label className="text-sm font-medium">Image</Label>
                <ImageUpload
                  value={addFormData.image_url}
                  onChange={(url) => setAddFormData({ ...addFormData, image_url: url })}
                  label="Menu Item Image"
                  className="mt-1"
                />
              </div>
                             <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:items-center sm:gap-4">
                 <div className="flex items-center space-x-2">
                   <Switch
                     id="available"
                     checked={addFormData.is_available}
                     onCheckedChange={(checked) => setAddFormData({ ...addFormData, is_available: checked })}
                   />
                   <Label htmlFor="available" className="text-sm">Available</Label>
                 </div>
                 <div className="flex items-center space-x-2">
                   <Switch
                     id="popular"
                     checked={addFormData.is_popular}
                     onCheckedChange={(checked) => setAddFormData({ ...addFormData, is_popular: checked })}
                   />
                   <Label htmlFor="popular" className="text-sm">Popular</Label>
                 </div>
               </div>

               {/* Size Management */}
               <div className="space-y-3">
                 <div className="flex items-center space-x-2">
                   <Switch
                     id="enableSizes"
                     checked={enableSizes}
                     onCheckedChange={(checked) => {
                       setEnableSizes(checked)
                       // If turning off, reset to default size
                       if (!checked) {
                         setSizes([{ size_name: "Regular", price: "", is_default: true }])
                       }
                     }}
                   />
                   <Label htmlFor="enableSizes" className="text-sm font-medium">Enable Size Variations</Label>
                 </div>
                 
                 {enableSizes && (
                   <div className="space-y-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                     <div className="flex items-center justify-between">
                       <Label className="text-sm font-medium">Size Options</Label>
                       <Button type="button" onClick={addSize} size="sm" variant="outline">
                         <Plus className="h-4 w-4 mr-1" />
                         Add Size
                       </Button>
                     </div>
                     
                     {sizes.map((size, index) => (
                       <div key={index} className="flex items-center gap-2 p-3 border rounded bg-white dark:bg-gray-700">
                         <Input
                           placeholder="Size name (e.g., Small, Medium, Large)"
                           value={size.size_name}
                           onChange={(e) => updateSize(index, 'size_name', e.target.value)}
                           className="flex-1"
                         />
                         <Input
                           type="number"
                           step="0.01"
                           placeholder="Price"
                           value={size.price}
                           onChange={(e) => updateSize(index, 'price', parseFloat(e.target.value) || "")}
                           className="w-24"
                         />
                         <div className="flex items-center space-x-2">
                           <input
                             type="radio"
                             name="defaultSize"
                             checked={size.is_default}
                             onChange={() => {
                               setSizes(sizes.map((s, i) => ({
                                 ...s,
                                 is_default: i === index
                               })))
                             }}
                           />
                           <Label className="text-xs">Default</Label>
                         </div>
                         {sizes.length > 1 && (
                           <Button
                             type="button"
                             onClick={() => removeSize(index)}
                             size="sm"
                             variant="destructive"
                           >
                             <X className="h-4 w-4" />
                           </Button>
                         )}
                       </div>
                     ))}
                   </div>
                 )}
               </div>

               {/* Custom Options Management */}
               <div className="space-y-3">
                 <div className="flex items-center space-x-2">
                   <Switch
                     id="enableOptions"
                     checked={enableOptions}
                     onCheckedChange={(checked) => {
                       setEnableOptions(checked)
                       // If turning off, clear the options
                       if (!checked) {
                         setCustomOptions([{ name: "", price_adjustment: "" }])
                       }
                     }}
                   />
                   <Label htmlFor="enableOptions" className="text-sm font-medium">Enable Custom Options</Label>
                 </div>
                 
                 {enableOptions && (
                   <div className="space-y-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                     <div className="flex items-center justify-between">
                       <Label className="text-sm font-medium">Custom Options</Label>
                       <Button type="button" onClick={addOption} size="sm" variant="outline">
                         <Plus className="h-4 w-4 mr-1" />
                         Add Option
                       </Button>
                     </div>
                     
                     {customOptions.map((option, index) => (
                       <div key={index} className="flex items-center gap-2 p-3 border rounded bg-white dark:bg-gray-700">
                         <Input
                           placeholder="Option name (e.g., Grilled Chicken, Fried Chicken)"
                           value={option.name}
                           onChange={(e) => updateOption(index, 'name', e.target.value)}
                           className="flex-1"
                         />
                         <Input
                           type="number"
                           step="0.01"
                           placeholder="Price adjustment"
                           value={option.price_adjustment}
                           onChange={(e) => updateOption(index, 'price_adjustment', parseFloat(e.target.value) || "")}
                           className="w-32"
                         />
                         {customOptions.length > 1 && (
                           <Button
                             type="button"
                             onClick={() => removeOption(index)}
                             size="sm"
                             variant="destructive"
                           >
                             <X className="h-4 w-4" />
                           </Button>
                         )}
                       </div>
                     ))}
                   </div>
                 )}
               </div>
               <div className="flex flex-col gap-2 pt-4">
                 <Button type="submit" disabled={isSubmitting} className="w-full h-12 text-base">
                   {isSubmitting ? "Adding..." : "Add Menu Item"}
                 </Button>
                 <Button type="button" variant="outline" onClick={() => {
                   setIsAddDialogOpen(false)
                   // Reset form when closing
                   setAddFormData({
                     name: "",
                     description: "",
                     price: "",
                     image_url: "",
                     category_id: "",
                     is_available: true,
                     is_popular: false,
                     sort_order: "",
                   })
                   setSizes([{ size_name: "Regular", price: "", is_default: true }])
                   setCustomOptions([{ name: "", price_adjustment: "" }])
                   setEnableSizes(false)
                   setEnableOptions(false)
                   setSortBy("sort_order")
                 }} className="w-full h-12 text-base">
                   Cancel
                 </Button>
               </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col lg:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 sm:h-10 text-base"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full lg:w-48 h-11 sm:h-10 text-base">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.slug} value={category.slug}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full lg:w-48 h-11 sm:h-10 text-base">
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="sort_order">Sort Order</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
            <SelectItem value="price_low">Price (Low to High)</SelectItem>
            <SelectItem value="price_high">Price (High to Low)</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
            className="h-11 sm:h-10 px-3"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
            className="h-11 sm:h-10 px-3"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* Menu Items Grid/List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="relative h-48 bg-gray-100 dark:bg-gray-800">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Utensils className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <Button size="sm" variant="secondary" onClick={() => handleEdit(item)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  {!item.is_available && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <Badge variant="destructive">Unavailable</Badge>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate flex-1">
                      {item.name}
                    </h3>
                    {item.is_popular && (
                      <Star className="h-4 w-4 text-yellow-500 ml-2" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                      NLe {item.price}
                    </span>
                    <div className="flex gap-1">
                      {item.category && (
                        <Badge variant="outline" className="text-xs">
                          {item.category.name}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        Order: {item.sort_order || 0}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Size and Options Info */}
                  {(item.sizes?.length > 0 || item.options?.length > 0) && (
                    <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      {item.sizes?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Sizes:</span>
                          {item.sizes.slice(0, 3).map((size, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {size.size_name} (NLe{size.price})
                            </Badge>
                          ))}
                          {item.sizes.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.sizes.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}
                      
                      {item.options?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          <span className="text-xs text-gray-500 dark:text-gray-400">Options:</span>
                          {item.options.slice(0, 2).map((option, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {option.option_name}
                            </Badge>
                          ))}
                          {item.options.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.options.length - 2} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-all duration-300">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Utensils className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {item.name}
                        </h3>
                        {item.is_popular && (
                          <Star className="h-4 w-4 text-yellow-500" />
                        )}
                        {!item.is_available && (
                          <Badge variant="destructive" className="text-xs">Unavailable</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1 line-clamp-1">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 mb-1">
                        {item.category && (
                          <Badge variant="outline" className="text-xs">
                            {item.category.name}
                          </Badge>
                        )}
                        <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
                          NLe {item.price}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Order: {item.sort_order || 0}
                        </Badge>
                      </div>
                      
                      {/* Size and Options Info for List View */}
                      {(item.sizes?.length > 0 || item.options?.length > 0) && (
                        <div className="flex flex-wrap gap-1">
                          {item.sizes?.length > 0 && (
                            <>
                              <span className="text-xs text-gray-500 dark:text-gray-400">Sizes:</span>
                              {item.sizes.slice(0, 2).map((size, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {size.size_name}
                                </Badge>
                              ))}
                              {item.sizes.length > 2 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{item.sizes.length - 2}
                                </Badge>
                              )}
                            </>
                          )}
                          
                          {item.options?.length > 0 && (
                            <>
                              <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">Options:</span>
                              {item.options.slice(0, 1).map((option, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {option.option_name}
                                </Badge>
                              ))}
                              {item.options.length > 1 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{item.options.length - 1}
                                </Badge>
                              )}
                            </>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Utensils className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchTerm || selectedCategory !== "all" 
                ? "No menu items match your search criteria" 
                : "No menu items yet"}
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Menu Item
            </Button>
          </div>
        )}
      </motion.div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[98vw] max-w-2xl max-h-[95vh] overflow-y-auto p-3 sm:p-4 md:p-6 mx-2">
          <DialogHeader className="pb-3 sm:pb-4">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl">Edit Menu Item</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-3 sm:space-y-4">
              <div>
                <Label htmlFor="edit-name" className="text-sm font-medium">Name</Label>
                <Input
                  id="edit-name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  className="mt-1 h-11 sm:h-10 text-base"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-category" className="text-sm font-medium">Category</Label>
                <Select
                  value={editFormData.category_id}
                  onValueChange={(value) => setEditFormData({ ...editFormData, category_id: value })}
                >
                  <SelectTrigger className="mt-1 h-11 sm:h-10 text-base">
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
              <Label htmlFor="edit-description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="edit-description"
                value={editFormData.description}
                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                rows={3}
                className="mt-1 text-base"
              />
            </div>
            <div className="space-y-3 sm:space-y-4 sm:grid sm:grid-cols-2 sm:gap-4">
              <div>
                <Label htmlFor="edit-price" className="text-sm font-medium">Price (NLe)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={editFormData.price}
                  onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                  className="mt-1 h-11 sm:h-10 text-base"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-sort-order" className="text-sm font-medium">Sort Order</Label>
                <Input
                  id="edit-sort-order"
                  type="number"
                  value={editFormData.sort_order}
                  onChange={(e) => setEditFormData({ ...editFormData, sort_order: e.target.value })}
                  className="mt-1 h-11 sm:h-10 text-base"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Image</Label>
              <ImageUpload
                value={editFormData.image_url}
                onChange={(url) => setEditFormData({ ...editFormData, image_url: url })}
                label="Menu Item Image"
                className="mt-1"
              />
            </div>
                         <div className="space-y-3 sm:space-y-0 sm:flex sm:flex-row sm:items-center sm:gap-4">
               <div className="flex items-center space-x-2">
                 <Switch
                   id="edit-available"
                   checked={editFormData.is_available}
                   onCheckedChange={(checked) => setEditFormData({ ...editFormData, is_available: checked })}
                 />
                 <Label htmlFor="edit-available" className="text-sm">Available</Label>
               </div>
               <div className="flex items-center space-x-2">
                 <Switch
                   id="edit-popular"
                   checked={editFormData.is_popular}
                   onCheckedChange={(checked) => setEditFormData({ ...editFormData, is_popular: checked })}
                 />
                 <Label htmlFor="edit-popular" className="text-sm">Popular</Label>
               </div>
             </div>

             {/* Size Management for Edit */}
             <div className="space-y-3">
               <div className="flex items-center space-x-2">
                 <Switch
                   id="editEnableSizes"
                   checked={editEnableSizes}
                   onCheckedChange={(checked) => {
                     setEditEnableSizes(checked)
                     // If turning off, clear the sizes
                     if (!checked) {
                       setEditSizes([])
                     } else if (editSizes.length === 0) {
                       // If turning on and no sizes exist, add a default one
                       setEditSizes([{ size_name: "Regular", price: "", is_default: true }])
                     }
                   }}
                 />
                 <Label htmlFor="editEnableSizes" className="text-sm font-medium">Enable Size Variations</Label>
               </div>
               
               {editEnableSizes ? (
                 <div className="space-y-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                   <div className="flex items-center justify-between">
                     <Label className="text-sm font-medium">Size Options</Label>
                     <Button type="button" onClick={addEditSize} size="sm" variant="outline">
                       <Plus className="h-4 w-4 mr-1" />
                       Add Size
                     </Button>
                   </div>
                   
                   {editSizes.map((size, index) => (
                     <div key={index} className="flex items-center gap-2 p-3 border rounded bg-white dark:bg-gray-700">
                       <Input
                         placeholder="Size name (e.g., Small, Medium, Large)"
                         value={size.size_name}
                         onChange={(e) => updateEditSize(index, 'size_name', e.target.value)}
                         className="flex-1"
                       />
                       <Input
                         type="number"
                         step="0.01"
                         placeholder="Price"
                         value={size.price}
                         onChange={(e) => updateEditSize(index, 'price', parseFloat(e.target.value) || "")}
                         className="w-24"
                       />
                       <div className="flex items-center space-x-2">
                         <input
                           type="radio"
                           name="editDefaultSize"
                           checked={size.is_default}
                           onChange={() => {
                             setEditSizes(editSizes.map((s, i) => ({
                               ...s,
                               is_default: i === index
                             })))
                           }}
                         />
                         <Label className="text-xs">Default</Label>
                       </div>
                       {editSizes.length > 1 && (
                         <Button
                           type="button"
                           onClick={() => removeEditSize(index)}
                           size="sm"
                           variant="destructive"
                         >
                           <X className="h-4 w-4" />
                         </Button>
                       )}
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
                   <p className="text-sm text-gray-600 dark:text-gray-400">
                     Size options are disabled. Enable the toggle above to add size options.
                   </p>
                 </div>
               )}
             </div>

             {/* Custom Options Management for Edit */}
             <div className="space-y-3">
               <div className="flex items-center space-x-2">
                 <Switch
                   id="editEnableOptions"
                   checked={editEnableOptions}
                   onCheckedChange={(checked) => {
                     setEditEnableOptions(checked)
                     // If turning off, clear the options
                     if (!checked) {
                       setEditCustomOptions([])
                     } else if (editCustomOptions.length === 0) {
                       // If turning on and no options exist, add a default one
                       setEditCustomOptions([{ name: "", price_adjustment: "" }])
                     }
                   }}
                 />
                 <Label htmlFor="editEnableOptions" className="text-sm font-medium">Enable Custom Options</Label>
               </div>
               
               {editEnableOptions ? (
                 <div className="space-y-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                   <div className="flex items-center justify-between">
                     <Label className="text-sm font-medium">Custom Options</Label>
                     <Button type="button" onClick={addEditOption} size="sm" variant="outline">
                       <Plus className="h-4 w-4 mr-1" />
                       Add Option
                     </Button>
                   </div>
                   
                   {editCustomOptions.map((option, index) => (
                     <div key={index} className="flex items-center gap-2 p-3 border rounded bg-white dark:bg-gray-700">
                       <Input
                         placeholder="Option name (e.g., Grilled Chicken, Fried Chicken)"
                         value={option.name}
                         onChange={(e) => updateEditOption(index, 'name', e.target.value)}
                         className="flex-1"
                       />
                       <Input
                         type="number"
                         step="0.01"
                         placeholder="Price adjustment"
                         value={option.price_adjustment}
                         onChange={(e) => updateEditOption(index, 'price_adjustment', parseFloat(e.target.value) || "")}
                         className="w-32"
                       />
                       {editCustomOptions.length > 1 && (
                         <Button
                           type="button"
                           onClick={() => removeEditOption(index)}
                           size="sm"
                           variant="destructive"
                         >
                           <X className="h-4 w-4" />
                         </Button>
                       )}
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800 text-center">
                   <p className="text-sm text-gray-600 dark:text-gray-400">
                     Custom options are disabled. Enable the toggle above to add custom options.
                   </p>
                 </div>
               )}
             </div>
             <div className="flex flex-col gap-2 pt-4">
               <Button type="submit" disabled={isEditSubmitting} className="w-full h-12 text-base">
                 {isEditSubmitting ? "Updating..." : "Update Menu Item"}
               </Button>
               <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)} className="w-full h-12 text-base">
                 Cancel
               </Button>
             </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
} 