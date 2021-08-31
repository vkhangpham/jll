const express = require('express');
const authenticate = require('../../authenticate.js');
const Stock = require('../../models/stock');
const Orders = require('../../models/orders');

const indexRouter = express.Router();
indexRouter.use(express.urlencoded({ extended: true }));
indexRouter.use(express.json())

indexRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.redirect('/admin/dashboard')
    })

indexRouter.route('/create')
    .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.render('admin/create');
    })

indexRouter.route('/dashboard')
    .all(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        next();
    })
    .get((req, res, next) => {
        Stock.find({}).sort({ sales: -1 }).limit(12)
            .populate({
                path: 'bookID',
                select: 'name price'
            })
            .then((stock) => {
                Orders.find().sort({createdAt: -1}).limit(9)
                .populate({
                    path: 'user',
                    select: 'username'
                })
                .then((orders) => {
                    res.statusCode = 200;
                    res.render('admin/index', {best_sellers: stock, recent_sales: orders});
                }, (err) => next(err));
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end("PUT operation is not supported on /");
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end("POST operation is not supported on /");
    })
    .delete((req, res, next) => {
        res.statusCode = 403;
        res.end("DELETE operation is not supported on /");
    })

module.exports = indexRouter;