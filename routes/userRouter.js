const express = require('express');
const mongoose = require('mongoose');
const Users = require('../models/users');
const Carts = require('../models/carts');
const passport = require('passport');
const authenticate = require('../authenticate');

const router = express.Router();
router.use(express.urlencoded({ extended: true }));
router.use(express.json())

router.get('/login', (req, res) => {
    res.statusCode = 200;
    var backURL = req.header('Referer') || '/';
    res.render('login', { message: "", backURL: backURL });
})

router.get('/signup', (req, res) => {
    res.statusCode = 200;
    res.render('signup', { message: "" });
})

router.post('/signup', (req, res, next) => {
    Users.findOne({ username: req.body.username })
        .then((user) => {
            if (user) {
                res.statusCode = 500;
                res.render('signup', { message: "Username has been already taken." });
            }
            else {
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
            }
        })

});

router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user, info) {
        if (err) { return next(err); }
        if (!user) { return res.render('login', { message: "Invalid username or password." }); }
        req.logIn(user, function (err) {
            if (err) { return next(err); }
            return res.redirect(req.body.backURL);
        });
    })(req, res, next);
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