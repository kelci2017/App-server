'user strict'

var mongose = require('mongoose'),
    jwt = require('jsonwebtoken'),
    bcrypt = require("bcrypt"),
    User = mongose.model('User');

exports.register = function (req, res) {
    var newUser = new User(req.body);
    newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
    newUser.save(function (err, user) {
        if (err) {
            return res.status(400).send({
                message: err
            });
        } else {
            user.sha_password = undefined;
            return res.json(user);
        }
    });
};

exports.sign_in = function (req, res) {
    User.findOne({
        email: req.body.email
    }, function (err, user) {
        if (user) console.log(user.email + user.fullName);
        if (err) throw err;
        if (!user) {
            res.status(401).json({ message: 'Authetication failed. User not found.' });
        } else if (user) {
            if (!user.comparePassword(req.body.password)) {
                res.status(401).json({ message: 'Authentication failed. Wrong password' });
            } else {
                return res.json({ token: jwt.sign({ email: user.email, fullName: user.fullName, }, 'RESTFULAPIs', 3600) })
            }
        }
    });
};

exports.loginRequired = function (req, res, next) {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: 'Unauthorized user!' })
    }
};