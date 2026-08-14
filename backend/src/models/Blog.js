const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  excerpt: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  coverImageUrl: { type: String, default: '' },
  tags: [{ type: String, trim: true }],
  author: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, default: 'WeIntern Team' },
  },
  published: { type: Boolean, default: true },
}, { timestamps: true });

blogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Blog', blogSchema);
