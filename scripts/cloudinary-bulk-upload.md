# Bulk Image Upload Guide

Since Vercel Blob is blocked, here are the best ways to migrate your 67 images:

## Option 1: Generate Mapping File (Recommended)

This creates a JSON file you can fill in manually:

```bash
npx tsx scripts/bulk-upload-images.ts generate
```

This creates `image-migration-mapping.json` with all your items. Then:

1. **If you have images locally:**
   - Add the file path to each item's `localPath` field
   - Run: `npx tsx scripts/bulk-upload-images.ts json ./image-migration-mapping.json`

2. **If you upload manually to Cloudinary:**
   - Upload images via Cloudinary dashboard
   - Copy the URLs to each item's `newUrl` field
   - Run: `npx tsx scripts/bulk-upload-images.ts json ./image-migration-mapping.json`

## Option 2: Upload from Local Folder

If you have all images in a folder:

1. Create a folder: `./images-to-upload/`
2. Name files with menu item names or IDs (e.g., `chicken-pizza.jpg` or `item-id.jpg`)
3. Run:
   ```bash
   npx tsx scripts/bulk-upload-images.ts folder ./images-to-upload
   ```

The script will try to match filenames to menu items automatically.

## Option 3: Cloudinary Media Library (Easiest for Manual Upload)

1. Go to [Cloudinary Media Library](https://cloudinary.com/console/media_library)
2. Upload images in bulk (drag & drop multiple files)
3. After upload, copy the URLs
4. Update the mapping file with URLs
5. Run the JSON processor

## Option 4: Use Cloudinary Upload Widget (For Browser)

You can also use Cloudinary's upload widget in your admin panel - I can add this if you want!

## Quick Start

```bash
# Step 1: Generate the mapping file
npx tsx scripts/bulk-upload-images.ts generate

# Step 2: Edit image-migration-mapping.json
# Add localPath or newUrl for each item

# Step 3: Process the mapping
npx tsx scripts/bulk-upload-images.ts json ./image-migration-mapping.json
```

The script will:
- ✅ Upload images to Cloudinary
- ✅ Update your database automatically
- ✅ Show progress for each item
- ✅ Save updated mapping file

