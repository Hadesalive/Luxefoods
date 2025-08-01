"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/ui/image-upload"
import { useAdmin } from "@/contexts/AdminContext"

interface AddMenuItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddMenuItemDialog({ open, onOpenChange }: AddMenuItemDialogProps) {
  const { addMenuItem } = useAdmin()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    image: "",
    available: true,
    popular: false,
    pricingType: "single" as "single" | "multiple",
    singlePrice: "",
    smallPrice: "",
    mediumPrice: "",
    largePrice: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.category) return

    let price: number | { [key: string]: number }

    if (formData.pricingType === "single") {
      price = Number.parseFloat(formData.singlePrice)
    } else {
      price = {}
      if (formData.smallPrice) price.S = Number.parseFloat(formData.smallPrice)
      if (formData.mediumPrice) price.M = Number.parseFloat(formData.mediumPrice)
      if (formData.largePrice) price.L = Number.parseFloat(formData.largePrice)
    }

    addMenuItem({
      name: formData.name,
      description: formData.description,
      category: formData.category as any,
      price,
      image: formData.image,
      available: formData.available,
      popular: formData.popular,
    })

    // Reset form
    setFormData({
      name: "",
      description: "",
      category: "",
      image: "",
      available: true,
      popular: false,
      pricingType: "single",
      singlePrice: "",
      smallPrice: "",
      mediumPrice: "",
      largePrice: "",
    })

    onOpenChange(false)
  }

  const isPizzaCategory = formData.category === "pizza"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Menu Item</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Item Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Chicken Pizza"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe the item..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => {
                setFormData({
                  ...formData,
                  category: value,
                  pricingType: value === "pizza" ? "multiple" : "single",
                })
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pizza">Pizza</SelectItem>
                <SelectItem value="mini-pizza">Mini Pizza</SelectItem>
                <SelectItem value="kebbeh">Kebbeh</SelectItem>
                <SelectItem value="fataya">Fataya</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <ImageUpload
            value={formData.image}
            onChange={(url) => setFormData({ ...formData, image: url })}
            label="Item Image (Optional)"
            placeholder="https://example.com/image.jpg or upload a file"
          />

          {/* Pricing Section */}
          <div className="space-y-3">
            <Label>Pricing</Label>

            {!isPizzaCategory && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="single-price"
                    name="pricingType"
                    checked={formData.pricingType === "single"}
                    onChange={() => setFormData({ ...formData, pricingType: "single" })}
                  />
                  <Label htmlFor="single-price">Single Price</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="multiple-price"
                    name="pricingType"
                    checked={formData.pricingType === "multiple"}
                    onChange={() => setFormData({ ...formData, pricingType: "multiple" })}
                  />
                  <Label htmlFor="multiple-price">Size-based Pricing</Label>
                </div>
              </div>
            )}

            {formData.pricingType === "single" ? (
              <div>
                <Label htmlFor="singlePrice">Price (NLe)</Label>
                <Input
                  id="singlePrice"
                  type="number"
                  step="0.01"
                  value={formData.singlePrice}
                  onChange={(e) => setFormData({ ...formData, singlePrice: e.target.value })}
                  placeholder="150.00"
                  required
                />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label htmlFor="smallPrice">Small (NLe)</Label>
                  <Input
                    id="smallPrice"
                    type="number"
                    step="0.01"
                    value={formData.smallPrice}
                    onChange={(e) => setFormData({ ...formData, smallPrice: e.target.value })}
                    placeholder="120.00"
                  />
                </div>
                <div>
                  <Label htmlFor="mediumPrice">Medium (NLe)</Label>
                  <Input
                    id="mediumPrice"
                    type="number"
                    step="0.01"
                    value={formData.mediumPrice}
                    onChange={(e) => setFormData({ ...formData, mediumPrice: e.target.value })}
                    placeholder="200.00"
                  />
                </div>
                <div>
                  <Label htmlFor="largePrice">Large (NLe)</Label>
                  <Input
                    id="largePrice"
                    type="number"
                    step="0.01"
                    value={formData.largePrice}
                    onChange={(e) => setFormData({ ...formData, largePrice: e.target.value })}
                    placeholder="250.00"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Switch
                id="available"
                checked={formData.available}
                onCheckedChange={(checked) => setFormData({ ...formData, available: checked })}
              />
              <Label htmlFor="available">Available</Label>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                id="popular"
                checked={formData.popular}
                onCheckedChange={(checked) => setFormData({ ...formData, popular: checked })}
              />
              <Label htmlFor="popular">Popular Item</Label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
