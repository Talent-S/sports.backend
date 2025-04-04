import { Document, Media } from '@prisma/client';

export type MediaPayload = Pick<Media, 'title' | 'url' | 'userId' | 'type'>;
export type DocumentPayload = Omit<Document, 'id' | 'createdAt' | 'updatedAt'>;
export interface MediaRepoInterface {
  createMedia(data: MediaPayload): Promise<Media>;
  deleteMedia(id: string): Promise<Media>;
  getMedias(userId: string): Promise<Media[]>;
  getMedia(id: string): Promise<Media | null>;
  createDocument(data: DocumentPayload): Promise<Document>;
  getDocument(id: string): Promise<Document | null>;
  deleteDocument(id: string): Promise<Document>;
  getDocuments(userId: string): Promise<Document[]>;
  updateDocument(id: string, data: DocumentPayload): Promise<Document>;
}
