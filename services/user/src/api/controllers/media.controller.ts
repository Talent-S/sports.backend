import { NextFunction, Request, Response } from 'express';
import { MediaService } from '../../services/media.service';
import { MediaRepository } from '../../repositories/media.repository';
const mediaService = new MediaService(new MediaRepository());
const uploadMedia = async (req: Request, res: Response, next: NextFunction) => {
  const { title, type } = req.body;
  const file = req.file;
  try {
    if (!title || !file || !type) {
      res.status(400).json({ error: 'Missing title or file or type' });
      return;
    }
    const userId = req.user!.id;
    const media = await mediaService.uploadMedia(userId, { title, file, type });
    res.status(201).json(media);
  } catch (error) {
    return next(error);
  }
};

const deleteMedia = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!id) {
    res.status(400).json({ error: 'Missing media id' });

    return;
  }
  try {
    const media = await mediaService.deleteMedia(req.user!.id, id);
    res.status(200).json(media);
  } catch (error) {
    return next(error);
  }
};

const userMedia = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const medias = await mediaService.userMedia(req.user!.id);
    res.status(200).json(medias);
  } catch (error) {
    return next(error);
  }
};

export const mediaController = {
  uploadMedia,
  deleteMedia,
  userMedia,
};
