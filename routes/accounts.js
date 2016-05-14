var express = require('express'),
    router = express.Router(),
    config  = require('../config'),
    localize = require('../locales/localize'),
    auth = require('../helpers/auth'),
    Account = require('../models/account');

/**
 * GET /accounts
 * Read accounts, admin only
 */
router.get('/', auth, auth.isAdmin, function(req, res, next) {
    Account.find(function (err, accounts) {
        if (!err && accounts) {
            res.send(accounts);
        } else {
            next();
        }
    });
});

/**
 * POST /accounts
 * Create account
 */
router.post('/', function(req, res, next) {
    var account = new Account({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });
    account.save(function(err) {
        if (err) {
            var error = new Error();
            if (err.code === 11000 || err.code === 11001) {
                error.message = localize('EMAIL_ALREADY_EXISTS');
                error.status = 409;
            } else {
                error.message = localize('UNABLE_TO_CREATE_ACCOUNT');
                error.status = 400;
            }
            next(error);
        } else {
            res.status = 201;
            res.json({ success: true, feedback: localize('ACCOUNT_CREATED') });
        }
    });
});

/**
 * GET /accounts/:id
 * Read account, admin and owner only
 */
router.get('/:id', auth, function(req, res, next) {
    if (req.account.role === 'admin' || req.account._id === req.params.id) {
        Account.findById(req.params.id, function(err, account) {
            if (!err && account) {
                res.send(account);
            } else {
                console.log('hmm');
                next();
            }
        });
    } else {
        var err = new Error(localize('FORBIDDEN'));
        err.status = 403;
        next(err)
    }
});

/**
 * PUT /accounts/:id
 * Update account, admin and owner only
 */
router.put('/:id', auth, function(req, res) {

});

/**
 * DELETE /accounts/:id
 * Delete account, admin and owner only
 */
router.delete('/:id', auth, function(req, res, next) {
    if (req.account.role === 'admin' || req.account._id === req.params.id) {
        Account.findByIdAndRemove(req.params.id, function(err, account) {
            if (!err && account) {
                res.status = 202;
                res.send({ success: true, feedback: localize('ACCOUNT_DELETED') });
            } else {
                var error = new Error(localize('UNABLE_TO_DELETE_ACCOUNT'));
                error.status = 400;
                next(error);
            }
        });
    } else {
        var err = new Error(localize('FORBIDDEN'));
        err.status = 403;
        next(err)
    }
});

module.exports = router;