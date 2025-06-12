import { users, userProgress, reflections, type User, type InsertUser, type UserProgress, type InsertUserProgress, type Reflection, type InsertReflection } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, and, desc } from "drizzle-orm";

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

// Database connection
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// Initialize database tables
async function initializeDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        current_realm TEXT DEFAULT 'fear',
        overall_progress INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        realm_id TEXT NOT NULL,
        progress INTEGER DEFAULT 0 NOT NULL,
        is_unlocked BOOLEAN DEFAULT FALSE NOT NULL,
        is_completed BOOLEAN DEFAULT FALSE NOT NULL,
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        UNIQUE(user_id, realm_id)
      );
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS reflections (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        realm_id TEXT,
        content TEXT NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );
    `;

    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
}

// Initialize database on startup
initializeDatabase();

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
    const result = await db.insert(users).values(insertUser).returning();
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
    if (!db) throw new Error('Database not available');
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async getRealmProgress(userId: number, realmId: string): Promise<UserProgress | undefined> {
    if (!db) throw new Error('Database not available');
    const result = await db.select().from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.realmId, realmId)));
    return result[0];
  }

  async updateUserProgress(userId: number, realmId: string, progressUpdate: Partial<InsertUserProgress>): Promise<UserProgress> {
    if (!db) throw new Error('Database not available');
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
    if (!db) throw new Error('Database not available');
    return await db.select().from(reflections)
      .where(eq(reflections.userId, userId))
      .orderBy(desc(reflections.createdAt));
  }

  async getRealmReflections(userId: number, realmId: string): Promise<Reflection[]> {
    if (!db) throw new Error('Database not available');
    return await db.select().from(reflections)
      .where(and(eq(reflections.userId, userId), eq(reflections.realmId, realmId)))
      .orderBy(desc(reflections.createdAt));
  }

  async createReflection(insertReflection: InsertReflection): Promise<Reflection> {
    if (!db) throw new Error('Database not available');
    const result = await db.insert(reflections).values(insertReflection).returning();
    return result[0];
  }
}

// Add interface method for updating user
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;
  
  // User progress methods
  getUserProgress(userId: number): Promise<UserProgress[]>;
  getRealmProgress(userId: number, realmId: string): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, realmId: string, progress: Partial<InsertUserProgress>): Promise<UserProgress>;
  
  // Reflection methods
  getUserReflections(userId: number): Promise<Reflection[]>;
  getRealmReflections(userId: number, realmId: string): Promise<Reflection[]>;
  createReflection(reflection: InsertReflection): Promise<Reflection>;
}

export const storage = new DatabaseStorage();
