import Notification from "../models/Notification.js";


export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipientId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const markNotificationsAsRead = async (req, res) => {
    console.log('req.user.id',req.user.id);
    
  try {
    await Notification.updateMany(
      { recipientId: req.user.id, read: false },
      { $set: { read: true } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error marking notifications as read", err);
    res.status(500).json({ message: 'Server error' });
  }
};