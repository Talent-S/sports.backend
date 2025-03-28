import { Media } from '@prisma/client';

export type MediaPayload = Pick<Media, 'title' | 'url' | 'userId' | 'type'>;
export interface MediaRepoInterface {
  createMedia(data: MediaPayload): Promise<Media>;
  deleteMedia(id: string): Promise<Media>;
  getMedias(userId: string): Promise<Media[]>;
  getMedia(id: string): Promise<Media | null>;
}
