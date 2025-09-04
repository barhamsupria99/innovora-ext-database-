# Innovora Market

A modern e-commerce platform built with React, TypeScript, and Node.js, featuring a comprehensive admin panel for product management and Cloudflare R2 integration for image storage.

## 🚀 Features

### Customer Features
- **Product Catalog**: Browse products by category with search functionality
- **Product Details**: Detailed product pages with features and specifications
- **Shopping Cart**: Add/remove products with quantity management
- **Responsive Design**: Mobile-first design that works on all devices
- **Modern UI**: Clean, professional interface with smooth animations

### Admin Features
- **Product Management**: Create, read, update, and delete products
- **Image Upload**: Upload and manage product images via Cloudflare R2
- **Category Management**: Organize products into categories
- **About Page Management**: Update company information and images
- **Real-time Updates**: Immediate UI updates with database persistence
- **Stock Management**: Track and update product inventory

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Wouter** for routing
- **TanStack Query** for data fetching
- **Zustand** for state management
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Drizzle ORM** with PostgreSQL
- **Multer** for file uploads
- **Zod** for validation

### Database & Storage
- **PostgreSQL** (Neon Database)
- **Cloudflare R2** for image storage
- **Drizzle ORM** for database operations

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- PostgreSQL database (or Neon account)
- Cloudflare R2 account

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd innovora-market
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the environment template and configure your variables:

```bash
cp env-template.txt .env
```

Update the `.env` file with your configuration:

```bash
# Database Configuration
DATABASE_URL=your_database_url_here

# Cloudflare R2 Configuration
CLOUDFLARE_R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id_here
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key_here
CLOUDFLARE_R2_BUCKET_NAME=your_bucket_name_here
CLOUDFLARE_R2_PUBLIC_URL=https://pub-your-account-id.r2.dev
CLOUDFLARE_R2_ACCOUNT_ID=your_account_id_here

# Image Upload Configuration
MAX_IMAGE_SIZE_MB=10

# Server Configuration
PORT=4025
NODE_ENV=development
```

### 4. Database Setup
The application will automatically create the necessary database tables on first run.

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:4025

## 🔐 Admin Access

### Admin Panel URL
Access the admin panel at: **`/admin-soups`**

**Important**: The admin panel is accessible at `/admin-soups` (not `/admin`). This is a security feature to prevent unauthorized access.

### Admin Features
- **Product Management**: Add, edit, delete products
- **Image Upload**: Upload product images (up to 10MB by default)
- **Category Management**: Manage product categories
- **About Page**: Update company information
- **Stock Management**: Update product inventory levels

### Admin Workflow
1. Navigate to `/admin-soups`
2. Use the "Add Product" button to create new products
3. Click "Edit" on any product to modify details
4. Upload images using the drag-and-drop interface
5. Update stock quantities and product information
6. Changes are saved immediately to the database

## 📁 Project Structure

```
innovora-market/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Backend Node.js application
│   ├── routes.ts           # API routes
│   ├── storage.ts          # Database operations
│   └── cloudflare-r2.ts    # Image storage service
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schemas
└── dist/                   # Built application
```

## 🖼️ Image Management

### Supported Formats
- **File Types**: PNG, JPG, JPEG, GIF, WebP
- **Size Limit**: Configurable (default: 10MB)
- **Storage**: Cloudflare R2 with public URLs

### Image Specifications
- **Product Images**: Square aspect ratio (400x400px minimum)
- **About Page Images**: Rectangular format (1200x800px recommended)
- **Upload Interface**: Drag-and-drop with preview

### Configuring Image Size Limit
Update the `MAX_IMAGE_SIZE_MB` environment variable:
```bash
MAX_IMAGE_SIZE_MB=5  # For 5MB limit
MAX_IMAGE_SIZE_MB=20 # For 20MB limit
```

## 🗄️ Database Schema

### Products Table
- `id`: Unique identifier
- `name`: Product name
- `description`: Product description
- `price`: Product price (decimal)
- `category`: Product category
- `image`: Image URL
- `inStock`: Stock quantity
- `features`: JSON array of product features

### Categories Table
- `id`: Unique identifier
- `name`: Category name
- `slug`: URL-friendly category identifier
- `description`: Category description
- `image`: Category image URL

### About Section Table
- `id`: Unique identifier
- `title`: Section title
- `description`: Section description
- `image`: Section image URL
- `updatedAt`: Last update timestamp

## 🚀 Deployment

### Railway Deployment
This project is configured for Railway deployment with:
- Automatic builds from Git
- Environment variable management
- Database and storage integration

### Environment Variables for Production
Ensure all environment variables are set in your deployment platform:
- Database connection string
- Cloudflare R2 credentials
- Image size limits
- Server configuration

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### API Endpoints

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

#### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:slug` - Get category by slug

#### Images
- `POST /api/admin/upload/image` - Upload image
- `DELETE /api/admin/upload/image` - Delete image

#### About Section
- `GET /api/about` - Get about section
- `PUT /api/admin/about` - Update about section

## 🔧 Configuration

### Image Upload Settings
- **Default Size Limit**: 10MB
- **Supported Formats**: PNG, JPG, JPEG, GIF, WebP
- **Storage Provider**: Cloudflare R2
- **Public Access**: Enabled

### Database Settings
- **ORM**: Drizzle
- **Database**: PostgreSQL (Neon)
- **Connection**: Environment variable `DATABASE_URL`

## 🐛 Troubleshooting

### Common Issues

#### Images Not Loading
1. Check Cloudflare R2 configuration
2. Verify `CLOUDFLARE_R2_PUBLIC_URL` matches your account ID
3. Ensure bucket has public read access

#### Admin Panel Not Accessible
- Use the correct URL: `/admin-soups` (not `/admin`)
- Check browser console for any errors

#### Upload Failures
1. Verify file size is under the limit
2. Check file format is supported
3. Ensure Cloudflare R2 credentials are correct

### Debug Mode
Enable debug logging by setting:
```bash
NODE_ENV=development
```

## 📝 License

This project is proprietary software. All rights reserved.

## 🤝 Support

For support and questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Contact the development team

---

**Built with ❤️ for modern e-commerce**
