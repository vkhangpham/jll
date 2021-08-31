const express = require('express');
const mongoose = require('mongoose');
const Orders = require('../../models/orders');
const authenticate = require('../../authenticate');
const orderRouter = express.Router();

orderRouter.use(express.urlencoded({ extended: true }));
orderRouter.use(express.json());

orderRouter.route('/')
    .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Orders.find({}).lean()
            .populate({
                path: 'items.bookID',
                select: 'name price'
            })
            .populate({
                path: "user",
                select: "username"
            })
            .then((orders) => {
                res.statusCode = 200;
                res.render('admin/orders', { data: orders });
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation is not supported on /orders.");
    })
    .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end("DELETE operation is not supported on /orders.");

    })
    .delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Orders.remove({})
            .then((resp) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
orderRouter.route('/:orderID')
    .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Orders.findById(req.params.orderID).lean()
            .populate({
                path: "items.bookID",
                select: "name price"
            })
            .populate({
                path: "user",
                select: "username"
            })
            .then((order) => {
                res.statusCode = 200;
                res.json(order);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Orders.findByIdAndUpdate(req.params.orderID, { $set: { status: req.body.data.status } }, { new: true })
            .then((order) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(order);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
module.exports = orderRouter;