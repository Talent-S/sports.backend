import { MediaType } from '@prisma/client';
import {
  DocumentPayload,
  MediaRepoInterface,
} from '../interfaces/media.interface';
import {
  deleteFileFromS3,
  File,
  getS3ObjectKey,
  uploadToS3,
} from '../utils/aws';
import { ForbiddenError, NotFoundError, ValidationError } from '../utils/error';

export class MediaService {
  private _repo: MediaRepoInterface;
  constructor(repo: MediaRepoInterface) {
    this._repo = repo;
  }
  async uploadMedia(
    userId: string,
    data: {
      title: string;
      file: File;
      type: MediaType;
    }
  ) {
    if (!userId || !data) throw new ValidationError('Missing userId or data');
    const { title, file, type } = data;
    if (!title || !file) throw new ValidationError('Missing title or file');
    const key = `/media/${userId}/${Date.now().toString()}`;
    const url = await uploadToS3(file, key);
    return await this._repo.createMedia({ userId, title, url, type });
  }

  async deleteMedia(userId: string, id: string) {
    const mediaExist = await this._repo.getMedia(id);
    if (!mediaExist) throw new NotFoundError('Media not found!');
    if (mediaExist.userId !== userId) {
      throw new ForbiddenError(
        `You don't have permission to delete this media`
      );
    }
    const s3Key = getS3ObjectKey(mediaExist.url);
    if (s3Key) {
      await deleteFileFromS3(s3Key);
    }
    return await this._repo.deleteMedia(id);
  }
  async userMedia(userId: string) {
    return await this._repo.getMedias(userId);
  }
  async addDocument(data: DocumentPayload & { image?: File }) {
    let { title, image, userId } = data;
    if (!userId || !data) throw new ValidationError('Missing userId or data');
    if (!title || !image) throw new ValidationError('Missing title or image');
    const key = `/documents/${userId}/${Date.now().toString()}`;
    const url = await uploadToS3(image, key);
    if (image) {
      delete data.image;
    }
    return await this._repo.createDocument({ ...data, userId, imageUrl: url });
  }
  async deleteDocument(userId: string, id: string) {
    const documentExist = await this._repo.getDocument(id);
    if (!documentExist) throw new NotFoundError('Document not found!');
    if (documentExist.userId !== userId) {
      throw new ForbiddenError(
        `You don't have permission to delete this document`
      );
    }
    if (documentExist.imageUrl) {
      const s3Key = getS3ObjectKey(documentExist.imageUrl);
      if (s3Key) {
        await deleteFileFromS3(s3Key);
      }
    }
    return await this._repo.deleteDocument(id);
  }
}
