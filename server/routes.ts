import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertReflectionSchema } from "@shared/schema";
import bcrypt from "bcrypt";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });
      
      res.json({ user: { id: user.id, email: user.email, username: user.username } });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      res.json({ user: { id: user.id, email: user.email, username: user.username } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // User progress routes
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.put("/api/progress/:userId/:realmId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const realmId = req.params.realmId;
      const progressData = req.body;
      
      const updated = await storage.updateUserProgress(userId, realmId, progressData);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Reflection routes
  app.get("/api/reflections/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reflections = await storage.getUserReflections(userId);
      res.json(reflections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch reflections" });
    }
  });

  app.post("/api/reflections", async (req, res) => {
    try {
      const reflectionData = insertReflectionSchema.parse(req.body);
      const reflection = await storage.createReflection(reflectionData);
      res.json(reflection);
    } catch (error) {
      res.status(400).json({ message: "Invalid reflection data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
