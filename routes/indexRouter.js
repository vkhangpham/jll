const express = require('express');
const router = express.Router();
const cool = require('cool-ascii-faces');
const Books = require('../models/books');
const Stock = require('../models/stock');
const Orders = require('../models/orders');
const passport = require('passport');
const Users = require('../models/users');
const authenticate = require('../authenticate');

router.route('/')
  .get((req, res, next) => {
    Stock.find().sort({ sales: -1 }).limit(3)
      .populate({
        path: 'bookID',
        select: 'name image price'
      })
      .then((stock) => {
        Books.find({ category: "Fiction" })
          .then((book1) => {
            Books.find({ category: "Poetry" })
              .then((book2) => {
                Books.find({ category: "Social Science" })
                  .then((book3) => {
                    Books.find({ category: "Self-Help"})
                    .then((book4) => {
                      res.statusCode = 200;
                      res.render('index', { books: { book1: book1, book2: book2, book3: book3, book4: book4}, best_seller: stock, user: req.user });
                    }, (err) => next(err))
                  }, (err) => next(err))
              }, (err) => next(err))
          }, (err) => next(err))
      }, (err) => next(err))
      .catch((err) => next(err))
  })

router.get('/signup', (req, res, next) => {
  res.statusCode = 200;
  res.render('signup', {message: ""})
})

router.get('/login', (req, res, next) => {
  res.statusCode = 200;
  res.render('login', {message: ""});
})

router.get('/about', (req, res, next) => {
  res.statusCode = 200;
  res.render('about', { user: req.user });
});

router.get('/cool', (req, res) => res.send(cool()))

router.get('/profile', authenticate.verifyUser, (req, res, next) => {
  Users.findById(req.user._id).lean()
    .then((user) => {
      Orders.find({ user: req.user._id }).lean()
        .populate({
          path: 'items.bookID',
          select: 'name price'
        })
        .then((orders) => {
          res.statusCode = 200;
          res.render('profile', { user: user, orders: orders });

        }, (err) => next(err))
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = router;
