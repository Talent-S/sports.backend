import { Media, PrismaClient } from '@prisma/client';
import {
  MediaPayload,
  MediaRepoInterface,
} from '../interfaces/media.interface';

export class MediaRepository implements MediaRepoInterface {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createMedia(data: MediaPayload): Promise<Media> {
    return this.prisma.media.create({ data });
  }

  async deleteMedia(id: string): Promise<Media> {
    return this.prisma.media.delete({ where: { id } });
  }

  async getMedias(userId: string): Promise<Media[]> {
    return this.prisma.media.findMany({ where: { userId } });
  }
  async getMedia(id: string): Promise<Media | null> {
    return this.prisma.media.findUnique({ where: { id } });
  }
}
