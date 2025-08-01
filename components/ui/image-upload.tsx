"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadImage } from '@/lib/image-upload'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  label?: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
  placeholder = "Upload an image or enter URL",
  className,
  disabled = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (file: File) => {
    if (!file) return

    setIsUploading(true)
    setUploadError(null)

    const result = await uploadImage(file)
    
    if (result.success && result.url) {
      onChange(result.url)
    } else {
      setUploadError(result.error || 'Upload failed')
    }
    
    setIsUploading(false)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const clearImage = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Label>{label}</Label>
      
      <div className="space-y-3">
        {/* Image Preview */}
        {value && (
          <div className="relative group">
            <img
              src={value}
              alt="Preview"
              className="w-full h-32 object-cover rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={clearImage}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={cn(
            "border-2 border-dashed rounded-lg p-4 text-center transition-colors",
            "hover:border-gray-400 cursor-pointer",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />
          
          <div className="space-y-2">
            <Upload className="h-8 w-8 mx-auto text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG, WebP, GIF up to 5MB
              </p>
            </div>
          </div>
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <Label className="text-sm text-gray-600 dark:text-gray-400">Or enter image URL</Label>
          <div className="flex gap-2">
            <Input
              type="url"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className="flex-1"
            />
            {value && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => window.open(value, '_blank')}
                disabled={disabled}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Error Message */}
        {uploadError && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {uploadError}
          </p>
        )}
      </div>
    </div>
  )
} 