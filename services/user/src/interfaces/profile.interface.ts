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
  updateProfile(data: UserProfilePayload): Promise<UserProfile>;
  findProfileById(userId: string): Promise<UserProfile | null>;
  findProfiles(limit: number, page: number): Promise<UserProfile[]>;
  findProfileByMobile(mobile: string): Promise<UserProfile | null>;
}
