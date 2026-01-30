import { db } from "./db";
import {
  posts,
  interactions,
  type Post,
  type Interaction,
  type InsertInteraction,
} from "@shared/schema";
import { eq, sql } from "drizzle-orm";

export interface IStorage {
  // Posts
  getPosts(): Promise<Post[]>;
  likePost(id: number): Promise<Post | undefined>;
  createPost(post: { title: string; content: string; imageUrl?: string }): Promise<Post>;

  // Interactions
  createInteraction(interaction: InsertInteraction): Promise<Interaction>;
  getInteractions(): Promise<Interaction[]>;
}

export class DatabaseStorage implements IStorage {
  async getPosts(): Promise<Post[]> {
    return await db.select().from(posts).orderBy(posts.createdAt);
  }

  async likePost(id: number): Promise<Post | undefined> {
    const [updated] = await db
      .update(posts)
      .set({ likes: sql`${posts.likes} + 1` })
      .where(eq(posts.id, id))
      .returning();
    return updated;
  }

  async createPost(post: { title: string; content: string; imageUrl?: string }): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async createInteraction(interaction: InsertInteraction): Promise<Interaction> {
    const [newInteraction] = await db.insert(interactions).values(interaction).returning();
    return newInteraction;
  }

  async getInteractions(): Promise<Interaction[]> {
    return await db.select().from(interactions).orderBy(interactions.createdAt);
  }
}

export const storage = new DatabaseStorage();
