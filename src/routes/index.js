const express = require('express');
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth');
const BlogPost = require('../models/BlogPost');

/**
 * @desc  Login/ Landing page
 * @route GET /
 */
router.get('/', ensureGuest, (req, res) => {
  res.render('login', {
    layout: 'login',
  });
});

/**
 * @desc  Dashboard
 * @route GET /dashboard
 */
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    const blogPosts = await BlogPost.find({ user: req.user.id }).lean();
    res.render('dashboard', {
      private: blogPosts.filter(post => post.status === 'private'),
      public: blogPosts.filter(post => post.status === 'public'),
    });
  } catch (error) {
    res.render('error/500');
  }
});

module.exports = router;
