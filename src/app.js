const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const exphbs = require('express-handlebars');
const passport = require('passport');
const session = require('express-session');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);
const connectDB = require('../config/db');

dotenv.config({
  path: path.join(__dirname, '../config/config.env'),
});

require('../config/passport')(passport);

connectDB();

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method') {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

const {
  formatDate,
  truncate,
  stripTags,
  select,
  stats,
  isLiked,
  getCount,
  uppercase,
  canEdit,
} = require('../helpers/hbs');

app.engine(
  '.hbs',
  exphbs({
    defaultLayout: 'main',
    helpers: {
      formatDate,
      truncate,
      stripTags,
      select,
      stats,
      isLiked,
      getCount,
      uppercase,
      canEdit,
    },
    extname: '.hbs',
  })
);
app.set('view engine', '.hbs');

app.use(
  session({
    secret: 'hello',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.user = (req.user && req.user.toJSON()) || null;
  next();
});

app.use(express.static(path.join(__dirname, '../public')));

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/blog', require('./routes/blogs'));
app.use('/users', require('./routes/user'));

/**
 * @desc  404 Page
 * @route GET /*
 */
app.get('/*', (req, res) => {
  res.render('error/404');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server is running  on ${PORT}`));
