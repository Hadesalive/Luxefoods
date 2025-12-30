/**
 * Helper Script: Update Cloudinary URLs in Database
 * 
 * Use this script AFTER manually uploading images to Cloudinary.
 * This script helps you update the database with new Cloudinary URLs.
 * 
 * Usage:
 *   1. Manually upload images to Cloudinary (via dashboard or API)
 *   2. Update the URL_MAPPING below with old Vercel URLs -> new Cloudinary URLs
 *   3. Run: npx tsx scripts/update-cloudinary-urls.ts
 * 
 * Or use the interactive mode to update URLs one by one.
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as readline from 'readline'

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

// URL mapping: old Vercel Blob URL -> new Cloudinary URL
// Add your mappings here after uploading to Cloudinary
const URL_MAPPING: Record<string, string> = {
  // Example:
  // 'https://nuvzsi8ijyo2dw8a.public.blob.vercel-storage.com/menu-item-1754162188921-9nmq8e1rrk.jpg': 
  //   'https://res.cloudinary.com/your-cloud-name/image/upload/v1234567890/kings-bakery/menu-items/menu-item-1754162188921-9nmq8e1rrk.jpg',
}

/**
 * Update menu item URL
 */
async function updateMenuItemUrl(itemId: string, oldUrl: string, newUrl: string): Promise<boolean> {
  const { error } = await supabase
    .from('menu_items')
    .update({ image_url: newUrl })
    .eq('id', itemId)
    .eq('image_url', oldUrl)

  if (error) {
    console.error(`   ❌ Failed to update: ${error.message}`)
    return false
  }
  return true
}

/**
 * Update category URL
 */
async function updateCategoryUrl(categoryId: string, oldUrl: string, newUrl: string): Promise<boolean> {
  const { error } = await supabase
    .from('categories')
    .update({ image_url: newUrl })
    .eq('id', categoryId)
    .eq('image_url', oldUrl)

  if (error) {
    console.error(`   ❌ Failed to update: ${error.message}`)
    return false
  }
  return true
}

/**
 * Batch update URLs from mapping
 */
async function batchUpdateUrls() {
  if (Object.keys(URL_MAPPING).length === 0) {
    console.log('⚠️  No URL mappings found. Please add mappings to URL_MAPPING object.')
    return
  }

  console.log(`\n🔄 Updating ${Object.keys(URL_MAPPING).length} URLs...\n`)

  let success = 0
  let failed = 0

  // Update menu items
  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('id, name, image_url')

  if (menuItems) {
    for (const item of menuItems) {
      if (item.image_url && URL_MAPPING[item.image_url]) {
        console.log(`Updating: ${item.name}`)
        const updated = await updateMenuItemUrl(item.id, item.image_url, URL_MAPPING[item.image_url])
        if (updated) {
          success++
          console.log(`   ✅ Updated`)
        } else {
          failed++
        }
      }
    }
  }

  // Update categories
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, image_url')

  if (categories) {
    for (const category of categories) {
      if (category.image_url && URL_MAPPING[category.image_url]) {
        console.log(`Updating category: ${category.name}`)
        const updated = await updateCategoryUrl(category.id, category.image_url, URL_MAPPING[category.image_url])
        if (updated) {
          success++
          console.log(`   ✅ Updated`)
        } else {
          failed++
        }
      }
    }
  }

  console.log(`\n✅ Success: ${success}`)
  console.log(`❌ Failed: ${failed}`)
}

/**
 * List all Vercel Blob URLs that need migration
 */
async function listVercelBlobUrls() {
  console.log('\n📋 Finding all Vercel Blob URLs that need migration...\n')

  const { data: menuItems } = await supabase
    .from('menu_items')
    .select('id, name, image_url')
    .not('image_url', 'is', null)
    .like('image_url', '%blob.vercel-storage.com%')

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, image_url')
    .not('image_url', 'is', null)
    .like('image_url', '%blob.vercel-storage.com%')

  console.log('Menu Items:')
  if (menuItems && menuItems.length > 0) {
    menuItems.forEach((item) => {
      console.log(`  - ${item.name}`)
      console.log(`    ID: ${item.id}`)
      console.log(`    URL: ${item.image_url}`)
      console.log('')
    })
  } else {
    console.log('  (none found)')
  }

  console.log('\nCategories:')
  if (categories && categories.length > 0) {
    categories.forEach((cat) => {
      console.log(`  - ${cat.name}`)
      console.log(`    ID: ${cat.id}`)
      console.log(`    URL: ${cat.image_url}`)
      console.log('')
    })
  } else {
    console.log('  (none found)')
  }

  const total = (menuItems?.length || 0) + (categories?.length || 0)
  console.log(`\n📊 Total items to migrate: ${total}`)
  console.log('\n💡 Tip: After uploading images to Cloudinary, add the URL mappings to URL_MAPPING in this script.')
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  if (command === 'list') {
    await listVercelBlobUrls()
  } else if (command === 'update') {
    await batchUpdateUrls()
  } else {
    console.log('Usage:')
    console.log('  npx tsx scripts/update-cloudinary-urls.ts list   - List all Vercel Blob URLs')
    console.log('  npx tsx scripts/update-cloudinary-urls.ts update - Update URLs from URL_MAPPING')
    console.log('\nSteps:')
    console.log('1. Run "list" to see all URLs that need migration')
    console.log('2. Manually upload images to Cloudinary')
    console.log('3. Add URL mappings to URL_MAPPING in this script')
    console.log('4. Run "update" to update the database')
  }
}

main()

