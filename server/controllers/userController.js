import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import bcrypt from 'bcrypt';
import Notification from '../models/Notification.js';
import { getIo, getConnectedUsers } from '../socket.js';

export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const recipes = await Recipe.find({ user: user._id }).sort({ createdAt: -1 });
    res.json({ user, recipes });
  } catch (err) { next(err); }
};

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const { name, email, password, location, bio } = req.body;
    console.log('req files', req.file?.path || req.body.image);

    const avatar = req.file?.path || req.body.image || '';
    console.log(avatar);

    console.log(req.body);

    if (name) user.name = name;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    if (location) user.location = location;
    if (bio) user.bio = bio;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updated = await user.save();
    res.json({
      _id: updated._id, name: updated.name, email: updated.email, avatar: updated.avatar, location: updated.location,
      bio: updated.bio
    });
  } catch (err) { next(err); }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const { recipeId } = req.params;
    if (!user) return res.status(404).json({ message: 'User not found' });

    const idx = user.favorites.indexOf(recipeId);
    if (idx === -1) {
      user.favorites.push(recipeId);
    } else {
      user.favorites.splice(idx, 1);
    }

    await user.save();
    res.json({ favorites: user.favorites });
  } catch (err) { next(err); }
};

export const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    res.json({ favorites: user.favorites || [] });
  } catch (err) { next(err); }
};


export const toggleFollow = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const targetUserId = req.params.id;

    if (currentUserId === targetUserId) {
      return res.status(400).json({ message: "You can't follow yourself." });
    }

    const currentUser = await User.findById(currentUserId).select('name following');
    const targetUser = await User.findById(targetUserId).select('followers');

    if (!targetUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const isFollowing = currentUser.following.includes(targetUserId);

    if (isFollowing) {
      // Unfollow
      currentUser.following.pull(targetUserId);
      targetUser.followers.pull(currentUserId);

      // Optional: delete previous follow notification
      await Notification.deleteOne({
        recipientId: targetUserId,
        senderId: currentUserId,
        type: 'follow',
      });

    } else {
      // Follow
      currentUser.following.push(targetUserId);
      targetUser.followers.push(currentUserId);

      // Check for existing follow notification
      const existing = await Notification.findOne({
        recipientId: targetUserId,
        senderId: currentUserId,
        type: 'follow',
      });

      if (!existing) {
        const senderName = currentUser.name || 'Someone';
        const message = `${senderName} started following you.`;

        const notification = new Notification({
          recipientId: targetUserId,
          senderId: currentUserId,
          senderName, // 👈 Add this
          type: 'follow',
          message,
        });

        await notification.save();

        // Emit real-time notification if target user is connected
        const io = getIo();
        const connectedUsers = getConnectedUsers();
        const recipientSocketId = connectedUsers[targetUserId];

        if (recipientSocketId) {
          io.to(recipientSocketId).emit('new_notification', notification);
        }
      }
    }

    await currentUser.save();
    await targetUser.save();

    res.json({
      message: isFollowing ? 'Unfollowed user.' : 'Followed user.',
      isFollowing: !isFollowing,
    });

  } catch (err) {
    next(err);
  }
};

// Get followers of a user
export const getFollowers = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'name avatar');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.followers);
  } catch (err) {
    next(err);
  }
};

// Get users the user is following
export const getFollowing = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('following', 'name avatar');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.following);
  } catch (err) {
    next(err);
  }
};