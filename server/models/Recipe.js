import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
  text: { type: String, required: true },
  images: [{ type: String }] // Cloudinary URLs
});

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String },
  cookTime: { type: String },
  serves: { type: String },
  ingredients: [{ type: String, required: true }],
  steps: [stepSchema],
  mainPhoto: { type: String }, // Cloudinary URL
  category: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

const Recipe = mongoose.model('Recipe', recipeSchema);
export default Recipe;
