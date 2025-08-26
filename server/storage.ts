import { type User, type InsertUser, type Product, type InsertProduct, type Category, type InsertCategory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  searchProducts(query: string): Promise<Product[]>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private categories: Map<string, Category>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categoriesData: InsertCategory[] = [
      {
        name: "Feminine Care",
        slug: "feminine-care",
        description: "Organic, sustainable feminine hygiene products",
        image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Gaming & Tech",
        slug: "gaming-tech",
        description: "Premium phone and gaming accessories",
        image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Kids Learning",
        slug: "kids-learning",
        description: "Educational toys and books for children",
        image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Fitness Gear",
        slug: "fitness-gear",
        description: "Premium workout equipment and accessories",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300"
      }
    ];

    categoriesData.forEach(cat => {
      const category: Category = { ...cat, id: randomUUID() };
      this.categories.set(category.id, category);
    });

    // Seed products
    const productsData: InsertProduct[] = [
      {
        name: "Organic Cotton Pads",
        description: "100% organic cotton feminine hygiene pads for sensitive skin. Biodegradable and plastic-free.",
        price: "24.99",
        category: "feminine-care",
        image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        inStock: 50,
        features: ["100% Organic Cotton", "Biodegradable", "Plastic-Free", "Hypoallergenic"]
      },
      {
        name: "Menstrual Cup Set",
        description: "Eco-friendly reusable menstrual cup with sterilizing case and cleaning brush.",
        price: "32.99",
        category: "feminine-care",
        image: "https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        inStock: 30,
        features: ["Medical Grade Silicone", "Reusable", "Eco-Friendly", "Includes Case"]
      },
      {
        name: "Pro Gaming Controller",
        description: "Wireless gaming controller for mobile devices with customizable buttons and ergonomic design.",
        price: "79.99",
        category: "gaming-tech",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        inStock: 25,
        features: ["Wireless Connectivity", "Customizable Buttons", "Ergonomic Design", "20-hour Battery"]
      },
      {
        name: "Wireless Charging Pad",
        description: "Fast wireless charging for all Qi-enabled devices with LED status indicator.",
        price: "39.99",
        category: "gaming-tech",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        inStock: 40,
        features: ["Fast Charging", "Qi-Compatible", "LED Indicator", "Compact Design"]
      },
      {
        name: "STEM Learning Kit",
        description: "Interactive educational toys for ages 5-12 including building blocks, circuits, and coding games.",
        price: "45.99",
        category: "kids-learning",
        image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        inStock: 35,
        features: ["Ages 5-12", "STEM Education", "Interactive Learning", "Multiple Activities"]
      },
      {
        name: "Educational Puzzle Set",
        description: "Set of 6 progressive puzzles teaching geography, animals, and problem-solving skills.",
        price: "28.99",
        category: "kids-learning",
        image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        inStock: 45,
        features: ["6 Puzzles Included", "Progressive Difficulty", "Educational Content", "Durable Materials"]
      },
      {
        name: "Premium Yoga Mat",
        description: "Non-slip eco-friendly yoga mat with carrying strap and alignment lines.",
        price: "59.99",
        category: "fitness-gear",
        image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        inStock: 20,
        features: ["Non-Slip Surface", "Eco-Friendly", "Alignment Lines", "Carrying Strap"]
      },
      {
        name: "Resistance Band Set",
        description: "Complete resistance band set with 5 different resistance levels and workout guide.",
        price: "34.99",
        category: "fitness-gear",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=400&h=300",
        inStock: 30,
        features: ["5 Resistance Levels", "Workout Guide", "Portable", "Durable Material"]
      }
    ];

    productsData.forEach(prod => {
      const product: Product = { 
        ...prod, 
        id: randomUUID(),
        inStock: prod.inStock ?? 0,
        features: prod.features ?? []
      };
      this.products.set(product.id, product);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      inStock: insertProduct.inStock ?? 0,
      features: insertProduct.features ?? []
    };
    this.products.set(id, product);
    return product;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) =>
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery)
    );
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }
}

export const storage = new MemStorage();
