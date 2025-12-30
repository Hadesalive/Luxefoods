import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Kings Bakery - Order Online',
    short_name: 'Kings Bakery',
    description: 'Order delicious food from The Kings Bakery',
    start_url: '/order',
    display: 'standalone',
    background_color: '#111827',
    theme_color: '#ea580c',
    icons: [
      {
        src: '/images/logo.jpg',
        sizes: '192x192',
        type: 'image/jpeg',
      },
      {
        src: '/images/logo.jpg',
        sizes: '512x512',
        type: 'image/jpeg',
      },
    ],
  }
}

