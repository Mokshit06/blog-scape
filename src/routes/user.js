const express = require('express');
const { ensureAuth } = require('../middleware/auth');
const BlogPost = require('../models/BlogPost');
const User = require('../models/User');
const router = express.Router();

/**
 * @desc  Show user posts
 * @route GET /users/@:username
 */
router.get('/@:username', ensureAuth, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).lean();

    if (!user) {
      return res.render('error/404');
    }

    const blogPosts = await BlogPost.find({
      user: user._id,
      status: 'public',
    })
      .populate('user')
      .lean();

    if (!blogPosts) {
      return res.render('error/404');
    }

    const mostLiked = blogPosts.sort((a, b) => b.likes - a.likes)[0];

    res.render('user/user', {
      userProfile: user,
      mostLiked,
      blogPosts,
    });
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

/**
 * @desc  Update user info
 * @route PATCH /users/settings
 */
router.patch('/settings', ensureAuth, async (req, res) => {
  try {
    const user = req.user;
    const errors = [];
    const { displayName, bio } = req.body;

    if (!displayName) {
      errors.push({ msg: 'Please fill the name' });
    }

    if (bio.length > 45) {
      errors.push({ msg: 'Bio cant be longer than 45 characters' });
    }

    if (errors.length > 0) {
      res.render('user/settings', {
        errors,
      });
    } else {
      await User.findByIdAndUpdate(user.id, req.body, {
        new: false,
        runValidators: true,
      });
      res.redirect(`/users/@${user.username}`);
    }
  } catch (error) {
    console.error(error);
    res.render('error/500');
  }
});

/**
 * @desc  Show user settings
 * @route GET /users/settings
 */
router.get('/settings', ensureAuth, (req, res) => {
  const user = req.user;
  if (!user) {
    return res.render('error/404');
  }
  res.render('user/settings');
});

module.exports = router;
