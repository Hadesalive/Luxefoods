/**
 * Bulk Image Upload Script
 * 
 * This script helps you upload images to Cloudinary in bulk and update your database.
 * 
 * Option 1: Upload from local folder
 *   - Place images in a folder (e.g., ./images-to-upload/)
 *   - Name them with menu item IDs or names
 *   - Run: npx tsx scripts/bulk-upload-images.ts folder ./images-to-upload
 * 
 * Option 2: Upload from URL mapping file
 *   - Create a JSON file with old URL -> local file path mappings
 *   - Run: npx tsx scripts/bulk-upload-images.ts json ./mapping.json
 * 
 * Option 3: Interactive mode - shows all items needing images
 *   - Run: npx tsx scripts/bulk-upload-images.ts interactive
 */

import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

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

interface ImageMapping {
  itemId: string
  itemName: string
  oldUrl: string
  newUrl?: string
  localPath?: string
}

/**
 * Upload image from local file to Cloudinary
 */
async function uploadLocalFileToCloudinary(
  filePath: string,
  folder: string = 'kings-bakery/menu-items',
  publicId?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder,
        public_id: publicId,
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
  })
}

/**
 * Upload image from URL to Cloudinary
 */
async function uploadUrlToCloudinary(
  imageUrl: string,
  folder: string = 'kings-bakery/menu-items',
  publicId?: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      imageUrl,
      {
        folder,
        public_id: publicId,
        resource_type: 'image',
        overwrite: false,
        quality: 'auto',
        fetch_format: 'auto',
        timeout: 60000,
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
  })
}

/**
 * Get all menu items with Vercel Blob URLs
 */
async function getItemsNeedingMigration(): Promise<ImageMapping[]> {
  const { data: menuItems, error } = await supabase
    .from('menu_items')
    .select('id, name, image_url')
    .not('image_url', 'is', null)
    .like('image_url', '%blob.vercel-storage.com%')

  if (error) {
    throw error
  }

  return (menuItems || []).map(item => ({
    itemId: item.id,
    itemName: item.name,
    oldUrl: item.image_url || '',
  }))
}

/**
 * Update menu item image URL in database
 */
async function updateMenuItemImage(itemId: string, newUrl: string): Promise<boolean> {
  const { error } = await supabase
    .from('menu_items')
    .update({ image_url: newUrl })
    .eq('id', itemId)

  if (error) {
    console.error(`   ❌ Database update failed: ${error.message}`)
    return false
  }
  return true
}

/**
 * Generate mapping file for manual review
 */
async function generateMappingFile() {
  console.log('📋 Generating mapping file...\n')
  
  const items = await getItemsNeedingMigration()
  
  const mapping = items.map(item => ({
    itemId: item.itemId,
    itemName: item.itemName,
    oldUrl: item.oldUrl,
    newUrl: '', // Fill this after uploading
    localPath: '', // Optional: path to local image file
  }))

  const outputPath = path.join(process.cwd(), 'image-migration-mapping.json')
  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2))

  console.log(`✅ Created mapping file: ${outputPath}`)
  console.log(`\n📝 Next steps:`)
  console.log(`   1. For each item, either:`)
  console.log(`      - Add 'localPath' if you have the image file locally`)
  console.log(`      - Or manually upload to Cloudinary and add 'newUrl'`)
  console.log(`   2. Run: npx tsx scripts/bulk-upload-images.ts json ${outputPath}`)
  console.log(`\n   Total items: ${items.length}`)
}

/**
 * Process mapping file
 */
async function processMappingFile(filePath: string) {
  console.log(`📂 Reading mapping file: ${filePath}\n`)
  
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`)
    process.exit(1)
  }

  const mappingContent = fs.readFileSync(filePath, 'utf-8')
  const mappings: ImageMapping[] = JSON.parse(mappingContent)

  let success = 0
  let failed = 0
  let skipped = 0

  for (const mapping of mappings) {
    if (!mapping.newUrl && !mapping.localPath) {
      console.log(`⏭️  Skipping: ${mapping.itemName} (no URL or local path)`)
      skipped++
      continue
    }

    try {
      console.log(`\n🔄 Processing: ${mapping.itemName}`)
      
      let cloudinaryUrl: string

      if (mapping.newUrl) {
        // Already has Cloudinary URL
        cloudinaryUrl = mapping.newUrl
        console.log(`   ✅ Using provided URL: ${cloudinaryUrl}`)
      } else if (mapping.localPath) {
        // Upload from local file
        const fullPath = path.isAbsolute(mapping.localPath) 
          ? mapping.localPath 
          : path.join(process.cwd(), mapping.localPath)
        
        if (!fs.existsSync(fullPath)) {
          console.log(`   ⚠️  File not found: ${fullPath}`)
          failed++
          continue
        }

        const publicId = `menu-items/${mapping.itemId}`
        cloudinaryUrl = await uploadLocalFileToCloudinary(fullPath, 'kings-bakery/menu-items', publicId)
        console.log(`   ✅ Uploaded: ${cloudinaryUrl}`)
      } else {
        console.log(`   ⚠️  No valid source found`)
        failed++
        continue
      }

      // Update database
      const updated = await updateMenuItemImage(mapping.itemId, cloudinaryUrl)
      if (updated) {
        console.log(`   ✅ Database updated`)
        success++
        
        // Update mapping file with new URL
        mapping.newUrl = cloudinaryUrl
      } else {
        failed++
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error instanceof Error ? error.message : String(error)}`)
      failed++
    }
  }

  // Save updated mapping
  fs.writeFileSync(filePath, JSON.stringify(mappings, null, 2))

  console.log(`\n${'='.repeat(60)}`)
  console.log('📊 Summary')
  console.log('='.repeat(60))
  console.log(`✅ Success: ${success}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`⏭️  Skipped: ${skipped}`)
  console.log(`\n💾 Updated mapping file saved`)
}

/**
 * Upload from folder - matches files to menu items
 */
async function uploadFromFolder(folderPath: string) {
  console.log(`📁 Reading folder: ${folderPath}\n`)
  
  const fullPath = path.isAbsolute(folderPath) 
    ? folderPath 
    : path.join(process.cwd(), folderPath)

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Folder not found: ${fullPath}`)
    process.exit(1)
  }

  const files = fs.readdirSync(fullPath).filter(file => 
    /\.(jpg|jpeg|png|webp|gif)$/i.test(file)
  )

  console.log(`Found ${files.length} image files\n`)

  const items = await getItemsNeedingMigration()
  let success = 0
  let failed = 0

  for (const file of files) {
    const filePath = path.join(fullPath, file)
    const fileName = path.parse(file).name

    // Try to match by ID or name
    const matchedItem = items.find(item => 
      item.itemId.includes(fileName) || 
      item.itemName.toLowerCase().includes(fileName.toLowerCase()) ||
      fileName.toLowerCase().includes(item.itemName.toLowerCase())
    )

    if (!matchedItem) {
      console.log(`⚠️  Could not match: ${file}`)
      console.log(`   Available items: ${items.map(i => i.itemName).join(', ')}`)
      failed++
      continue
    }

    try {
      console.log(`\n🔄 Uploading: ${file} → ${matchedItem.itemName}`)
      
      const publicId = `menu-items/${matchedItem.itemId}`
      const cloudinaryUrl = await uploadLocalFileToCloudinary(filePath, 'kings-bakery/menu-items', publicId)
      
      console.log(`   ✅ Uploaded: ${cloudinaryUrl}`)

      const updated = await updateMenuItemImage(matchedItem.itemId, cloudinaryUrl)
      if (updated) {
        console.log(`   ✅ Database updated`)
        success++
      } else {
        failed++
      }
    } catch (error) {
      console.error(`   ❌ Error: ${error instanceof Error ? error.message : String(error)}`)
      failed++
    }
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log('📊 Summary')
  console.log('='.repeat(60))
  console.log(`✅ Success: ${success}`)
  console.log(`❌ Failed: ${failed}`)
}

/**
 * Interactive mode - shows items and helps with upload
 */
async function interactiveMode() {
  console.log('🎯 Interactive Mode\n')
  console.log('='.repeat(60))
  
  const items = await getItemsNeedingMigration()
  
  console.log(`\n📋 Found ${items.length} items needing image migration\n`)
  
  items.forEach((item, index) => {
    console.log(`${index + 1}. ${item.itemName}`)
    console.log(`   ID: ${item.itemId}`)
    console.log(`   Old URL: ${item.oldUrl}`)
    console.log('')
  })

  console.log('\n💡 Options:')
  console.log('   1. Generate mapping file: npx tsx scripts/bulk-upload-images.ts generate')
  console.log('   2. Upload from folder: npx tsx scripts/bulk-upload-images.ts folder ./images')
  console.log('   3. Process mapping: npx tsx scripts/bulk-upload-images.ts json ./image-migration-mapping.json')
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  try {
    switch (command) {
      case 'generate':
        await generateMappingFile()
        break
      
      case 'json':
        const jsonPath = args[1]
        if (!jsonPath) {
          console.error('❌ Please provide path to JSON mapping file')
          console.log('Usage: npx tsx scripts/bulk-upload-images.ts json <path-to-json>')
          process.exit(1)
        }
        await processMappingFile(jsonPath)
        break
      
      case 'folder':
        const folderPath = args[1]
        if (!folderPath) {
          console.error('❌ Please provide folder path')
          console.log('Usage: npx tsx scripts/bulk-upload-images.ts folder <folder-path>')
          process.exit(1)
        }
        await uploadFromFolder(folderPath)
        break
      
      case 'interactive':
        await interactiveMode()
        break
      
      default:
        console.log('📦 Bulk Image Upload Tool\n')
        console.log('Usage:')
        console.log('  npx tsx scripts/bulk-upload-images.ts generate          - Generate mapping file')
        console.log('  npx tsx scripts/bulk-upload-images.ts interactive       - Show all items needing migration')
        console.log('  npx tsx scripts/bulk-upload-images.ts folder <path>     - Upload from local folder')
        console.log('  npx tsx scripts/bulk-upload-images.ts json <path>       - Process mapping file\n')
        console.log('Examples:')
        console.log('  npx tsx scripts/bulk-upload-images.ts generate')
        console.log('  npx tsx scripts/bulk-upload-images.ts folder ./images')
        console.log('  npx tsx scripts/bulk-upload-images.ts json ./image-migration-mapping.json')
    }
  } catch (error) {
    console.error('\n❌ Error:', error)
    process.exit(1)
  }
}

main()

