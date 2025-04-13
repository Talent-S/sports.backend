import { Role, UserProfile } from '@prisma/client';

export interface UserProfilePayload extends UserProfile {
  socialLinks: object;
}

interface AuthUserPayload {
  id: string;
  email: string;
  role: Role;
  permissions: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUserPayload;
    }
  }
}
export interface UserProfileRepoInterface {
  createProfile(data: UserProfilePayload): Promise<UserProfile>;
  updateProfile(
    id: string,
    data: Partial<Omit<UserProfilePayload, 'id'>>
  ): Promise<UserProfile>;
  findProfileById(userId: string): Promise<UserProfile | null>;
  findProfiles(
    limit: number,
    page: number,
    userType: Role
  ): Promise<{ users: UserProfile[]; page: number; totalPages: number }>;
  findProfileByUsername(username: string): Promise<UserProfile | null>;
}
