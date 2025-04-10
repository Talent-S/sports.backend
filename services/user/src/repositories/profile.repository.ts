import { PrismaClient, Role, UserProfile } from '@prisma/client';
import {
  UserProfilePayload,
  UserProfileRepoInterface,
} from '../interfaces/profile.interface';

export class UserProfileRepository implements UserProfileRepoInterface {
  _prisma: PrismaClient;
  constructor() {
    this._prisma = new PrismaClient();
  }
  async createProfile(data: UserProfilePayload): Promise<UserProfile> {
    return await this._prisma.userProfile.create({
      data,
    });
  }
  async updateProfile(
    id: string,
    data: Partial<Omit<UserProfilePayload, 'id'>>
  ): Promise<UserProfile> {
    return await this._prisma.userProfile.update({
      where: {
        id,
      },
      data,
    });
  }
  async findProfileById(userId: string): Promise<UserProfile | null> {
    return await this._prisma.userProfile.findUnique({
      where: { id: userId },
    });
  }
  async findProfiles(
    limit: number,
    page: number,
    userType: Role
  ): Promise<{ users: UserProfile[]; page: number; totalPages: number }> {
    const users = await this._prisma.userProfile.findMany({
      where: {
        role: userType,
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    const totalPages = Math.ceil(
      (await this._prisma.userProfile.count({ where: { role: userType } })) /
        limit
    );
    return {
      users,
      page,
      totalPages,
    };
  }
  async findProfileByMobile(mobile: string): Promise<UserProfile | null> {
    return await this._prisma.userProfile.findUnique({
      where: { mobileNumber: mobile },
    });
  }
  async findProfileByUsername(username: string) {
    return await this._prisma.userProfile.findUnique({
      where: { username },
      include: {
        uploads: true,
        documents: true,
        services: true,
      },
    });
  }
}
