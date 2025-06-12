import { users, userProgress, reflections, type User, type InsertUser, type UserProgress, type InsertUserProgress, type Reflection, type InsertReflection } from "@shared/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { eq, and, desc } from "drizzle-orm";

// Use Supabase PostgreSQL connection string from .env
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

console.log("DATABASE_URL:", process.env.DATABASE_URL);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // User progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getRealmProgress(userId: number, realmId: string): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, realmId: string, progress: Partial<InsertUserProgress>): Promise<UserProgress>;

  // Reflection methods
  getUserReflections(userId: number): Promise<Reflection[]>;
  getRealmReflections(userId: number, realmId: string): Promise<Reflection[]>;
  createReflection(reflection: InsertReflection): Promise<Reflection>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Ensure all required fields are present
    if (!('email' in insertUser) || !('password' in insertUser) || !('username' in insertUser)) {
      throw new Error("Missing required user fields: email, password, or username");
    }
    const { email, password, username, currentRealm, overallProgress } = insertUser as InsertUser & { email: string; password: string; username: string };
    const userToInsert = {
      email,
      password,
      username,
      currentRealm: currentRealm ?? null,
      overallProgress: overallProgress ?? 0,
    };
    const result = await db.insert(users).values(userToInsert).returning();
    const user = result[0];

    const realms = ['fear', 'doubt', 'anxiety', 'self-worth', 'forgiveness', 'wisdom'];
    const progressValues = realms.map(realm => ({
      userId: user.id,
      realmId: realm,
      progress: 0,
      isUnlocked: realm === 'fear',
      isCompleted: false,
    }));

    await db.insert(userProgress).values(progressValues);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const result = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return result[0];
  }

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async getRealmProgress(userId: number, realmId: string): Promise<UserProgress | undefined> {
    const result = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.realmId, realmId)));
    return result[0];
  }

  async updateUserProgress(userId: number, realmId: string, progressUpdate: Partial<InsertUserProgress>): Promise<UserProgress> {
    const existing = await this.getRealmProgress(userId, realmId);

    if (!existing) {
      const newProgress = {
        userId,
        realmId,
        progress: 0,
        isUnlocked: false,
        ...progressUpdate,
      };
      const result = await db.insert(userProgress).values(newProgress).returning();
      return result[0];
    }

    const result = await db.update(userProgress)
      .set({ ...progressUpdate, updatedAt: new Date() })
      .where(and(eq(userProgress.userId, userId), eq(userProgress.realmId, realmId)))
      .returning();

    return result[0];
  }

  async getUserReflections(userId: number): Promise<Reflection[]> {
    return await db.select().from(reflections)
      .where(eq(reflections.userId, userId))
      .orderBy(desc(reflections.createdAt));
  }

  async getRealmReflections(userId: number, realmId: string): Promise<Reflection[]> {
    return await db.select().from(reflections)
      .where(and(eq(reflections.userId, userId), eq(reflections.realmId, realmId)))
      .orderBy(desc(reflections.createdAt));
  }

  async createReflection(insertReflection: InsertReflection): Promise<Reflection> {
    const result = await db.insert(reflections).values(insertReflection).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
