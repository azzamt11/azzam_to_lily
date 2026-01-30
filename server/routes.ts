import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // === POSTS ===
  app.get(api.posts.list.path, async (req, res) => {
    const posts = await storage.getPosts();
    res.json(posts);
  });

  app.post(api.posts.like.path, async (req, res) => {
    const id = parseInt(req.params.id);
    const post = await storage.likePost(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  });

  // === INTERACTIONS ===
  app.get(api.interactions.list.path, async (req, res) => {
    const interactions = await storage.getInteractions();
    res.json(interactions);
  });

  app.post(api.interactions.create.path, async (req, res) => {
    try {
      const input = api.interactions.create.input.parse(req.body);
      const interaction = await storage.createInteraction(input);
      res.status(201).json(interaction);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join("."),
        });
      }
      throw err;
    }
  });

  // Seed data function
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingPosts = await storage.getPosts();
  if (existingPosts.length === 0) {
    await storage.createPost({
      title: "The First Day We Met",
      content: "I remember it like it was yesterday. The sun was shining, and you were wearing that blue shirt I love so much...",
      imageUrl: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80",
    });
    await storage.createPost({
      title: "Our First Trip",
      content: "Paris was magical, but honestly, I would have been happy anywhere as long as I was with you. Remember the croissant incident?",
      imageUrl: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80",
    });
    await storage.createPost({
      title: "Reasons I Smile",
      content: "1. Your laugh\n2. The way you make coffee\n3. Your hugs\n4. Just you, existing.",
      imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80",
    });
  }
}
