const createError = require('http-errors');
const express = require('express');
const path = require('path');
//const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const cool = require('cool-ascii-faces');

// Router
const config = require('./config');

const indexRouter = require('./routes/indexRouter');
const usersRouter = require('./routes/userRouter');
const cartRouter = require('./routes/cartRouter');
const orderRouter = require('./routes/orderRouter');
const shopRouter = require('./routes/shopRouter');
const checkoutRouter = require('./routes/checkoutRouter');
const uploadRouter = require('./routes/uploadRouter');

// Admin router
const adminDashboard = require('./routes/admin/indexRouter')
const adminProducts = require('./routes/admin/productRouter')
const adminOrders = require('./routes/admin/orderRouter')
const adminUsers = require('./routes/admin/userRouter')
const adminUpload = require('./routes/admin/uploadRouter')

const app = express();

const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
mongoose.connect(
  process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
}).then(() => {
  console.log("Database connected.")
});

// view engine setup
app.set('views', path.join(__dirname, 'views/pages'));
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("style", express.static(__dirname, + 'style'));
app.use("img", express.static(__dirname, + 'img'));
app.use("script", express.static(__dirname, + 'script'));

app.use(session({
  name: 'session-id',
  secret: process.env.SESSION_KEY,
  saveUninitialized: false,
  resave: false,
  store: new FileStore(),
  cookie: {
    maxAge: 60 * 60 * 1000 * 24
  }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/cart', cartRouter);
app.use('/orders', orderRouter);
app.use('/shop', shopRouter);
app.use('/checkout', checkoutRouter);
app.use('/imageUpload', uploadRouter);

// Use admin router
app.use('/admin', adminDashboard);
app.use('/admin/products', adminProducts);
app.use('/admin/orders', adminOrders);
app.use('/admin/users', adminUsers);
app.use('/admin/imageUpload', adminUpload);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
