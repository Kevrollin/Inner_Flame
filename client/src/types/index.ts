export interface MentalRealm {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  bgImage: string;
  progress: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bgImage: string;
  ctaText: string;
  ctaAction: string;
}

export interface UserState {
  id?: number;
  email?: string;
  username?: string;
  isAuthenticated: boolean;
  progress?: number;
}

export interface ReflectionEntry {
  id: number;
  content: string;
  realmId?: string;
  createdAt: Date;
}

export interface ParticleConfig {
  count: number;
  colors: string[];
  minSize: number;
  maxSize: number;
  speed: number;
}
