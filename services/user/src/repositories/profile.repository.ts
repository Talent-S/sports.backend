import { PrismaClient, UserProfile } from '@prisma/client';
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
  async updateProfile(data: UserProfilePayload): Promise<UserProfile> {
    return await this._prisma.userProfile.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
  async findProfileById(userId: string): Promise<UserProfile | null> {
    return await this._prisma.userProfile.findUnique({
      where: { id: userId },
    });
  }
  async findProfiles(limit: number, page: number): Promise<UserProfile[]> {
    return this._prisma.userProfile.findMany({
      take: limit,
      skip: (page - 1) * limit,
    });
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
