const express = require('express');
const authenticate = require('../authenticate');
const Users = require('../models/users')
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/img/users');
    },

    filename: (req, file, cb) => {
        cb(null, req.user._id + ".png");
    }
});

const imageFileFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can upload only image files!'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

const uploadRouter = express.Router();

uploadRouter.use(express.urlencoded({ extended: true }));
uploadRouter.use(express.json())

uploadRouter.route('/')
    .post(authenticate.verifyUser, upload.single('imageFile'), (req, res) => {
        Users.findByIdAndUpdate(req.user._id, {avatar: req.file.path.slice(6)})
        .then(() => {
            res.statusCode = 200;
            res.redirect('/profile');
        })
    })

module.exports = uploadRouter;