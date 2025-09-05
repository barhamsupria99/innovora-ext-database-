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
          updatedAt: new Date().toISOString(),
          missionTitle: insertAbout.missionTitle || null,
          missionContent: insertAbout.missionContent || null,
          missionImage: insertAbout.missionImage || null,
          storyTitle: insertAbout.storyTitle || null,
          storyContent: insertAbout.storyContent || null,
          valuesTitle: insertAbout.valuesTitle || null,
          valuesSubtitle: insertAbout.valuesSubtitle || null,
          statsTitle: insertAbout.statsTitle || null,
          statsSubtitle: insertAbout.statsSubtitle || null,
          statsCustomers: insertAbout.statsCustomers || null,
          statsProducts: insertAbout.statsProducts || null,
          statsCountries: insertAbout.statsCountries || null,
          statsSatisfaction: insertAbout.statsSatisfaction || null
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
                mission_title = ${updatedAbout.missionTitle},
                mission_content = ${updatedAbout.missionContent},
                mission_image = ${updatedAbout.missionImage},
                story_title = ${updatedAbout.storyTitle},
                story_content = ${updatedAbout.storyContent},
                values_title = ${updatedAbout.valuesTitle},
                values_subtitle = ${updatedAbout.valuesSubtitle},
                stats_title = ${updatedAbout.statsTitle},
                stats_subtitle = ${updatedAbout.statsSubtitle},
                stats_customers = ${updatedAbout.statsCustomers},
                stats_products = ${updatedAbout.statsProducts},
                stats_countries = ${updatedAbout.statsCountries},
                stats_satisfaction = ${updatedAbout.statsSatisfaction},
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
          updatedAt: new Date().toISOString(),
          missionTitle: insertAbout.missionTitle || null,
          missionContent: insertAbout.missionContent || null,
          missionImage: insertAbout.missionImage || null,
          storyTitle: insertAbout.storyTitle || null,
          storyContent: insertAbout.storyContent || null,
          valuesTitle: insertAbout.valuesTitle || null,
          valuesSubtitle: insertAbout.valuesSubtitle || null,
          statsTitle: insertAbout.statsTitle || null,
          statsSubtitle: insertAbout.statsSubtitle || null,
          statsCustomers: insertAbout.statsCustomers || null,
          statsProducts: insertAbout.statsProducts || null,
          statsCountries: insertAbout.statsCountries || null,
          statsSatisfaction: insertAbout.statsSatisfaction || null
        };
        
        try {
          await this.db.insert(aboutSection).values(newAbout);
        } catch (drizzleError) {
          await this.sql`
            INSERT INTO about_section (id, title, description, image, mission_title, mission_content, mission_image, story_title, story_content, values_title, values_subtitle, stats_title, stats_subtitle, stats_customers, stats_products, stats_countries, stats_satisfaction, updated_at)
            VALUES (${newAbout.id}, ${newAbout.title}, ${newAbout.description}, ${newAbout.image}, ${newAbout.missionTitle || "Our Mission"}, ${newAbout.missionContent || ""}, ${newAbout.missionImage || ""}, ${newAbout.storyTitle || "Our Story"}, ${newAbout.storyContent || ""}, ${newAbout.valuesTitle || "Our Values"}, ${newAbout.valuesSubtitle || "The principles that guide everything we do at Innovora"}, ${newAbout.statsTitle || "Our Impact"}, ${newAbout.statsSubtitle || "Numbers that reflect our commitment to excellence and customer satisfaction"}, ${newAbout.statsCustomers || "10,000+"}, ${newAbout.statsProducts || "500+"}, ${newAbout.statsCountries || "25+"}, ${newAbout.statsSatisfaction || "99%"}, ${newAbout.updatedAt})
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

// Initialize database storage - DATABASE_URL is required
let storage: IStorage;
try {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is required. Please configure your database connection.");
  }
  
  console.log("🗄️ Initializing database storage...");
  storage = new DatabaseStorage();
  console.log("✅ Database storage initialized successfully");
} catch (error) {
  console.error("❌ Failed to initialize database storage:", error);
  throw new Error(`Database initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

export { storage };
