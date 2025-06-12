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

// Handle different database connection formats
let sql: any;
let db: any;

try {
  const databaseUrl = process.env.DATABASE_URL!;
  console.log('Connecting to database...');
  
  // Check if it's a valid PostgreSQL URL
  if (databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://')) {
    sql = neon(databaseUrl);
    db = drizzle(sql);
    console.log('Database connection established');
  } else {
    throw new Error('Invalid database URL format');
  }
} catch (error) {
  console.error('Database connection failed:', error);
  console.log('Falling back to in-memory storage for development');
  // We'll implement fallback storage below
}

// Initialize database tables if connection exists
async function initializeDatabase() {
  if (!sql || !db) {
    console.log('Skipping database initialization - no connection');
    return;
  }

  try {
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
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
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
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
    if (!db) throw new Error('Database not available');
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    if (!db) throw new Error('Database not available');
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    if (!db) throw new Error('Database not available');
    const result = await db.select().from(users).where(eq(users.username, username));
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (!db) throw new Error('Database not available');
    const result = await db.insert(users).values(insertUser).returning();
    const user = result[0];
    
    const realms = ['fear', 'doubt', 'anxiety', 'self-worth', 'forgiveness', 'wisdom'];
    const progressValues = realms.map(realm => ({
      userId: user.id,
      realmId: realm,
      progress: realm === 'fear' ? 85 : 0,
      isUnlocked: realm === 'fear' || realm === 'doubt',
    }));
    
    await db.insert(userProgress).values(progressValues);
    return user;
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

export class MemoryStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private userProgress: Map<string, UserProgress> = new Map();
  private reflections: Map<number, Reflection> = new Map();
  private currentUserId: number = 1;
  private currentProgressId: number = 1;
  private currentReflectionId: number = 1;

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    
    const realms = ['fear', 'doubt', 'anxiety', 'self-worth', 'forgiveness', 'wisdom'];
    for (const realm of realms) {
      const progressId = this.currentProgressId++;
      const progress: UserProgress = {
        id: progressId,
        userId: id,
        realmId: realm,
        progress: realm === 'fear' ? 85 : 0,
        isUnlocked: realm === 'fear' || realm === 'doubt',
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.userProgress.set(`${id}-${realm}`, progress);
    }
    
    return user;
  }

  async getUserProgress(userId: number): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async getRealmProgress(userId: number, realmId: string): Promise<UserProgress | undefined> {
    return this.userProgress.get(`${userId}-${realmId}`);
  }

  async updateUserProgress(userId: number, realmId: string, progressUpdate: Partial<InsertUserProgress>): Promise<UserProgress> {
    const key = `${userId}-${realmId}`;
    const existing = this.userProgress.get(key);
    
    if (!existing) {
      const id = this.currentProgressId++;
      const newProgress: UserProgress = {
        id,
        userId,
        realmId,
        progress: 0,
        isUnlocked: false,
        completedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...progressUpdate,
      };
      this.userProgress.set(key, newProgress);
      return newProgress;
    }
    
    const updated: UserProgress = {
      ...existing,
      ...progressUpdate,
      updatedAt: new Date(),
    };
    
    this.userProgress.set(key, updated);
    return updated;
  }

  async getUserReflections(userId: number): Promise<Reflection[]> {
    return Array.from(this.reflections.values())
      .filter(reflection => reflection.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRealmReflections(userId: number, realmId: string): Promise<Reflection[]> {
    return Array.from(this.reflections.values())
      .filter(reflection => reflection.userId === userId && reflection.realmId === realmId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async createReflection(insertReflection: InsertReflection): Promise<Reflection> {
    const id = this.currentReflectionId++;
    const reflection: Reflection = {
      ...insertReflection,
      id,
      metadata: insertReflection.metadata || null,
      createdAt: new Date(),
    };
    this.reflections.set(id, reflection);
    return reflection;
  }
}

export const storage = db ? new DatabaseStorage() : new MemoryStorage();
