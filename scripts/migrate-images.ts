/**
 * Migration Script: Move images from Vercel Blob to Cloudinary
 * 
 * This script:
 * 1. Finds all menu items and categories with Vercel Blob image URLs
 * 2. Uploads them directly to Cloudinary from URL (Cloudinary fetches them)
 * 3. Updates the database with new Cloudinary URLs
 * 
 * Usage:
 *   npx tsx scripts/migrate-images.ts
 * 
 * Make sure your .env file has:
 *   - CLOUDINARY_CLOUD_NAME
 *   - CLOUDINARY_API_KEY
 *   - CLOUDINARY_API_SECRET
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - NEXT_PUBLIC_SUPABASE_ANON_KEY
 *   - BLOB_READ_WRITE_TOKEN (optional, for authenticated access)
 */

import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'
import { head } from '@vercel/blob'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') })
dotenv.config({ path: path.join(process.cwd(), '.env') })

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Initialize Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

if (!cloudName || !apiKey || !apiSecret) {
  console.error('❌ Missing Cloudinary environment variables')
  process.exit(1)
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
})

interface MigrationResult {
  success: number
  failed: number
  skipped: number
  errors: Array<{ type: string; id: string; url: string; error: string }>
}

/**
 * Check if URL is from Vercel Blob
 */
function isVercelBlobUrl(url: string | null | undefined): boolean {
  if (!url) return false
  return url.includes('blob.vercel-storage.com')
}

/**
 * Download image using Vercel Blob API (if token available)
 */
async function downloadImageWithVercelBlobApi(url: string): Promise<Buffer> {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  
  if (!blobToken) {
    throw new Error('BLOB_READ_WRITE_TOKEN not found in environment variables')
  }

  try {
    // Extract the blob path from URL
    const urlObj = new URL(url)
    const blobPath = urlObj.pathname
    
    // Use Vercel Blob API to get the blob
    const blob = await head(blobPath, { token: blobToken })
    
    // Download using the downloadUrl if available, otherwise use original URL with token
    const downloadUrl = blob.downloadUrl || url
    const response = await fetch(downloadUrl, {
      headers: {
        'Authorization': `Bearer ${blobToken}`
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText} (${response.status})`)
    }
    
    const arrayBuffer = await response.arrayBuffer()
    return Buffer.from(arrayBuffer)
  } catch (error) {
    throw new Error(`Vercel Blob API error: ${error instanceof Error ? error.message : String(error)}`)
  }
}

/**
 * Download image with authentication headers (fallback method)
 */
async function downloadImageWithAuth(url: string): Promise<Buffer> {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN
  const headers: HeadersInit = {}
  
  // Try with authentication if token is available
  if (blobToken) {
    headers['Authorization'] = `Bearer ${blobToken}`
  }
  
  const response = await fetch(url, { headers })
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText)
    throw new Error(`Failed to download image: ${errorText} (${response.status})`)
  }
  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/**
 * Upload buffer to Cloudinary
 */
async function uploadBufferToCloudinary(
  buffer: Buffer,
  filename: string,
  folder: string = 'kings-bakery'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: filename,
        resource_type: 'image',
        overwrite: false,
        quality: 'auto',
        fetch_format: 'auto',
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else if (result) {
          resolve(result.secure_url)
        } else {
          reject(new Error('Upload failed: No result returned'))
        }
      }
    )
    uploadStream.end(buffer)
  })
}

/**
 * Upload image to Cloudinary directly from URL
 * Cloudinary will fetch the image from the source URL
 * Falls back to authenticated download if URL fetch fails
 */
async function uploadToCloudinaryFromUrl(
  sourceUrl: string,
  filename: string,
  folder: string = 'kings-bakery'
): Promise<string> {
  try {
    // Try Cloudinary's URL fetch first (most efficient)
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        sourceUrl,
        {
          folder,
          public_id: filename,
          resource_type: 'image',
          overwrite: false,
          quality: 'auto',
          fetch_format: 'auto',
          timeout: 60000,
        },
        async (error, result) => {
          if (error) {
            // If Cloudinary can't fetch the URL, try downloading with Vercel Blob API
            console.log(`   ⚠️  Cloudinary URL fetch failed: ${error.message || error}`)
            console.log(`   🔄 Trying Vercel Blob API download...`)
            try {
              // Try Vercel Blob API first
              const buffer = await downloadImageWithVercelBlobApi(sourceUrl)
              const url = await uploadBufferToCloudinary(buffer, filename, folder)
              resolve(url)
            } catch (blobApiError) {
              // Fallback to simple authenticated download
              console.log(`   ⚠️  Vercel Blob API failed: ${blobApiError instanceof Error ? blobApiError.message : String(blobApiError)}`)
              console.log(`   🔄 Trying simple authenticated download...`)
              try {
                const buffer = await downloadImageWithAuth(sourceUrl)
                const url = await uploadBufferToCloudinary(buffer, filename, folder)
                resolve(url)
              } catch (authError) {
                // Return the most descriptive error
                const finalError = new Error(
                  `All download methods failed. Cloudinary: ${error.message || error}. ` +
                  `Vercel Blob API: ${blobApiError instanceof Error ? blobApiError.message : String(blobApiError)}. ` +
                  `Auth download: ${authError instanceof Error ? authError.message : String(authError)}`
                )
                reject(finalError)
              }
            }
          } else if (result) {
            resolve(result.secure_url)
          } else {
            reject(new Error('Upload failed: No result returned'))
          }
        }
      )
    })
  } catch (error) {
    // Final fallback: try authenticated download
    console.log(`   ⚠️  Trying authenticated download as fallback...`)
    const buffer = await downloadImageWithAuth(sourceUrl)
    return uploadBufferToCloudinary(buffer, filename, folder)
  }
}

/**
 * Extract filename from URL
 */
function getFilenameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    const pathname = urlObj.pathname
    const filename = pathname.split('/').pop() || 'image'
    // Remove extension for Cloudinary public_id
    return filename.replace(/\.[^/.]+$/, '')
  } catch {
    return `image-${Date.now()}`
  }
}

/**
 * Migrate menu items
 */
async function migrateMenuItems(): Promise<MigrationResult> {
  console.log('\n📦 Fetching menu items from database...')
  
  const { data: menuItems, error } = await supabase
    .from('menu_items')
    .select('id, name, image_url')
    .not('image_url', 'is', null)

  if (error) {
    console.error('❌ Error fetching menu items:', error)
    throw error
  }

  if (!menuItems || menuItems.length === 0) {
    console.log('ℹ️  No menu items found')
    return { success: 0, failed: 0, skipped: 0, errors: [] }
  }

  console.log(`Found ${menuItems.length} menu items`)

  const result: MigrationResult = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  }

  for (const item of menuItems) {
    if (!isVercelBlobUrl(item.image_url)) {
      result.skipped++
      continue
    }

    try {
      console.log(`\n🔄 Migrating: ${item.name} (${item.id})`)
      console.log(`   Old URL: ${item.image_url}`)

      const filename = getFilenameFromUrl(item.image_url!)

      // Upload to Cloudinary directly from URL (Cloudinary will fetch it)
      const newUrl = await uploadToCloudinaryFromUrl(
        item.image_url!,
        `menu-items/${filename}`,
        'kings-bakery/menu-items'
      )
      console.log(`   ✅ New URL: ${newUrl}`)

      // Update database
      const { error: updateError } = await supabase
        .from('menu_items')
        .update({ image_url: newUrl })
        .eq('id', item.id)

      if (updateError) {
        throw updateError
      }

      result.success++
      console.log(`   ✅ Database updated`)
    } catch (error) {
      result.failed++
      const errorMsg = error instanceof Error ? error.message : String(error)
      const errorStack = error instanceof Error ? error.stack : undefined
      result.errors.push({
        type: 'menu_item',
        id: item.id,
        url: item.image_url || '',
        error: errorMsg,
      })
      console.error(`   ❌ Failed: ${errorMsg}`)
      if (errorStack && process.env.DEBUG) {
        console.error(`   Stack: ${errorStack}`)
      }
    }
  }

  return result
}

/**
 * Migrate categories
 */
async function migrateCategories(): Promise<MigrationResult> {
  console.log('\n📁 Fetching categories from database...')
  
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, image_url')
    .not('image_url', 'is', null)

  if (error) {
    console.error('❌ Error fetching categories:', error)
    throw error
  }

  if (!categories || categories.length === 0) {
    console.log('ℹ️  No categories found')
    return { success: 0, failed: 0, skipped: 0, errors: [] }
  }

  console.log(`Found ${categories.length} categories`)

  const result: MigrationResult = {
    success: 0,
    failed: 0,
    skipped: 0,
    errors: [],
  }

  for (const category of categories) {
    if (!isVercelBlobUrl(category.image_url)) {
      result.skipped++
      continue
    }

    try {
      console.log(`\n🔄 Migrating category: ${category.name} (${category.id})`)
      console.log(`   Old URL: ${category.image_url}`)

      const filename = getFilenameFromUrl(category.image_url!)

      // Upload to Cloudinary directly from URL (Cloudinary will fetch it)
      const newUrl = await uploadToCloudinaryFromUrl(
        category.image_url!,
        `categories/${filename}`,
        'kings-bakery/categories'
      )
      console.log(`   ✅ New URL: ${newUrl}`)

      // Update database
      const { error: updateError } = await supabase
        .from('categories')
        .update({ image_url: newUrl })
        .eq('id', category.id)

      if (updateError) {
        throw updateError
      }

      result.success++
      console.log(`   ✅ Database updated`)
    } catch (error) {
      result.failed++
      const errorMsg = error instanceof Error ? error.message : String(error)
      const errorStack = error instanceof Error ? error.stack : undefined
      result.errors.push({
        type: 'category',
        id: category.id,
        url: category.image_url || '',
        error: errorMsg,
      })
      console.error(`   ❌ Failed: ${errorMsg}`)
      if (errorStack && process.env.DEBUG) {
        console.error(`   Stack: ${errorStack}`)
      }
    }
  }

  return result
}

/**
 * Main migration function
 */
async function main() {
  console.log('🚀 Starting image migration from Vercel Blob to Cloudinary\n')
  console.log('=' .repeat(60))

  try {
    // Migrate menu items
    const menuItemsResult = await migrateMenuItems()

    // Migrate categories
    const categoriesResult = await migrateCategories()

    // Summary
    console.log('\n' + '='.repeat(60))
    console.log('📊 Migration Summary')
    console.log('='.repeat(60))
    console.log('\nMenu Items:')
    console.log(`  ✅ Success: ${menuItemsResult.success}`)
    console.log(`  ❌ Failed: ${menuItemsResult.failed}`)
    console.log(`  ⏭️  Skipped: ${menuItemsResult.skipped}`)
    
    console.log('\nCategories:')
    console.log(`  ✅ Success: ${categoriesResult.success}`)
    console.log(`  ❌ Failed: ${categoriesResult.failed}`)
    console.log(`  ⏭️  Skipped: ${categoriesResult.skipped}`)

    const totalSuccess = menuItemsResult.success + categoriesResult.success
    const totalFailed = menuItemsResult.failed + categoriesResult.failed
    const totalSkipped = menuItemsResult.skipped + categoriesResult.skipped

    console.log('\nTotal:')
    console.log(`  ✅ Success: ${totalSuccess}`)
    console.log(`  ❌ Failed: ${totalFailed}`)
    console.log(`  ⏭️  Skipped: ${totalSkipped}`)

    // Show errors if any
    const allErrors = [...menuItemsResult.errors, ...categoriesResult.errors]
    if (allErrors.length > 0) {
      console.log('\n❌ Errors:')
      allErrors.forEach((err) => {
        console.log(`  - ${err.type} ${err.id}: ${err.error}`)
        console.log(`    URL: ${err.url}`)
      })
    }

    if (totalFailed === 0) {
      console.log('\n🎉 Migration completed successfully!')
    } else {
      console.log('\n⚠️  Migration completed with some errors. Please review the errors above.')
    }
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run migration
main()

