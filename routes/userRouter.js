const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/users');
const Carts = require('../models/carts');
const passport = require('passport');
const authenticate = require('../authenticate');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json())

router.post('/signup', (req, res, next) => {
    // Users.findOne({username: req.body.username})
    // .then((user) => {
    //     if (user) {

    //     }
    // })
    Users.register(new Users({ username: req.body.username }),
        req.body.password, (err, user) => {
            if (err) {
                res.statusCode = 500;
                err.status = 500;
                next(err);
                return;
            } else {
                if (req.body.firstName)
                    user.firstName = req.body.firstName;
                if (req.body.lastName)
                    user.lastName = req.body.lastName;
                if (req.body.email)
                    user.email = req.body.email;
                user.save((err, user) => {
                    if (err) {
                        res.statusCode = 500;
                        err.status = 500;
                        next(err);
                        return;
                    }
                    passport.authenticate('local')(req, res, () => {
                        Carts.create({ user: user._id })
                            .then(() => {
                                res.statusCode = 200;
                                res.redirect('/');
                            }, (err) => next(err))
                            .catch((err) => next(err));
                    });
                });
            }
        });
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {
    res.statusCode = 200;
    res.redirect('/');
});

router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy();
        res.clearCookie('session-id');
        return res.redirect('/');
    }
    else {
        var err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
    }
});

router.put('/', authenticate.verifyUser, (req, res, next) => {
    Users.findByIdAndUpdate(req.user._id, req.body.data)
        .then((user) => {
            res.statusCode = 200;
            res.json(user);
        })
        .catch((err) => next(err))
})

module.exports = router;