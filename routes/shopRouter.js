const express = require('express');
const mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
const Books = require('../models/books');
//const cors = require('./cors')
const Stock = require('../models/stock');
const authenticate = require('../authenticate');

const shopRouter = express.Router();

shopRouter.route('/')
    .get((req, res, next) => {
        let perPage = 12;
        let page = req.params.page || 1;
        if (req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            // Get all campgrounds from DB
            Books.find({ name: regex }, function (err, book) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('shop', { data: book, noMatch: 1, flag: 1, title: "All books", user: req.user });
                }
            });
        } else {
            Books
                .find()
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .exec((err, book) => {
                    Books.countDocuments((err, count) => {
                        if (err) {
                            return next(err);
                        }
                        res.render('shop', { data: book, current: page, pages: Math.ceil(count / perPage), noMatch: 0, flag: 1, title: "All books", user: req.user })
                    })
                })
        }
    })

shopRouter.route('/:page')
    .get((req, res, next) => {
        let perPage = 12;
        let page = req.params.page || 1;
        if (req.query.search) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            // Get all campgrounds from DB
            Books.find({ name: regex }, function (err, book) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('shop', { data: book, noMatch: 1, flag: 1, title: "All books", user: req.user });
                }
            });
        } else {
            Books
                .find()
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .exec((err, book) => {
                    Books.countDocuments((err, count) => {
                        if (err) {
                            return next(err);
                        }
                        res.render('shop', { data: book, current: page, pages: Math.ceil(count / perPage), noMatch: 0, flag: 1, title: "All books", user: req.user })
                    })
                })
        }
    })

shopRouter.route('/author/:authorName')
    .get((req, res, next) => {
        Books.find({ author: req.params.authorName }, function (err, book) {
            if (err) {
                console.log(err);
            } else {
                res.render('shop', { data: book, noMatch: 1, flag: 1, title: req.params.authorName, user: req.user });
            }
        });
    });

shopRouter.route('/category/:categoryName')
    .get((req, res, next) => {
        Books.find({ category: req.params.categoryName }, function (err, book) {
            if (err) {
                console.log(err);
            } else {
                res.render('shop', { data: book, noMatch: 1, flag: 1, title: req.params.categoryName, user: req.user });
            }
        });
    });

shopRouter.route('/book/:bookID')
    .get((req, res, next) => {
        Books.findById(req.params.bookID).lean()
            .populate({
                path: 'reviews.author',
                select: 'firstName lastName avatar'
            })
            .then((book1) => {
                var val2 = book1.category;
                var val3 = mongoose.Types.ObjectId(book1._id);
                Books
                    .find({ category: val2, _id: { $ne: val3 } })
                    .limit(6)
                    .exec((err, book2) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.render('details', { data1: book1, data2: book2, user: req.user });
                        }
                    })
            })

    });

shopRouter.route('/price/:priceRange')
    .get((req, res, next) => {
        let perPage = 12;
        let page = req.params.page || 1;
        if (req.params.priceRange == "low") {
            Books
                .find({ price: { $lte: 200000 } })
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .sort({ price: 1 })
                .exec((err, book) => {
                    Books.countDocuments({ price: { $lt: 200000 } }, (err, count) => {
                        if (err) {
                            return next(err);
                        }
                        res.render('shop', { data: book, current: page, pages: Math.ceil(count / perPage), noMatch: 1, flag: 0, flag1: "low", title: "Low Price", user: req.user });
                    })
                })
        } else if (req.params.priceRange == "medium") {
            Books
                .find({ price: { $gte: 200000, $lte: 300000 } })
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .sort({ price: 1 })
                .exec((err, book) => {
                    Books.countDocuments({ price: { $gte: 200000, $lte: 300000 } }, (err, count) => {
                        if (err) {
                            return next(err);
                        }
                        res.render('shop', { data: book, current: page, pages: Math.ceil(count / perPage), noMatch: 1, flag: 0, flag1: "medium", title: "Medium Price", user: req.user });
                    })
                })
        } else if (req.params.priceRange == "high") {
            Books
                .find({ price: { $gt: 300000 } })
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .sort({ price: 1 })
                .exec((err, book) => {
                    Books.countDocuments({ price: { $gt: 300000 } }, (err, count) => {
                        if (err) {
                            return next(err);
                        }
                        res.render('shop', { data: book, current: page, pages: Math.ceil(count / perPage), noMatch: 1, flag: 0, flag1: "high", title: "High Price", user: req.user });
                    })
                })
        }
    });

shopRouter.route('/price/:priceRange/:page')
    .get((req, res, next) => {
        let perPage = 12;
        let page = req.params.page || 1;
        if (req.params.priceRange == "low") {
            Books
                .find({ price: { $lte: 100000 } })
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .sort({ price: 1 })
                .exec((err, book) => {
                    Books.countDocuments({ price: { $lt: 100000 } }, (err, count) => {
                        if (err) {
                            return next(err);
                        }
                        res.render('shop', { data: book, current: page, pages: Math.ceil(count / perPage), noMatch: 1, flag: 0, flag1: "low", title: "Low Price", user: req.user });
                    })
                })
        } else if (req.params.priceRange == "medium") {
            Books
                .find({ price: { $gte: 100000, $lte: 350000 } })
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .sort({ price: 1 })
                .exec((err, book) => {
                    Books.countDocuments({ price: { $gte: 100000, $lte: 350000 } }, (err, count) => {
                        if (err) {
                            return next(err);
                        }
                        res.render('shop', { data: book, current: page, pages: Math.ceil(count / perPage), noMatch: 1, flag: 0, flag1: "medium", title: "Medium Price", user: req.user });
                    })
                })
        } else if (req.params.priceRange == "high") {
            Books
                .find({ price: { $gt: 350000 } })
                .skip((perPage * page) - perPage)
                .limit(perPage)
                .sort({ price: 1 })
                .exec((err, book) => {
                    Books.countDocuments({ price: { $gt: 350000 } }, (err, count) => {
                        if (err) {
                            return next(err);
                        }
                        res.render('shop', { data: book, current: page, pages: Math.ceil(count / perPage), noMatch: 1, flag: 0, flag1: "high", title: "High Price", user: req.user });
                    })
                })
        }
    });

shopRouter.route('/book/:bookID/reviews')
    .get((req, res, next) => {
        Books.findById(req.params.bookID).lean()
            //.populate('reviews.author.name')
            .then((book) => {
                if (book != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(book.reviews);
                } else {
                    err = new Error('Book ' + req.params.bookID + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Books.findById(req.params.bookID)
            .then((book) => {
                if (book != null) {
                    req.body.author = req.user._id;
                    book.reviews.push(req.body);
                    book.save()
                        .then((book) => {
                            res.statusCode = 200;
                        }, (err) => next(err));
                } else {
                    err = new Error('Book ' + req.params.bookID + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /admin/products/' +
            req.params.bookID + '/reviews');
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Books.findById(req.params.bookID)
            .then((book) => {
                if (book != null) {
                    for (var i = (book.reviews.length - 1); i >= 0; i--) {
                        book.reviews.id(book.reviews[i]._id).remove();
                    }
                    book.save()
                        .then((book) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(book);
                        }, (err) => next(err));
                } else {
                    err = new Error('Book ' + req.params.bookID + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

shopRouter.route('book/:bookID/reviews/:reviewID')
    .get((req, res, next) => {
        Books.findById(req.params.bookID).lean()
            .populate('reviews.author')
            .then((book) => {
                if (book != null && book.reviews.id(req.params.reviewID) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(book.reviews.id(req.params.reviewID));
                } else if (book == null) {
                    err = new Error('Book ' + req.params.bookID + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Review ' + req.params.reviewID + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /admin/products/' + req.params.bookID +
            '/reviews/' + req.params.reviewID);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Books.findById(req.params.bookID)
            .then((book) => {
                if (book != null && book.reviews.id(req.params.reviewID) != null) {
                    if (book.reviews.id(req.params.reviewID).author.toString() != req.user._id.toString()) {
                        err = new Error('You are not authorized to edit this review');
                        err.status = 403;
                        return next(err);
                    }
                    if (req.body.rating) {
                        book.reviews.id(req.params.reviewID).rating = req.body.rating;
                    }
                    if (req.body.review) {
                        book.reviews.id(req.params.reviewID).review = req.body.review;
                    }
                    book.save()
                        .then((book) => {
                            Books.findById(book._id)
                                .populate('reviews.author')
                                .then((book) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(book);
                                })
                        }, (err) => next(err));
                } else if (book == null) {
                    err = new Error('Book ' + req.params.bookID + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Review ' + req.params.reviewID + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Books.findById(req.params.bookID)
            .then((book) => {
                if (book != null && book.reviews.id(req.params.reviewID) != null) {
                    if (book.reviews.id(req.params.reviewID).author.toString() != req.user._id.toString()) {
                        err = new Error('You are not authorized to delete this review');
                        err.status = 403;
                        return next(err);
                    }
                    book.reviews.id(req.params.reviewID).remove();
                    book.save()
                        .then((book) => {
                            Books.findById(book._id)
                                .populate('reviews.author')
                                .then((book) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(book);
                                })
                        }, (err) => next(err));
                } else if (book == null) {
                    err = new Error('Book ' + req.params.bookID + ' not found');
                    err.status = 404;
                    return next(err);
                } else {
                    err = new Error('Review ' + req.params.reviewID + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = shopRouter;