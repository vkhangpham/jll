const express = require('express');
const mongoose = require('mongoose');
//const cors = require('./cors')
const Books = require('../models/books');
const Carts = require('../models/carts');
const authenticate = require('../authenticate');
const router = express.Router();

router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.route('/shipping')
    .get(authenticate.verifyUser, (req, res, next) => {
        Carts.findOne({ user: req.user._id }).lean()
            .populate({
                path: 'items.bookID',
                select: 'name price image'
            })
            .then((cart) => {
                res.statusCode = 200;
                res.render('shipping', { data: cart, user: req.user });
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 200;
        var Sessions = req.session;
        Sessions.shippingDetails = JSON.parse(req.body.shippingDetails);
        res.json(Sessions);
    })
router.route('/payment')
    .get(authenticate.verifyUser, (req, res, next) => {
        Carts.findOne({ user: req.user._id }).lean()
            .populate({
                path: 'items.bookID',
                select: 'name price image'
            })
            .then((cart) => {
                res.statusCode = 200;
                res.render('payment', { data: cart, user: req.user });
            }, (err) => next(err))
            .catch((err) => next(err));
    })
module.exports = router;