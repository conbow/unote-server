var jwt = require('jsonwebtoken'),
    localize = require('../locales/localize'),
    config = require('../config');

module.exports = function(req, res, next) {
    if (req.headers && req.headers.authorization) {
        var auth = req.headers.authorization.split(' ');
        if (auth.length === 2 && auth[0] === 'Bearer') {
            var token = auth[1];
        }
    }
    if (token) {
        jwt.verify(token, config.secret, function(err, decoded) {
            if (err) {
                var error = new Error(localize('AUTHENTICATION_FAILED'));
                error.status = 401;
                next(error);
            } else {
                req.account = decoded;
                next();
            }
        });
    } else {
        var error = new Error(localize('AUTHENTICATION_FAILED'));
        error.status = 401;
        next(error);
    }
};

module.exports.isAdmin = function(req, res, next) {
    if (req.account && req.account.role === 'admin') {
        next();
    } else {
        var error = new Error(localize('FORBIDDEN'));
        error.status = 403;
        next(error);
    }
};