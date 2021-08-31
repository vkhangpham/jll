const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const Users = require('../../models/users');
const Carts = require('../../models/carts');

const authenticate = require('../../authenticate');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json())

router.route('/')
    .get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Users.find({ }).lean()
            .then((users) => {
                res.statusCode = 200;
                res.render('admin/users', { data: users });
            }, (err) => next(err))
            .catch((err) => next(err));
    })

router.post('/signup', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Users.register(new Users({ username: req.body.username }),
        req.body.password, (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
            } else {
                if (req.body.firstName)
                    user.firstName = req.body.firstName;
                if (req.body.lastName)
                    user.lastName = req.body.lastName;
                if (req.body.email)
                    user.email = req.body.email;
                user.admin = true;
                user.save((err, user) => {
                    if (err) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json');
                        res.json({ err: err });
                        return;
                    }
                    Carts.create({ user: user._id })
                        .then(() => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.redirect('/admin/dashboard');
                        }, (err) => next(err))
                        .catch((err) => next(err));
                });
            }
        });
});

module.exports = router;