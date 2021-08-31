const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/users');

exports.local = passport.use(new LocalStrategy(User.authenticate(), function (err, user, done) {
    if (err) { return done(err); }
    if (!user) {
        return done(null, false, { message: 'Username/password invalid.' });
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

exports.verifyUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        var err = new Error('You need to login to perform this operation!');
        err.status = 403;
        res.redirect('/users/login');
    }
}

exports.verifyAdmin = (req, res, next) => {
    if (req.user.admin) {
        next();
    } else {
        var err = new Error('You are not authorized to perform this operation!');
        err.status = 403;
        res.redirect('/users/login');
    }
}