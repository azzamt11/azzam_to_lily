import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

// Blog posts for the left side
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  likes: integer("likes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Interactive form submissions for the right side
export const interactions = pgTable("interactions", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'message', 'date_idea', 'quiz', 'mood'
  content: jsonb("content").notNull(), // Flexible JSON for different form types
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===
export const insertPostSchema = createInsertSchema(posts).omit({ id: true, createdAt: true, likes: true });
export const insertInteractionSchema = createInsertSchema(interactions).omit({ id: true, createdAt: true });

// === EXPLICIT API TYPES ===
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

export type Interaction = typeof interactions.$inferSelect;
export type InsertInteraction = z.infer<typeof insertInteractionSchema>;

// Request types
export type CreateInteractionRequest = InsertInteraction;
export type LikePostRequest = { id: number };

// Response types
export type PostResponse = Post;
export type InteractionResponse = Interaction;
