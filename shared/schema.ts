import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  image: text("image").notNull(),
  inStock: integer("in_stock").notNull().default(0),
  features: jsonb("features").default([]),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export const categories = pgTable("categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").default(""),
  image: text("image").default(""),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const aboutSection = pgTable("about_section", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  // Mission Section
  missionTitle: text("mission_title").default("Our Mission"),
  missionContent: text("mission_content").default(""),
  missionImage: text("mission_image").default(""),
  // Story Section
  storyTitle: text("story_title").default("Our Story"),
  storyContent: text("story_content").default(""),
  // Values Section
  valuesTitle: text("values_title").default("Our Values"),
  valuesSubtitle: text("values_subtitle").default("The principles that guide everything we do at Innovora"),
  // Stats Section
  statsTitle: text("stats_title").default("Our Impact"),
  statsSubtitle: text("stats_subtitle").default("Numbers that reflect our commitment to excellence and customer satisfaction"),
  statsCustomers: text("stats_customers").default("10,000+"),
  statsProducts: text("stats_products").default("500+"),
  statsCountries: text("stats_countries").default("25+"),
  statsSatisfaction: text("stats_satisfaction").default("99%"),
  updatedAt: text("updated_at").notNull().default(sql`now()`),
});

export const insertAboutSectionSchema = createInsertSchema(aboutSection).omit({
  id: true,
  updatedAt: true,
});

export type InsertAboutSection = z.infer<typeof insertAboutSectionSchema>;
export type AboutSection = typeof aboutSection.$inferSelect;
