import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { getIo, getConnectedUsers } from '../socket.js';
import Notification from '../models/Notification.js';

/**
 * Create recipe
 * expects fields: title, description, ingredients (array or comma string),
 * steps (array or comma string), category, and optional image file (multer cloudinary)
 */
// Upload step images array to Cloudinary
const uploadFilesToCloudinary = async (files, folder) => {
  const urls = [];
  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.path, { folder });
    urls.push(result.secure_url);
  }
  return urls;
};

export const createRecipe = async (req, res, next) => {
  try {
    const { title, description, cookTime, serves, ingredients, steps } = req.body;
    console.log("Files:", req.files);
console.log("Body:", req.body);

    if (!title || !ingredients) {
      return res.status(400).json({ message: "Title and ingredients required" });
    }

    const parsedIngredients = JSON.parse(ingredients);
    const parsedSteps = JSON.parse(steps);

    // Upload main photo
    let mainPhotoUrl = "";
    if (req.files?.mainPhoto) mainPhotoUrl = req.files.mainPhoto[0].path;

    // Map images to steps
    const stepImages = req.files?.stepImages || [];
    let stepImageIndexes = req.body.stepImageIndex || [];

    // Ensure stepImageIndexes is always an array
    if (!Array.isArray(stepImageIndexes)) stepImageIndexes = [stepImageIndexes];

    // Create an empty array for images for each step
    parsedSteps.forEach((step) => (step.images = []));

    // Assign each uploaded image to its step
    stepImages.forEach((file, i) => {
      const stepIdx = Number(stepImageIndexes[i]);
      if (parsedSteps[stepIdx]) {
        parsedSteps[stepIdx].images.push(file.path);
      }
    });

    const recipe = await Recipe.create({
      title,
      description,
      cookTime,
      serves,
      mainPhoto: mainPhotoUrl,
      ingredients: parsedIngredients,
      steps: parsedSteps,
      user: req.user.id,
    });

    res.status(201).json(recipe);
  } catch (err) {
    next(err);
  }
};


export const editRecipe = async (req, res, next) => {
  try {
    const { title, description, cookTime, serves, ingredients, steps } = req.body;
    const { recipeId } = req.params;

    if (!recipeId) {
      return res.status(400).json({ message: "Recipe ID is required" });
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }

    if (recipe.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not authorized to edit this recipe" });
    }

    if (title) recipe.title = title;
    if (description) recipe.description = description;
    if (cookTime) recipe.cookTime = cookTime;
    if (serves) recipe.serves = serves;

    if (ingredients) {
      recipe.ingredients = JSON.parse(ingredients);
    }

    let parsedSteps = steps ? JSON.parse(steps) : recipe.steps;

    // Maintain structure for parsedSteps
    parsedSteps = parsedSteps.map((step, index) => ({
      text: step.text,
      images: step.images || [], // Keep existing URLs
    }));

    // Update main photo if provided
    if (req.files?.mainPhoto) {
      recipe.mainPhoto = req.files.mainPhoto[0].path;
    }

    // New uploaded step images
    const stepImages = req.files?.stepImages || [];
    let stepImageIndexes = req.body.stepImageIndex || [];

    if (!Array.isArray(stepImageIndexes)) {
      stepImageIndexes = [stepImageIndexes];
    }

    // Append new images to correct step
    stepImages.forEach((file, i) => {
      const stepIdx = Number(stepImageIndexes[i]);
      if (parsedSteps[stepIdx]) {
        parsedSteps[stepIdx].images.push(file.path);
      }
    });

    recipe.steps = parsedSteps;
    await recipe.save();

    res.status(200).json(recipe);
  } catch (err) {
    next(err);
  }
};



export const getRecipes = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt', category } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const recipes = await Recipe.find(filter)
      .populate('user', 'name avatar')
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json(recipes);
  } catch (err) { next(err); }
};

export const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('user', 'name avatar email');
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    res.json(recipe);
  } catch (err) { next(err); }
};

export const updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { title, description, ingredients, steps, category } = req.body;
    if (title) recipe.title = title;
    if (description) recipe.description = description;
    if (ingredients) recipe.ingredients = Array.isArray(ingredients) ? ingredients : ingredients.split(',').map(s=>s.trim());
    if (steps) recipe.steps = Array.isArray(steps) ? steps : steps.split('\n').map(s=>s.trim()).filter(Boolean);
    if (category) recipe.category = category;
    if (req.file?.path) recipe.image = req.file.path;

    const updated = await recipe.save();
    res.json(updated);
  } catch (err) { next(err); }
};

export const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    if (recipe.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await recipe.deleteOne(); // Use this instead of remove()

    res.json({ message: 'Recipe removed' });
  } catch (err) {
    next(err);
  }
};


export const getRecipesByUser = async (req, res, next) => {
  try {
    console.log('req.params.id',req.params);
    
    const userId = req.params.id; // get user id from authenticated request
    const recipes = await Recipe.find({ user: userId }).populate('user', 'name avatar');

    if (!recipes || recipes.length === 0) {
      return res.status(404).json({ message: 'No recipes found for this user' });
    }

    res.json(recipes);
  } catch (err) {
    next(err);
  }
};


export const likeRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const userId = req.user.id;
    const idx = recipe.likes.indexOf(userId);
    let liked = false;

    if (idx === -1) {
      // Like
      recipe.likes.push(userId);
      liked = true;

      if (recipe.user.toString() !== userId) {
        // Check if a similar notification already exists
        const existing = await Notification.findOne({
          recipientId: recipe.user.toString(),
          senderId: userId,
          recipeId: recipe._id.toString(),
          type: 'like',
        });

        if (!existing) {
          // Get sender name
          const sender = await User.findById(userId).select('name');
          const senderName = sender?.name || 'Someone';

          const message = `${senderName} liked your recipe "${recipe.title}"`;

          const notification = new Notification({
            recipientId: recipe.user.toString(),
            senderId: userId,
            recipeId: recipe._id.toString(),
            type: 'like',
            message,
          });

          await notification.save();

          // Emit via socket
          const io = getIo();
          const connectedUsers = getConnectedUsers();
          const recipientSocketId = connectedUsers[recipe.user.toString()];

          if (recipientSocketId) {
            io.to(recipientSocketId).emit('new_notification', notification);
          }
        }
      }

    } else {
      // Unlike
      recipe.likes.splice(idx, 1);

      // Optional: delete old like notification if user unlikes
      await Notification.deleteOne({
        recipientId: recipe.user.toString(),
        senderId: userId,
        recipeId: recipe._id.toString(),
        type: 'like',
      });
    }

    await recipe.save();

    res.json({ likesCount: recipe.likes.length, liked });
  } catch (err) {
    next(err);
  }
};


export const addComment = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text required' });

    recipe.comments.push({ user: req.user.id, text });
    await recipe.save();
    res.status(201).json(recipe.comments);
  } catch (err) { next(err); }
};

export const searchRecipes = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: 'q query required' });

    const regex = new RegExp(q, 'i');
    const results = await Recipe.find({
      $or: [
        { title: regex },
        { description: regex },
        { ingredients: regex },
        { category: regex }
      ]
    }).limit(50).populate('user', 'name avatar');

    res.json(results);
  } catch (err) { next(err); }
};



export const getFollowedUsersRecipes = async (req, res, next) => {
  try {
    const userId = req.user.id;
    console.log('userId ................',userId);
    

    // Get the current user and their following list
    const currentUser = await User.findById(userId).select('following');

    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch recipes from followed users
    const recipes = await Recipe.find({
      user: { $in: currentUser.following },
      isPublished: true
    })
      .populate('user', 'name avatar') // Optional: populate author info
      .sort({ createdAt: -1 });

    res.status(200).json(recipes);
  } catch (error) {
    next(error);
  }
};

// GET /api/suggestions?q=potato
export const getSuggestions = async (req, res) => {
  try {
    const query = req.query.q || ''

    if (!query.trim()) {
      return res.status(200).json([]) // return empty array for empty query
    }

    // Perform a case-insensitive search on the title field
    const suggestions = await Recipe.aggregate([
      {
        $match: {
          title: { $regex: query, $options: 'i' }
        }
      },
      {
        $group: {
          _id: '$title'
        }
      },
      {
        $limit: 10
      }
    ])

    const suggestionList = suggestions.map(s => s._id)

    res.status(200).json(suggestionList)
  } catch (error) {
    console.error('Error fetching suggestions:', error)
    res.status(500).json({ message: 'Server error while fetching suggestions' })
  }
}
