import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { getUserNotifications, markNotificationsAsRead } from '../controllers/notificationController.js';

const router = express.Router();

router.get('/', protect,getUserNotifications );

router.put('/mark-as-read', protect, markNotificationsAsRead);

export default router;