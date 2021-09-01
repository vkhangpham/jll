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
                var shippingDetails;
                if (req.session.shippingDetails) {
                    shippingCheck = req.session.shippingDetails;
                }
                res.render('shipping', { data: cart, user: req.user, shippingDetails: shippingDetails });
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
                var shippingCheck = false;
                if (req.session.shippingDetails) {
                    shippingCheck = true;
                }
                res.render('payment', { data: cart, user: req.user, shippingCheck: shippingCheck});
            }, (err) => next(err))
            .catch((err) => next(err));
    })
module.exports = router;