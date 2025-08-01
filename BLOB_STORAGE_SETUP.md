# Vercel Blob Storage Setup Guide

This guide explains how to set up Vercel Blob storage for image uploads in the Kings Bakery application.

## Prerequisites

1. A Vercel account
2. A Vercel project (where your app is deployed)
3. Vercel CLI installed (optional, for local development)

## Setup Steps

### 1. Install Vercel Blob Package

The `@vercel/blob` package is already included in the project dependencies.

### 2. Configure Environment Variables

Add the following environment variable to your `.env.local` file:

```bash
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

### 3. Get Your Blob Token

1. Go to your Vercel dashboard
2. Navigate to your project
3. Go to the "Storage" tab
4. Click on "Blob" to create a new blob store
5. Copy the read/write token

### 4. Local Development

For local development, you can use the Vercel CLI to pull environment variables:

```bash
vercel env pull .env.local
```

Or manually add the token to your `.env.local` file.

### 5. Deploy to Vercel

When deploying to Vercel:

1. Add the `BLOB_READ_WRITE_TOKEN` environment variable in your Vercel project settings
2. Deploy your application

## Features Implemented

### Image Upload Component

The application now includes a reusable `ImageUpload` component that provides:

- **Drag & Drop**: Users can drag and drop images directly onto the upload area
- **File Selection**: Click to browse and select image files
- **URL Input**: Option to enter an image URL directly
- **Preview**: Shows a preview of the uploaded image
- **Validation**: Validates file type and size
- **Error Handling**: Displays upload errors clearly

### Supported Features

- **File Types**: JPEG, JPG, PNG, WebP, GIF
- **File Size**: Maximum 5MB per file
- **Auto-naming**: Files are automatically named with timestamps
- **Public Access**: Uploaded images are publicly accessible
- **Error Recovery**: Clear error messages and retry functionality

### Integration Points

The image upload functionality has been integrated into:

1. **Add Menu Item Dialog** (`components/admin/AddMenuItemDialog.tsx`)
2. **Edit Menu Item Dialog** (`components/admin/EditMenuItemDialog.tsx`)
3. **Menu Management Page** (`app/admin/menu/page.tsx`)
4. **Categories Management Page** (`app/admin/categories/page.tsx`)

## API Endpoint

The upload functionality uses the `/api/upload` endpoint which:

- Validates file type and size
- Generates unique filenames
- Uploads to Vercel Blob storage
- Returns the public URL

## Usage Example

```tsx
import { ImageUpload } from '@/components/ui/image-upload'

function MyComponent() {
  const [imageUrl, setImageUrl] = useState('')

  return (
    <ImageUpload
      value={imageUrl}
      onChange={setImageUrl}
      label="Product Image"
      placeholder="Upload an image or enter URL"
    />
  )
}
```

## Security Considerations

- File type validation prevents malicious uploads
- File size limits prevent abuse
- Images are stored with public access (suitable for menu items)
- Unique filenames prevent conflicts

## Troubleshooting

### Common Issues

1. **Upload Fails**: Check that `BLOB_READ_WRITE_TOKEN` is set correctly
2. **File Too Large**: Ensure files are under 5MB
3. **Invalid File Type**: Only image files are supported
4. **Network Errors**: Check your internet connection

### Debug Steps

1. Check browser console for error messages
2. Verify environment variables are loaded
3. Test the `/api/upload` endpoint directly
4. Check Vercel dashboard for blob storage status

## Next Steps

- Consider implementing image optimization
- Add support for multiple image uploads
- Implement image deletion functionality
- Add image cropping/editing features 