import { users, userProgress, reflections, type User, type InsertUser, type UserProgress, type InsertUserProgress, type Reflection, type InsertReflection } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userProgress: Map<string, UserProgress>;
  private reflections: Map<number, Reflection>;
  private currentUserId: number;
  private currentProgressId: number;
  private currentReflectionId: number;

  constructor() {
    this.users = new Map();
    this.userProgress = new Map();
    this.reflections = new Map();
    this.currentUserId = 1;
    this.currentProgressId = 1;
    this.currentReflectionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    
    // Initialize default progress for all realms
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
    return Array.from(this.userProgress.values()).filter(
      (progress) => progress.userId === userId,
    );
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
    return Array.from(this.reflections.values()).filter(
      (reflection) => reflection.userId === userId,
    );
  }

  async getRealmReflections(userId: number, realmId: string): Promise<Reflection[]> {
    return Array.from(this.reflections.values()).filter(
      (reflection) => reflection.userId === userId && reflection.realmId === realmId,
    );
  }

  async createReflection(insertReflection: InsertReflection): Promise<Reflection> {
    const id = this.currentReflectionId++;
    const reflection: Reflection = {
      ...insertReflection,
      id,
      createdAt: new Date(),
    };
    this.reflections.set(id, reflection);
    return reflection;
  }
}

export const storage = new MemStorage();
