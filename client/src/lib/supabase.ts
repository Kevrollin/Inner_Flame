// For now, we'll create a mock auth service that matches Supabase's interface
// In production, this would be replaced with actual Supabase client

export interface AuthUser {
  id: number;
  email: string;
  username: string;
}

export interface AuthResponse {
  user: AuthUser | null;
  error: Error | null;
}

class MockAuthService {
  private currentUser: AuthUser | null = null;

  async signUp(email: string, password: string, username: string): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        return { user: null, error: new Error(error.message) };
      }

      const data = await response.json();
      this.currentUser = data.user;
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }

  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        return { user: null, error: new Error(error.message) };
      }

      const data = await response.json();
      this.currentUser = data.user;
      localStorage.setItem('innerflame_user', JSON.stringify(data.user));
      return { user: data.user, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }

  async signOut(): Promise<{ error: Error | null }> {
    this.currentUser = null;
    localStorage.removeItem('innerflame_user');
    return { error: null };
  }

  getUser(): AuthUser | null {
    if (this.currentUser) return this.currentUser;
    
    const stored = localStorage.getItem('innerflame_user');
    if (stored) {
      try {
        this.currentUser = JSON.parse(stored);
        return this.currentUser;
      } catch {
        localStorage.removeItem('innerflame_user');
      }
    }
    return null;
  }
}

export const authService = new MockAuthService();
