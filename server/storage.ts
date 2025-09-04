import { type User, type InsertUser, type Product, type InsertProduct, type Category, type InsertCategory, type AboutSection, type InsertAboutSection, products, categories, users, aboutSection } from "@shared/schema";
import { randomUUID } from "crypto";
import { drizzle } from "drizzle-orm/neon-serverless";
import { neon } from "@neondatabase/serverless";
import { eq, like, or } from "drizzle-orm";
import { config } from "dotenv";

// Load environment variables
config();

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
  searchProducts(query: string): Promise<Product[]>;
  
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // About Section
  getAboutSection(): Promise<AboutSection | undefined>;
  updateAboutSection(about: InsertAboutSection): Promise<AboutSection>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private categories: Map<string, Category>;
  private aboutSection: AboutSection | undefined;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.aboutSection = undefined;
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
      const category: Category = { 
        ...cat, 
        id: randomUUID(),
        description: cat.description || null,
        image: cat.image || null
      };
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

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }
    
    const updatedProduct: Product = {
      ...existingProduct,
      ...updateData,
      id, // Ensure ID doesn't change
      inStock: updateData.inStock ?? existingProduct.inStock,
      features: updateData.features ?? existingProduct.features
    };
    
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
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
    const category: Category = { 
      ...insertCategory, 
      id,
      description: insertCategory.description || null,
      image: insertCategory.image || null
    };
    this.categories.set(id, category);
    return category;
  }

  async getAboutSection(): Promise<AboutSection | undefined> {
    return this.aboutSection;
  }

  async updateAboutSection(insertAbout: InsertAboutSection): Promise<AboutSection> {
    const id = this.aboutSection?.id || randomUUID();
    const about: AboutSection = { 
      ...insertAbout, 
      id,
      updatedAt: new Date().toISOString()
    };
    this.aboutSection = about;
    return about;
  }
}

export class DatabaseStorage implements IStorage {
  private db;
  private sql;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is required");
    }
    
    try {
      console.log("🔌 Initializing database connection...");
      console.log("DATABASE_URL:", process.env.DATABASE_URL ? "✅ Set" : "❌ Not set");
      
      // Initialize the raw SQL client for fallback
      this.sql = neon(process.env.DATABASE_URL);
      
      // Initialize Drizzle with proper configuration
      this.db = drizzle(this.sql as any);
      
      console.log("✅ Database connection initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize database connection:", error);
      throw error;
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await this.db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const newUser = { ...insertUser, id };
    await this.db.insert(users).values(newUser);
    return newUser;
  }

  async getProducts(): Promise<Product[]> {
    try {
      // First try with Drizzle ORM
      try {
        const result = await this.db.select().from(products);
        return result;
      } catch (drizzleError) {
        // Fallback to raw SQL
        const result = await this.sql`
          SELECT 
            id,
            name,
            description,
            price,
            category,
            image,
            in_stock as "inStock",
            features
          FROM products
        ` as Product[];
        return result;
      }
    } catch (error) {
      console.error("❌ Error fetching products:", error);
      throw new Error(`Failed to fetch products: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getProduct(id: string): Promise<Product | undefined> {
    try {
      const result = await this.db.select().from(products).where(eq(products.id, id)).limit(1);
      return result[0];
    } catch (drizzleError) {
      // Fallback to raw SQL
      const result = await this.sql`
        SELECT 
          id,
          name,
          description,
          price,
          category,
          image,
          in_stock as "inStock",
          features
        FROM products 
        WHERE id = ${id} 
        LIMIT 1
      ` as Product[];
      return result[0];
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await this.db.select().from(products).where(eq(products.category, category));
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const newProduct = { 
      ...insertProduct, 
      id,
      inStock: insertProduct.inStock ?? 0,
      features: insertProduct.features ?? []
    };
    await this.db.insert(products).values(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, updateData: Partial<InsertProduct>): Promise<Product> {
    const existingProduct = await this.getProduct(id);
    if (!existingProduct) {
      throw new Error("Product not found");
    }
    
    const updatedProduct = {
      id: existingProduct.id,
      name: updateData.name ?? existingProduct.name,
      description: updateData.description ?? existingProduct.description,
      price: updateData.price ?? existingProduct.price,
      category: updateData.category ?? existingProduct.category,
      image: updateData.image ?? existingProduct.image,
      inStock: updateData.inStock ?? existingProduct.inStock,
      features: updateData.features ?? existingProduct.features
    };
    
    try {
      await this.db.update(products)
        .set({
          name: updatedProduct.name,
          description: updatedProduct.description,
          price: updatedProduct.price,
          category: updatedProduct.category,
          image: updatedProduct.image,
          inStock: updatedProduct.inStock,
          features: updatedProduct.features
        })
        .where(eq(products.id, id));
    } catch (drizzleError) {
      // Fallback to raw SQL
      await this.sql`
        UPDATE products 
        SET name = ${updatedProduct.name}, 
            description = ${updatedProduct.description}, 
            price = ${updatedProduct.price}, 
            category = ${updatedProduct.category}, 
            image = ${updatedProduct.image}, 
            in_stock = ${updatedProduct.inStock}, 
            features = ${JSON.stringify(updatedProduct.features)}
        WHERE id = ${id}
      `;
    }
    
    // Fetch and return the updated product from database
    const finalProduct = await this.getProduct(id);
    return finalProduct!;
  }

  async deleteProduct(id: string): Promise<boolean> {
    const result = await this.db.delete(products).where(eq(products.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const searchTerm = `%${query.toLowerCase()}%`;
    return await this.db.select().from(products).where(
      or(
        like(products.name, searchTerm),
        like(products.description, searchTerm),
        like(products.category, searchTerm)
      )
    );
  }

  async getCategories(): Promise<Category[]> {
    try {
      // First try with Drizzle ORM
      try {
        const result = await this.db.select().from(categories);
        return result;
      } catch (drizzleError) {
        // Fallback to raw SQL
        const result = await this.sql`
          SELECT 
            id,
            name,
            slug,
            description,
            image
          FROM categories
        ` as Category[];
        return result as Category[];
      }
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      throw new Error(`Failed to fetch categories: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async getCategory(slug: string): Promise<Category | undefined> {
    const result = await this.db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
    return result[0];
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    try {
      const id = randomUUID();
      const newCategory = { 
        ...insertCategory, 
        id,
        description: insertCategory.description || null,
        image: insertCategory.image || null
      };
      console.log("Creating category with data:", newCategory);
      
      try {
        // Try with Drizzle ORM first
        await this.db.insert(categories).values(newCategory);
        console.log("Category created successfully with Drizzle");
        return newCategory;
      } catch (drizzleError) {
        console.log("Drizzle failed, falling back to raw SQL:", drizzleError);
        // Fallback to raw SQL
        const query = `
          INSERT INTO categories (id, name, slug, description, image)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
        `;
        
        const result = await this.sql(query, [
          newCategory.id,
          newCategory.name,
          newCategory.slug,
          newCategory.description,
          newCategory.image
        ]);
        
        console.log("Category created successfully with raw SQL:", result[0]);
        return result[0] as Category;
      }
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }

  async getAboutSection(): Promise<AboutSection | undefined> {
    try {
      // First try with Drizzle ORM
      try {
        const result = await this.db.select().from(aboutSection).limit(1);
        return result[0];
      } catch (drizzleError) {
        // Fallback to raw SQL
        const result = await this.sql`SELECT * FROM about_section LIMIT 1` as AboutSection[];
        return result[0];
      }
    } catch (error) {
      console.error("❌ Error fetching about section:", error);
      return undefined;
    }
  }

  async updateAboutSection(insertAbout: InsertAboutSection): Promise<AboutSection> {
    const existingAbout = await this.getAboutSection();
    
    try {
      if (existingAbout) {
        // Update existing
        const updatedAbout = {
          ...existingAbout,
          ...insertAbout,
          updatedAt: new Date().toISOString()
        };
        
        try {
          await this.db.update(aboutSection)
            .set(updatedAbout)
            .where(eq(aboutSection.id, existingAbout.id));
        } catch (drizzleError) {
          await this.sql`
            UPDATE about_section 
            SET title = ${updatedAbout.title}, 
                description = ${updatedAbout.description}, 
                image = ${updatedAbout.image}, 
                updated_at = ${updatedAbout.updatedAt}
            WHERE id = ${updatedAbout.id}
          `;
        }
        
        return updatedAbout;
      } else {
        // Create new
        const id = randomUUID();
        const newAbout = {
          ...insertAbout,
          id,
          updatedAt: new Date().toISOString()
        };
        
        try {
          await this.db.insert(aboutSection).values(newAbout);
        } catch (drizzleError) {
          await this.sql`
            INSERT INTO about_section (id, title, description, image, updated_at)
            VALUES (${newAbout.id}, ${newAbout.title}, ${newAbout.description}, ${newAbout.image}, ${newAbout.updatedAt})
          `;
        }
        
        return newAbout;
      }
    } catch (error) {
      console.error("❌ Error updating about section:", error);
      throw error;
    }
  }
}

// Use database storage if DATABASE_URL is available, otherwise fall back to memory storage
let storage: IStorage;
try {
  if (process.env.DATABASE_URL) {
    console.log("🗄️ Using database storage");
    storage = new DatabaseStorage();
  } else {
    console.log("💾 Using in-memory storage (no DATABASE_URL found)");
    storage = new MemStorage();
  }
} catch (error) {
  console.error("❌ Failed to initialize database storage, falling back to memory storage:", error);
  storage = new MemStorage();
}

export { storage };
