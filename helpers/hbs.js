const moment = require('moment');
const readingTime = require('reading-time');

module.exports = {
  formatDate: (date, blog) => {
    if (blog === true) {
      return moment(date).fromNow();
    } else {
      return moment(date).format('MMM D, YYYY');
    }
  },
  stats: (body, blog) => {
    const stats = readingTime(body);
    if (blog === true) {
      return `${stats.text}`;
    } else {
      return `${stats.text} (${stats.words} words) so far`;
    }
  },
  canEdit: (loggedInUser, userProfile) => {
    if (JSON.stringify(loggedInUser._id) === JSON.stringify(userProfile._id)) {
      return `<a href="/users/settings">Edit Profile</a>`;
    }
  },
  isLiked: (user, postId) => {
    likedPosts = user.liked.map(post => JSON.stringify(post));
    liked = [...new Set(likedPosts)];
    if (liked.includes(JSON.stringify(postId))) {
      return '';
    } else {
      return '-o';
    }
  },
  getCount: count => {
    if (count > 0) {
      return count;
    } else {
      return '';
    }
  },
  truncate: (str, len) => {
    if (str.length > len && str.length > 0) {
      let newStr = str + '';
      newStr = str.substr(0, len);
      newStr = str.substr(0, newStr.lastIndexOf(' '));
      newStr = newStr.length > 0 ? newStr : str.substr(0, len);
      return newStr + '...';
    }
    return str;
  },
  stripTags: input => {
    input = input.replace(/<(?:.|\n)*?>/gm, '');
    return input.replace(/&nbsp;/gm, ' ');
  },
  select: (option, status) => {
    if (option === status) {
      return 'selected';
    }
  },
  uppercase: status => {
    return `${status[0].toUpperCase()}${status.slice(1)}`;
  },
};
