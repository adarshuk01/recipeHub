import mongoose from 'mongoose';

const cookSnapSchema = new mongoose.Schema({
  image: { type: String, required: true }, // Cloudinary URL
  caption: { type: String, trim: true },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const CookSnap = mongoose.model('CookSnap', cookSnapSchema);
export default CookSnap;
