import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipientId: { type: String, required: true },
  senderId: { type: String, required: true },
  recipeId: { type: String},
   senderName: { type: String }, // 👈 Add this
  type: { type: String, required: true, default: 'like' },
  message: { type: String, required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
