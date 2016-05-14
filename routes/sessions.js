var express = require('express'),
    router = express.Router(),
    config  = require('../config'),
    localize = require('../locales/localize'),
    jwt = require('jsonwebtoken'),
    Account = require('../models/account');

/**
 * GET /sessions
 * Read sessions - admin only
 * TODO For when JWT are tied to memory store
 */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/**
 * POST /sessions
 * Create session
 */
router.post('/', function(req, res, next) {
    Account.findOne().select('+password').exec({
        email: req.body.email
    }, function(err, account) {
        if (!err && account) {
            account.comparePassword(req.body.password, function(err, isMatch) {
                if (isMatch) {
                    var accountObject = account.toObject();
                    delete accountObject.password;
                    var token = jwt.sign(accountObject, config.secret, { expiresIn: '1 day' });
                    res.json({ success: true, feedback: localize('SUCCESSFULLY_LOGGED_IN'), sessionToken: token });
                } else {
                    var newErr = new Error();
                    newErr.message = localize('INVALID_LOGIN_INFORMATION');
                    next(newErr);
                }
            });
        } else {
            var newErr = new Error();
            newErr.message = localize('INVALID_LOGIN_INFORMATION');
            next(newErr);
        }
    });
});

/**
 * DELETE /sessions/:id
 * Delete session, admin and self only
 * TODO For when JWT are tied to memory store
 */
router.post('/:id', function(req, res, next) {

});

module.exports = router;