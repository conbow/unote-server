var mongoose = require('mongoose');
var i18n = require('i18n');

/**
 * Note Schema
 */
var schema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Account',
      required: true
    },
    title: {
      type: String,
      maxlength: [64, i18n.__('TITLE_TOO_LONG')],
      required: [true, i18n.__('TITLE_REQUIRED')]
    },
    body: {
      type: String,
      maxlength: [1028, i18n.__('BODY_TOO_LONG')]
    }
  },
  {
    timestamps: true
  }
);

schema.set('toJSON', {
  virtuals: true
});

schema.set('toObject', {
  virtuals: true
});

module.exports = mongoose.model('Note', schema);
