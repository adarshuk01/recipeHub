import express from 'express';
import {
  createCookSnap,
  getCookSnaps,
  getCookSnapById,
  updateCookSnap,
  deleteCookSnap,
  getMyCookSnap
} from '../controllers/cookSnapController.js';
import { protect } from '../middleware/authMiddleware.js';
import { createStorage, multer } from '../utils/cloudinary.js';

const upload = multer({ storage: createStorage('RecipeHub_CookSnap') });

const router = express.Router();

router.route('/')
  .get(getCookSnaps)
  .post(protect, upload.single('image'), createCookSnap);

router.get('/mycooksnap/:id', getMyCookSnap);

router.route('/:id')
  .get(getCookSnapById)
  .put(protect, updateCookSnap)
  .delete(protect, deleteCookSnap);

export default router;
