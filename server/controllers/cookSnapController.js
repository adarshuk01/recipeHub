import CookSnap from '../models/CookSnap.js';
import Recipe from '../models/Recipe.js';

// Create CookSnap
export const createCookSnap = async (req, res) => {
  try {
    const { caption, recipeId } = req.body;
       const image = req.file?.path || req.body.image || '';


    const userId = req.user._id; // assuming user is attached by auth middleware

    // Optional: Check if recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

    const cookSnap = await CookSnap.create({
      image,
      caption,
      recipe: recipeId,
      user: userId
    });

    res.status(201).json(cookSnap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All CookSnaps (optionally filter by recipe)
export const getCookSnaps = async (req, res) => {
  try {
    const { recipeId } = req.query;
    console.log('recipeId'.recipeId);
    
    const filter = recipeId ? { recipe: recipeId } : {};

    const snaps = await CookSnap.find(filter)
      .populate('user', 'name avatar')
      .populate('recipe', 'title');

    res.status(200).json(snaps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Single CookSnap
export const getCookSnapById = async (req, res) => {
    console.log('hello');
    
  try {
    const snap = await CookSnap.findById(req.params.id)
      .populate('user', 'name')
      .populate('recipe', 'title');

    if (!snap) return res.status(404).json({ message: 'CookSnap not found' });

    res.status(200).json(snap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMyCookSnap = async (req, res, next) => {
  try {
    const snaps = await CookSnap.find({ user: req.params.id })
      .populate('user', 'name')
      .populate({
        path: 'recipe',
        select: 'title mainPhoto user',
        populate: {
          path: 'user',
          select: 'name avatar', // or any fields you want from the user of the recipe
        },
      });

    res.status(200).json(snaps);
  } catch (err) {
    next(err);
  }
};


// Update CookSnap
export const updateCookSnap = async (req, res) => {
  try {
    const { image, caption } = req.body;

    const updatedSnap = await CookSnap.findByIdAndUpdate(
      req.params.id,
      { image, caption },
      { new: true }
    );

    if (!updatedSnap) return res.status(404).json({ message: 'CookSnap not found' });

    res.status(200).json(updatedSnap);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete CookSnap
export const deleteCookSnap = async (req, res) => {
  try {
    const deletedSnap = await CookSnap.findByIdAndDelete(req.params.id);
    if (!deletedSnap) return res.status(404).json({ message: 'CookSnap not found' });

    res.status(200).json({ message: 'CookSnap deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
