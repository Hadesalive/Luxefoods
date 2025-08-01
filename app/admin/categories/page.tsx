"use client"

import { useState } from "react"
import { useMenu } from "@/contexts/MenuContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Plus, 
  Tag, 
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Search,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ImageUpload } from "@/components/ui/image-upload"

export default function CategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory, isLoading } = useMenu()
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 9
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    sort_order: 0,
    is_active: true,
  })

  // Filter and paginate categories
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData)
        setEditingCategory(null)
      } else {
        await addCategory(formData)
      }
      setFormData({
        name: "",
        slug: "",
        description: "",
        image_url: "",
        sort_order: 0,
        is_active: true,
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error saving category:", error)
    }
  }

  const handleEdit = (category: any) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || "",
      image_url: category.image_url || "",
      sort_order: category.sort_order,
      is_active: category.is_active,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id)
      } catch (error) {
        console.error("Error deleting category:", error)
      }
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading categories...</p>
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
            🏷️ Categories
          </h1>
          <p className="text-base lg:text-lg text-gray-600 dark:text-gray-400">
            Organize your menu with categories
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white w-full lg:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Pizza, Kebbeh"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., pizza, kebbeh"
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the category"
                  rows={3}
                />
              </div>
              <ImageUpload
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
                label="Category Image"
                placeholder="https://example.com/image.jpg or upload a file"
              />
              <div>
                <Label htmlFor="sort_order">Sort Order</Label>
                <Input
                  id="sort_order"
                  type="number"
                  value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })}
                  placeholder="0"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  id="is_active"
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="is_active">Active</Label>
              </div>
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingCategory ? "Update Category" : "Add Category"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false)
                    setEditingCategory(null)
                    setFormData({
                      name: "",
                      slug: "",
                      description: "",
                      image_url: "",
                      sort_order: 0,
                      is_active: true,
                    })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>

                           {/* Search and Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            />
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {filteredCategories.length} of {categories.length} categories
          </div>
        </motion.div>

               {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
         {paginatedCategories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 * index }}
          >
            <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 lg:w-12 lg:h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                       <Tag className="h-5 w-5 lg:h-6 lg:w-6 text-indigo-600 dark:text-indigo-400" />
                     </div>
                                         <div>
                       <h3 className="text-lg lg:text-xl font-bold text-indigo-900 dark:text-indigo-100">
                         {category.name}
                       </h3>
                       <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                         {category.slug}
                       </p>
                     </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                                 {category.description && (
                   <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm lg:text-base">
                     {category.description}
                   </p>
                 )}

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {category.is_active ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        <Eye className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                    <Badge variant="outline">
                      Order: {category.sort_order}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

             {/* Pagination */}
       {totalPages > 1 && (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, delay: 0.4 }}
           className="flex items-center justify-center gap-2 flex-wrap"
         >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </motion.div>
      )}

      {filteredCategories.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center py-12"
        >
                   <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 max-w-md mx-auto">
           <CardContent className="p-6 lg:p-8">
              <Tag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                No Categories Yet
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Create your first category to organize your menu items
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Category
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
} 