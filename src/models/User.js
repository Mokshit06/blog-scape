const mongoose = require('mongoose');
const BlogPost = require('./BlogPost');

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 45,
  },
  bio: {
    type: String,
  },
  displayName: {
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  liked: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BlogPost',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('remove', async function (next) {
  console.log(this._id);
  console.log(await BlogPost.find({ user: this._id }));
  const blogPosts = await BlogPost.deleteMany({ user: this._id });
  console.log(blogPosts);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
