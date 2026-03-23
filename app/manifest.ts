import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'LUXE FOOD - The Bites Of Delight',
    short_name: 'LUXE FOOD',
    description: 'Order delicious food from LUXE FOOD. Quality meals delivered in Freetown, Sierra Leone.',
    start_url: '/order',
    display: 'standalone',
    background_color: '#FFFDF8',
    theme_color: '#eab308',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
