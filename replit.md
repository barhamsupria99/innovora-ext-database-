# Overview

Innovora is a modern e-commerce platform built as a full-stack web application that specializes in premium lifestyle products across multiple categories including feminine care, gaming & tech, kids learning, and fitness gear. The application features a responsive React frontend with shadcn/ui components, an Express.js backend with TypeScript, and uses Drizzle ORM with PostgreSQL for data management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for build tooling
- **UI Library**: shadcn/ui components built on Radix UI primitives with Tailwind CSS for styling
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: 
  - Zustand for cart state with persistence to localStorage
  - TanStack React Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom CSS variables for theming

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Development Setup**: tsx for development server with hot reloading
- **Build Process**: esbuild for production bundling
- **API Design**: RESTful endpoints for products, categories, and search functionality
- **Error Handling**: Centralized error middleware with proper HTTP status codes
- **Request Logging**: Custom middleware for API request/response logging

## Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **In-Memory Fallback**: MemStorage class for development/testing with seeded data
- **Connection**: Neon Database serverless PostgreSQL for production

## Development and Build Tools
- **Development Server**: Vite dev server integrated with Express backend
- **Build Process**: Separate builds for client (Vite) and server (esbuild)
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Path Aliases**: Configured for clean imports (@/, @shared/, @assets/)

## Key Features
- **Product Catalog**: Multi-category product browsing with search and filtering
- **Shopping Cart**: Persistent cart functionality with add/remove/update operations
- **Responsive Design**: Mobile-first approach with responsive navigation
- **Image Optimization**: External image hosting with optimized loading
- **Toast Notifications**: User feedback for cart operations and form submissions

# External Dependencies

## Database and ORM
- **@neondatabase/serverless**: Serverless PostgreSQL connection for Neon Database
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-zod**: Integration between Drizzle and Zod for validation

## UI and Styling
- **@radix-ui/***: Comprehensive collection of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: For creating type-safe component variants
- **clsx**: Utility for conditional CSS classes

## State Management and Data Fetching
- **@tanstack/react-query**: Server state management and caching
- **zustand**: Lightweight state management for client state

## Development Tools
- **vite**: Fast build tool and development server
- **esbuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution engine for development
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay

## Form Handling and Validation
- **react-hook-form**: Performant forms with minimal re-renders
- **@hookform/resolvers**: Validation resolvers for react-hook-form
- **zod**: Schema validation library

## Additional Libraries
- **wouter**: Lightweight router for React
- **date-fns**: Date utility library
- **lucide-react**: Icon library
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel/slider component