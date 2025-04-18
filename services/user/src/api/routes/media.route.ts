import express from 'express';
import { userAuthorizer } from '../middlewares/auth.middleware';
import { mediaController } from '../controllers/media.controller';
import { upload } from '../../utils/multer';
const router = express.Router();

router.post(
  '/media',
  userAuthorizer,
  upload.single('media'),
  mediaController.uploadMedia
);
router.delete('/media/:id', userAuthorizer, mediaController.deleteMedia);
router.get('/media', userAuthorizer, mediaController.userMedia);
router.post(
  '/document',
  userAuthorizer,
  upload.single('image'),
  mediaController.uploadDocument
);
router.delete('/document/:id', userAuthorizer, mediaController.deleteDocument);
export default router;
