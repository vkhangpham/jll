const express = require('express');
const mongoose = require('mongoose');
//const cors = require('./cors');
const Books = require('../models/books');
const Carts = require('../models/carts');
const Orders = require('../models/orders');
const Stock = require('../models/stock');
const authenticate = require('../authenticate');
const orderRouter = express.Router();

orderRouter.use(express.urlencoded({ extended: true }));
orderRouter.use(express.json());

orderRouter.route('/')
    .get(authenticate.verifyUser, (req, res, next) => {
        Orders.find({ user: req.user._id })
            .then((orders) => {
                res.statusCode = 200;
                //res.render('orders', {data: orders});
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation is not supported on /orders.");
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Carts.findOne({ user: req.user._id })
            .populate({
                path: 'items.bookID',
                select: 'name'
            })
            .then((cart) => {
                if (cart.subTotal == 0){
                    res.redirect('/shop');
                }
                cart.items.forEach((item) => {
                    Stock.findOne({ bookID: item.bookID })
                        .then((stock) => {
                            if (stock.stock < item.quantity) {
                                err = new Error('We are sorry but we do not have enough ' + item.quantity + ' copies of ' + item.bookID.name + '!');
                                err.status = 400;
                                return next(err);
                            }
                            else {
                                stock.stock -= item.quantity;
                                stock.sales += item.quantity;
                                if (stock.stock == 0) {
                                    Books.findByIdAndUpdate(stock.bookID, {instock: false}).catch((err) => next(err));
                                }
                                stock.save();
                            }
                        }, (err) => next(err))
                })
                Orders.create({ user: req.user._id })
                    .then((order) => {
                        order.items = cart.items;
                        order.subTotal = cart.subTotal;
                        if (req.session.shippingDetails) {
                            order.shippingDetails = req.session.shippingDetails;
                        }
                        
                        let payment = JSON.parse(req.body.paymentDetails);
                        order.paymentDetails = {
                            creditCard: payment.creditCard,
                            cardName: payment.cardName,
                            cvv: Number.parseInt(payment.cvv),
                            expiredDate: new Date(payment.expiredDate)
                        };
                        cart.items = [];
                        cart.subTotal = 0;
                        cart.save();
                        order.save()
                            .then(() => {
                                res.statusCode = 200;
                                res.send("OK");
                            }, (err) => next(err))
                    }, (err) => next(err))
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("DELETE operation is not supported on /orders.");
    })

module.exports = orderRouter;