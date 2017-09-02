var router = require('express').Router();
var i18n = require('i18n');
var Note = require('../../models/Note');
var auth = require('../../helpers/auth');

/**
 * GET /notes
 * Read notes, owner only
 * Admin gets all the notes
 */
router.get('/', auth, function (req, res, next) {
  Note.find(req.account.role == 'admin' ?
    '' : {
      owner: req.account._id
    },
    function (err, notes) {
      if (!err) {
        res.send(notes);
      }
    }
  ).catch(next);
});

/**
 * POST /notes
 * Create note
 */
router.post('/', auth, function (req, res, next) {
  var note = new Note({
    owner: req.account._id,
    title: req.body.title,
    body: req.body.body
  });
  note.save(function (err) {
    if (!err) {
      res.send(note);
    }
  }).catch(next);
});

/**
 * GET /notes/:id
 * Read note, admin and owner only
 */
router.get('/:id', auth, function (req, res, next) {
  Note.findById(req.params.id, function (err, note) {
    if (!err && note) {
      if (req.account._id == note.owner || req.account.role == 'admin') {
        res.send(note);
      } else {
        var error = new Error(i18n.__('FORBIDDEN'));
        err.status = 403;
        next(error);
      }
    } else {
      if (err && err.errors) {
        next(err);
      } else {
        next();
      }
    }
  });
});

/**
 * PUT /notes/:id
 * Update notes, admin and owner only
 */
router.put('/:id', auth, function (req, res, next) {
  var put = {
    owner: req.account.role == 'admin' ? req.body.owner : req.account._id,
    title: req.body.title,
    body: req.body.body
  };
  var where = {
    _id: req.params.id,
    owner: req.account.role != 'admin' ? req.account._id : ''
  };
  Note.findOneAndUpdate(where, put, function (err, note) {
    if (!err && note) {
      res.send(note);
    } else if (err) {
      var error = new Error(i18n.__('FORBIDDEN'));
      err.status = 403;
      next(error);
    } else {
      var error = new Error(i18n.__('NOTE_NOT_FOUND'));
      next();
    }
  });
});

/**
 * DELETE /notes/:id
 * Delete note, admin and owner only
 */
router.delete('/:id', auth, function (req, res, next) {
  Note.findOneAndRemove({
      _id: req.params.id,
      owner: req.account._id
    },
    function (err, note) {
      if (!err && note) {
        res.status = 202;
        res.send({
          success: true,
          feedback: i18n.__('NOTE_DELETED')
        });
      } else {
        if (err && err.errors) {
          next(err);
        } else {
          next();
        }
      }
    }
  );
});

module.exports = router;