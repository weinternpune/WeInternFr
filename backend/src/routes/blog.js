const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const Blog = require('../models/Blog');

const slugify = (str = '') =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// ---- Public: list all published posts (blog history) ----------------------
router.get('/', async (req, res) => {
  try {
    const posts = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .select('title slug excerpt coverImageUrl tags author createdAt');
    res.json({ success: true, data: posts });
  } catch (err) {
    console.error('Blog list error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load blog posts' });
  }
});

// ---- Admin: list all posts including unpublished ---------------------------
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  try {
    const posts = await Blog.find().sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) {
    console.error('Blog admin list error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load posts' });
  }
});

// ---- Public: single post by slug ------------------------------------------
router.get('/:slug', async (req, res) => {
  try {
    const post = await Blog.findOne({ slug: req.params.slug, published: true });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json({ success: true, data: post });
  } catch (err) {
    console.error('Blog detail error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to load post' });
  }
});

// ---- Admin: create a post ---------------------------------------------------
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, excerpt, content, coverImageUrl, tags, published } = req.body;
    if (!title || !excerpt || !content) {
      return res.status(400).json({ success: false, message: 'Title, excerpt, and content are required' });
    }

    let slug = slugify(title);
    const existing = await Blog.findOne({ slug });
    if (existing) slug = `${slug}-${Date.now().toString().slice(-5)}`;

    const post = await Blog.create({
      title,
      slug,
      excerpt,
      content,
      coverImageUrl: coverImageUrl || '',
      tags: Array.isArray(tags) ? tags : (tags || '').split(',').map((t) => t.trim()).filter(Boolean),
      author: { id: req.user._id, name: req.user.name || 'WeIntern Team' },
      published: published !== false,
    });

    res.status(201).json({ success: true, data: post });
  } catch (err) {
    console.error('Blog create error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to create post' });
  }
});

// ---- Admin: update a post ---------------------------------------------------
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const { title, excerpt, content, coverImageUrl, tags, published } = req.body;
    const update = { excerpt, content, coverImageUrl, published };
    if (title) update.title = title;
    if (tags) update.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim()).filter(Boolean);

    const post = await Blog.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    res.json({ success: true, data: post });
  } catch (err) {
    console.error('Blog update error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to update post' });
  }
});

// ---- Admin: delete a post ----------------------------------------------------
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const post = await Blog.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, message: 'Post deleted' });
  } catch (err) {
    console.error('Blog delete error:', err.message);
    res.status(500).json({ success: false, message: 'Failed to delete post' });
  }
});

module.exports = router;
