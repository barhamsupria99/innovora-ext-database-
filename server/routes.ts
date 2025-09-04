import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import multer from "multer";
import { ImageService } from "./cloudflare-r2";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure multer for file uploads
  const maxFileSize = parseInt(process.env.MAX_IMAGE_SIZE_MB || '10') * 1024 * 1024; // Default 10MB
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: maxFileSize,
    },
    fileFilter: (req, file, cb) => {
      // Accept only image files
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    },
  });

  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      res.json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        database: process.env.DATABASE_URL ? "connected" : "not configured"
      });
    } catch (error) {
      res.status(500).json({ 
        status: "unhealthy", 
        error: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Get all products
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search } = req.query;
      
      let products;
      if (search) {
        products = await storage.searchProducts(search as string);
      } else if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProduct(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Get category by slug
  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategory(slug);
      
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Newsletter subscription endpoint
  app.post("/api/newsletter", async (req, res) => {
    try {
      const emailSchema = z.object({
        email: z.string().email("Invalid email address")
      });
      
      const { email } = emailSchema.parse(req.body);
      
      // In a real app, this would save to database and send to email service
      console.log(`Newsletter subscription: ${email}`);
      
      res.json({ message: "Successfully subscribed to newsletter" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to subscribe to newsletter" });
    }
  });

  // Admin Product Management Endpoints
  // Create new product
  app.post("/api/admin/products", async (req, res) => {
    try {
      const productSchema = z.object({
        name: z.string().min(1, "Product name is required"),
        description: z.string().min(1, "Description is required"),
        price: z.string().min(1, "Price is required"),
        category: z.string().min(1, "Category is required"),
        image: z.string().url("Valid image URL is required"),
        inStock: z.number().int().min(0, "Stock must be non-negative"),
        features: z.array(z.string()).optional().default([])
      });
      
      const productData = productSchema.parse(req.body);
      console.log("Creating product with data:", productData);
      const product = await storage.createProduct(productData);
      
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Update existing product
  app.put("/api/admin/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const productSchema = z.object({
        name: z.string().min(1, "Product name is required"),
        description: z.string().min(1, "Description is required"),
        price: z.string().min(1, "Price is required"),
        category: z.string().min(1, "Category is required"),
        image: z.string().url("Valid image URL is required"),
        inStock: z.number().int().min(0, "Stock must be non-negative"),
        features: z.array(z.string()).optional().default([])
      });
      
      const productData = productSchema.parse(req.body);
      const updatedProduct = await storage.updateProduct(id, productData);
      
      res.json(updatedProduct);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      if (error instanceof Error && error.message === "Product not found") {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  // Delete product
  app.delete("/api/admin/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProduct(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Image upload endpoints
  app.post("/api/admin/upload/image", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const { folder = 'products' } = req.body;
      const result = await ImageService.uploadFile(
        req.file.buffer,
        req.file.mimetype,
        folder
      );

      res.json({
        url: result.url,
        key: result.key,
        message: "Image uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ message: "Failed to upload image" });
    }
  });

  app.delete("/api/admin/upload/image", async (req, res) => {
    try {
      const { key } = req.body;
      
      if (!key) {
        return res.status(400).json({ message: "Image key is required" });
      }

      const deleted = await ImageService.deleteFile(key);
      
      if (deleted) {
        res.json({ message: "Image deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete image" });
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ message: "Failed to delete image" });
    }
  });

  // About section endpoints
  app.get("/api/about", async (req, res) => {
    try {
      const about = await storage.getAboutSection();
      res.json(about);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch about section" });
    }
  });

  app.put("/api/admin/about", async (req, res) => {
    try {
      const aboutSchema = z.object({
        title: z.string().min(1, "Title is required"),
        description: z.string().min(1, "Description is required"),
        image: z.string().url("Valid image URL is required"),
      });
      
      const aboutData = aboutSchema.parse(req.body);
      console.log("Updating about section with data:", aboutData);
      const about = await storage.updateAboutSection(aboutData);
      
      res.json(about);
    } catch (error) {
      console.error("Error updating about section:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to update about section" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
