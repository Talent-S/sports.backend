import { Document, Media, PrismaClient } from '@prisma/client';
import {
  DocumentPayload,
  MediaPayload,
  MediaRepoInterface,
} from '../interfaces/media.interface';

export class MediaRepository implements MediaRepoInterface {
  private _prisma: PrismaClient;

  constructor() {
    this._prisma = new PrismaClient();
  }

  async createMedia(data: MediaPayload): Promise<Media> {
    return this._prisma.media.create({ data });
  }

  async deleteMedia(id: string): Promise<Media> {
    return this._prisma.media.delete({ where: { id } });
  }

  async getMedias(userId: string): Promise<Media[]> {
    return this._prisma.media.findMany({ where: { userId } });
  }
  async getMedia(id: string): Promise<Media | null> {
    return this._prisma.media.findUnique({ where: { id } });
  }
  async createDocument(data: DocumentPayload): Promise<Document> {
    return this._prisma.document.create({ data });
  }
  async deleteDocument(id: string): Promise<Document> {
    return this._prisma.document.delete({ where: { id } });
  }
  async getDocuments(userId: string): Promise<Document[]> {
    return this._prisma.document.findMany({ where: { userId } });
  }
  async updateDocument(id: string, data: DocumentPayload): Promise<Document> {
    return this._prisma.document.update({ where: { id }, data });
  }
  async getDocument(id: string): Promise<Document | null> {
    return this._prisma.document.findUnique({ where: { id } });
  }
}
