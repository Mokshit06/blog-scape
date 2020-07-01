const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongoose').Types;
const { ensureAuth } = require('../middleware/auth');

const User = require('../models/User');
const BlogPost = require('../models/BlogPost');

/**
 * @desc  Add Blog
 * @route POST /blog
 */
router.post('/', ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id;
    await BlogPost.create(req.body);
    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

/**
 * @desc  Show add page
 * @route GET /blog/add
 */
router.get('/add', ensureAuth, (req, res) => {
  res.render('blogs/add');
});

/**
 * @desc  Show all blogs
 * @route GET /blog/
 */
router.get('/', ensureAuth, async (req, res) => {
  try {
    const blogPosts = await BlogPost.find({ status: 'public' })
      .populate('user')
      .sort({ createdAt: 'desc' })
      .lean();

    res.render('blogs/index', {
      blogPosts,
    });
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

/**
 * @desc  Show blog
 * @route GET /blog/:id
 */
router.get('/:id', ensureAuth, async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.render('error/404');
  }

  try {
    const blogPost = await BlogPost.findById(id).populate('user').lean();

    if (
      blogPost.status === 'private' &&
      JSON.stringify(req.user._id) != JSON.stringify(blogPost.user._id)
    ) {
      return res.redirect('/dashboard');
    }

    if (!blogPost) {
      return res.render('error/404');
    }

    res.render('blogs/show', {
      blogPost,
    });
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

/**
 * @desc  Show edit page
 * @route GET /blog/edit/:id
 */
router.get('/edit/:id', ensureAuth, async (req, res) => {
  const id = req.params.id;

  if (!ObjectId.isValid(id)) {
    return res.render('error/404');
  }

  const blogPost = await BlogPost.findById(id).lean();
  if (!blogPost) {
    return res.render('error/404');
  }
  if (blogPost.user != req.user.id) {
    return res.redirect('/');
  }

  res.render('blogs/edit', {
    blogPost,
  });
});

/**
 * @desc  Update blog
 * @route PATCH /blog/:id
 */
router.patch('/:id', ensureAuth, async (req, res) => {
  const id = req.params.id;
  try {
    let blogPost = await BlogPost.findById(id).lean();

    if (!blogPost) {
      return res.render('error/404');
    }

    if (blogPost.user != req.user.id) {
      return res.redirect('/');
    }

    blogPost = await BlogPost.findByIdAndUpdate(id, req.body, {
      new: false,
      runValidators: true,
    });

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

/**
 * @desc Like blog
 * @route PATCH blog/like/:id
 */
router.patch('/like/:id', ensureAuth, async (req, res) => {
  const id = req.params.id;
  try {
    let blogPost = await BlogPost.findById(id).populate('user').lean();

    if (!blogPost) {
      return res.render('error/404');
    }

    await User.findByIdAndUpdate(req.user.id, {
      $push: { liked: blogPost._id },
    });

    await BlogPost.findByIdAndUpdate(id, { $inc: { likes: 1 } });
  } catch (error) {
    res.render('error/500');
  }
});

/**
 * @desc  Delete blog
 * @route PATCH /blog/:id
 */
router.delete('/:id', ensureAuth, async (req, res) => {
  const id = req.params.id;
  try {
    const blogPost = await BlogPost.findByIdAndDelete(id);

    if (!blogPost) {
      return res.render('error/404');
    }

    if (blogPost.user != req.user.id) {
      return res.redirect('/');
    }

    res.redirect('/dashboard');
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

module.exports = router;
