var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    config  = require('../config'),
    localize = require('../locales/localize'),
    Note = require('../models/note');

/**
 * GET /notes
 * Read notes, owner only
 */
router.get('/', function(req, res, next) {
    Note.find({ owner: req.account._id }, function (err, notes) {
        if (!err && notes && notes.length) {
            res.send(notes);
        } else {
            var error = new Error(localize('NO_NOTES_FOUND'));
            next(error);
        }
    });
});

/**
 * POST /notes
 * Create note
 */
router.post('/', function(req, res, next) {
    var note = new Note({
        owner: req.account._id,
        title: req.body.title,
        body: req.body.body
    });
    note.save(function(err) {
        if (err) {
            console.log('error in db: ' + err.message);
            next(new Error(localize('UNABLE_TO_CREATE_NOTE')));
        } else {
            res.json({ success: true, feedback: localize('NOTE_CREATED') });
        }
    });
});

/**
 * GET /notes/:id
 * Read note, admin and owner only
 */
router.get('/:id', function(req, res, next) {
    next();

});

/**
 * PUT /notes/:id
 * Update notes, admin and owner only
 */
router.put('/:id', function(req, res) {

});

/**
 * DELETE /notes/:id
 * Delete note, admin and owner only
 */
router.delete('/:id', function(req, res, next) {
    //res.json({ success: true, feedback: 'Account deleted' });
    next();
});

module.exports = router;