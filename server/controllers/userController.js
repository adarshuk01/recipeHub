import User from '../models/User.js';
import Recipe from '../models/Recipe.js';
import bcrypt from 'bcrypt';

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
    console.log('req files',req.file?.path || req.body.image);
    
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
    res.json({ _id: updated._id, name: updated.name, email: updated.email, avatar: updated.avatar ,location: updated.location,
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
