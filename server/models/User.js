import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  location: { type: String, trim: true },
  bio: { type: String, maxlength: 300 },
  avatar: { type: String }, // cloudinary url
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
