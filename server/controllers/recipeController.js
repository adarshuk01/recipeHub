import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
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
    await recipe.remove();
    res.json({ message: 'Recipe removed' });
  } catch (err) { next(err); }
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
    if (idx === -1) {
      recipe.likes.push(userId);
    } else {
      recipe.likes.splice(idx, 1);
    }
    await recipe.save();
    res.json({ likesCount: recipe.likes.length, liked: idx === -1 });
  } catch (err) { next(err); }
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
