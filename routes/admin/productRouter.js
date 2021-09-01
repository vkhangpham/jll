const express = require('express');
const mongoose = require('mongoose');
const Books = require('../../models/books');
const Stock = require('../../models/stock');
const authenticate = require('../../authenticate');
const shopRouter = express.Router();

shopRouter.use(express.urlencoded({ extended: true }));
shopRouter.use(express.json());

shopRouter.route('/')
    .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Stock.find({ }).lean()
            .populate("bookID")
            .then((stock) => {
                res.statusCode = 200;
                var img, msg;
                if (req.session.image) {
                    img = req.session.image;
                    req.session.image = null;
                }
                else {
                    msg = 'Please upload image first.'
                }
                res.render('admin/products', { data: stock, image: img, message: msg });
            }, (err) => next(err))
            .catch((err) => next(err));

    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation is not supported on /admin/products.");
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Books.create(req.body)
            .then((book) => {
                Stock.create({ bookID: book._id, stock: req.body.quantity })
                    .then(() => {
                        res.statusCode = 200;
                        res.redirect('/admin/products')
                    }, (err) => next(err))
                    .catch((err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Books.deleteMany({})
            .then((resp) => {
                Stock.deleteMany({ })
                    .then((resp) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(resp);
                    }, (err) => next(err))
                    .catch((err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
    })

shopRouter.route('/:bookID')
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Books.findByIdAndUpdate(req.params.bookID, { $set: req.body.update }, { new: true })
            .then((book) => {
                if (req.body.update.quantity) {
                    Stock.findOneAndUpdate({ bookID: book._id }, { $set: { stock: req.body.update.quantity } }, { new: true })
                        .then(() => {
                            res.statusCode = 200;
                            res.send("OK");
                        }, (err) => next(err))
                        .catch((err) => next(err));
                }
                else {
                    res.statusCode = 200;
                    res.send("OK");
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Books.deleteOne({_id: req.params.bookID})
            .then(() => {
                Stock.deleteOne({ bookID: req.params.bookID })
                    .then(() => {
                        res.statusCode = 200;
                        res.send("OK");
                    }, (err) => next(err))
            }, (err) => next(err))
            .catch((err) => next(err));
    })
module.exports = shopRouter;