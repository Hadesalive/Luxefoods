# 🍞 Kings Bakery - Restaurant & Bakery Website

A modern, responsive restaurant and bakery website built with Next.js 15, TypeScript, and Tailwind CSS. Features online ordering, admin dashboard, and beautiful UI/UX design.

## 🌟 Features

### 🍽️ Restaurant Features
- **Online Menu** - Browse local and international dishes
- **Online Ordering** - Easy-to-use ordering system
- **Cart Management** - Add/remove items with real-time updates
- **WhatsApp Integration** - Direct order submission via WhatsApp
- **Responsive Design** - Works perfectly on all devices
- **Dark/Light Mode** - Toggle between themes

### 🛠️ Admin Features
- **Dashboard** - Overview of menu items and categories
- **Menu Management** - Add, edit, and delete menu items
- **Category Management** - Organize menu by categories
- **QR Code Generator** - Create branded QR codes for easy ordering
- **Local Storage Authentication** - Simple and secure admin access

### 🎨 Design Features
- **Modern UI/UX** - Beautiful animations and interactions
- **Yellow/Black Theme** - Consistent branding throughout
- **Framer Motion** - Smooth animations and transitions
- **Mobile-First** - Optimized for mobile devices
- **SEO Optimized** - Meta tags, structured data, and sitemap

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Local Storage (Custom)
- **Deployment**: Vercel
- **Icons**: Lucide React

## 📱 Pages & Routes

### Public Pages
- `/` - Homepage with hero section and menu preview
- `/order` - Full menu with ordering functionality
- `/products` - Product catalog
- `/products/[id]` - Individual product pages
- `/cart` - Shopping cart
- `/checkout` - Order checkout
- `/contact` - Contact information
- `/about` - About page
- `/login` - Admin login

### Admin Pages
- `/admin` - Dashboard overview
- `/admin/menu` - Menu item management
- `/admin/categories` - Category management

### API Routes
- `/api/menu` - Menu items API
- `/api/admin/menu-items` - Admin menu management
- `/api/admin/categories` - Admin category management
- `/api/send-whatsapp` - WhatsApp order submission
- `/api/upload` - Image upload functionality

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm
- Supabase account (for database)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd kings-bakery
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env

# App Configuration
NEXT_PUBLIC_APP_URL=https://thekingsbakerysl.com
```

### 4. Database Setup
1. Create a Supabase project
2. Run the SQL scripts in `database/schema.sql`
3. Add sample data using `database/sample-data.sql`

### 5. Run Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## 🔐 Authentication

### Local Storage Authentication
- Sessions last for 6 months
- No server-side authentication required
- Simple and secure for small businesses

## 📁 Project Structure

```
kings-bakery/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard pages
│   ├── api/               # API routes
│   ├── cart/              # Shopping cart
│   ├── checkout/          # Checkout process
│   ├── contact/           # Contact page
│   ├── login/             # Admin login
│   ├── order/             # Order page
│   └── products/          # Product pages
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Authentication components
│   ├── ui/               # Shadcn/ui components
│   └── [main components] # Main site components
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
│   ├── images/           # Images and logos
│   └── [favicon files]   # Favicon and PWA assets
├── styles/               # Global styles
└── types/                # TypeScript type definitions
```

## 🎨 Customization

### Colors & Theme
The project uses a yellow/black theme. Update colors in:
- `tailwind.config.ts` - Tailwind configuration
- `components/theme-provider.tsx` - Theme provider
- Individual components for specific styling

### Branding
- Update logo: `public/images/logo.jpg`
- Update favicon: `public/favicon.ico` and related files
- Update site metadata: `app/layout.tsx`

### Menu Items
- Add categories and items through the admin dashboard
- Or directly in the database using Supabase

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
The project can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📊 Performance Optimization
- **Aggressive Caching** - 15-minute cache duration
- **Local Storage** - Client-side caching
- **Image Optimization** - Next.js Image component
- **Code Splitting** - Automatic by Next.js
- **ISR (Incremental Static Regeneration)** - 15-minute revalidation

### Bundle Size
- **First Load JS**: ~100KB
- **Optimized Components** - Only essential UI components included
- **Tree Shaking** - Unused code automatically removed

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Code Quality
- **TypeScript** - Full type safety
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks (if configured)

## 📈 SEO & Analytics

### SEO Features
- **Meta Tags** - Complete meta information
- **Open Graph** - Social media sharing
- **Structured Data** - JSON-LD schema markup
- **Sitemap** - Automatic sitemap generation
- **Robots.txt** - Search engine directives

### Analytics Ready
- Google Analytics 4
- Facebook Pixel
- Custom event tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support or questions:
- **Email**: ahmadbahoffcial@gmail.com
- **Phone**: +232 74762243
- **Address**: 12 cemetery road adonkia freetown

## 🌟 Acknowledgments

- **Next.js Team** - Amazing framework
- **Vercel** - Deployment platform
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful UI components
- **Framer Motion** - Smooth animations

---

**Built with ❤️ from Alpha Amadu Bah for Kings Bakery Restaurant**

