import express from 'express';
import { userAuthorizer } from '../middlewares/auth.middleware';
import { mediaController } from '../controllers/media.controller';
import { upload } from '../../utils/multer';
const router = express.Router();

router.post(
  '/',
  userAuthorizer,
  upload.single('media'),
  mediaController.uploadMedia
);
router.delete('/:id', userAuthorizer, mediaController.deleteMedia);
router.get('/', userAuthorizer, mediaController.userMedia);
export default router;
