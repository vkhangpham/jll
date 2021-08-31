const express = require('express');
const mongoose = require('mongoose');
//const cors = require('./cors')
const Books = require('../models/books');
const Carts = require('../models/carts');
const authenticate = require('../authenticate');
const cartRouter = express.Router();

cartRouter.use(express.urlencoded({ extended: true }));
cartRouter.use(express.json());

cartRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        Carts.findOne({ user: req.user._id }).lean()
            .populate({
                path: 'items.bookID',
                select: 'name price author image'
            })
            .then((cart) => {
                res.statusCode = 200;
                res.render('cart', { data: cart, user: req.user});
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Carts.findOne({ user: req.user._id })
            .then((cart) => {
                Books.findById(req.body.bookID)
                    .then((productDetails) => {
                        var position = -1;
                        for (var i = 0; i < cart.items.length; i++) {
                            if (cart.items[i].bookID == req.body.bookID) {
                                position = i;
                                break;
                            }
                        }
                        const quantity = Number.parseInt(req.body.quantity);
                        if (position > - 1) {
                            if (quantity > 0) {
                                cart.items[position].quantity += quantity;
                                cart.items[position].total = productDetails.price * cart.items[position].quantity;
                                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                            }
                            else if (quantity + cart.items[position].quantity > 0) {
                                cart.items[position].quantity += quantity;
                                cart.items[position].total = productDetails.price * cart.items[position].quantity;
                                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                            }
                            else if (quantity == -cart.items[position].quantity) {
                                cart.items.splice(position, 1);
                                if (cart.items.length == 0) {
                                    cart.subTotal = 0;
                                } else {
                                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                                }
                            }
                            else {
                                return res.status(400).json({
                                    type: "Invalid",
                                    msg: "Invalid request"
                                })
                            }
                        }
                        else if (quantity > 0) {
                            let temp = productDetails.price * quantity;
                            cart.items.push({
                                bookID: req.body.bookID,
                                quantity: quantity,
                                total: temp
                            })
                            cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                        }
                        else {
                            return res.status(400).json({
                                type: "Invalid",
                                msg: "Invalid request"
                            })
                        }
                        cart.save()
                            .then((cart) => {
                                Carts.findById(cart._id).lean()
                                    .populate({
                                        path: 'items.bookID',
                                        select: 'name price'
                                    })
                                    .then((cart) => {
                                        res.statusCode = 200;
                                        res.setHeader('Content-Type', 'application/json');
                                        res.json(cart);
                                    })
                            }, (err) => next(err));
                    }, (err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Carts.findOne({ user: req.user._id })
            .then((cart) => {
                cart.items = [];
                cart.subTotal = 0;
                cart.save()
                    .then((cart) => {
                        res.statusCode = 200;
                        res.json(cart);
                    }, (err) => next(err))
            }, (err) => next(err))
            .catch((err) => next(err));
    })
cartRouter.route('/:bookID')
    .put(authenticate.verifyUser, (req, res, next) => {
        Carts.findOne({ user: req.user._id })
            .populate({
                path: 'items.bookID',
                select: 'price'
            })
            .then((cart) => {
                let position = cart.items.findIndex(item => item.bookID._id == req.params.bookID);
                cart.items[position].quantity = Number.parseInt(req.body.data.quantity);
                cart.items[position].total = cart.items[position].bookID.price * cart.items[position].quantity;
                cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                cart.save()
                    .then((cart) => {
                        res.statusCode = 200;
                        res.json(cart);
                    }, (err) => next(err))
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Carts.findOne({ user: req.user._id })
            .then((cart) => {
                let position = cart.items.findIndex(item => item.bookID._id == req.params.bookID);
                cart.items.splice(position, 1);
                if (cart.items.length == 0) {
                    cart.subTotal = 0;
                } else {
                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                }
                cart.save()
                    .then((cart) => {
                        res.statusCode = 200;
                        res.json(cart);
                    }, (err) => next(err))
            }, (err) => next(err))
            .catch((err) => next(err));
    })
module.exports = cartRouter;