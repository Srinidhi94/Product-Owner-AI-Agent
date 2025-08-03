/**
 * Sample TypeScript file for testing codebase analysis
 */

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export class UserService {
  private users: Map<string, UserProfile> = new Map();

  async createUser(userData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> {
    const id = this.generateId();
    const now = new Date();
    
    const user: UserProfile = {
      id,
      ...userData,
      createdAt: now,
      updatedAt: now
    };

    this.users.set(id, user);
    return user;
  }

  async getUserById(id: string): Promise<UserProfile | null> {
    return this.users.get(id) || null;
  }

  async updateUser(id: string, updates: Partial<Omit<UserProfile, 'id' | 'createdAt'>>): Promise<UserProfile | null> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      return null;
    }

    const updatedUser: UserProfile = {
      ...existingUser,
      ...updates,
      updatedAt: new Date()
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}
