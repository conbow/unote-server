var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var i18n = require('i18n');
var validator = require('validator');

/**
 * Account Schema
 */
var schema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    name: {
      type: String,
      minlength: [2, i18n.__('NAME_TOO_SHORT')],
      maxlength: [64, i18n.__('NAME_TOO_LONG')]
    },
    email: {
      type: String,
      required: [true, i18n.__('EMAIL_REQUIRED')],
      unique: true,
      validate: [
        {
          validator: function(v) {
            return validator.isEmail(v);
          },
          msg: i18n.__('EMAIL_INVALID')
        }
      ]
    },
    emailVerified: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      minlength: [6, i18n.__('PASSWORD_TOO_SHORT')],
      required: [true, i18n.__('PASSWORD_REQUIRED')],
      select: false
    }
  },
  {
    timestamps: true
  }
);

/**
 * Compare Password
 * Verify input password matches password hash
 */
schema.methods.comparePassword = function(password, callback) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    callback(err, isMatch);
  });
};

/**
 * Encrypt Password Hookpoint
 * Encrypts input password before saving into the database
 */
schema.pre('save', function(next) {
  var account = this;
  if (account.isModified('password')) {
    bcrypt.genSalt(10, function(err, salt) {
      if (err) {
        return next(err);
      } else {
        bcrypt.hash(account.password, salt, function(err, hash) {
          if (err) {
            return next(err);
          } else {
            account.password = hash;
            return next();
          }
        });
      }
    });
  } else {
    return next();
  }
});

schema.set('toJSON', {
  virtuals: true
});

schema.set('toObject', {
  virtuals: true
});

module.exports = mongoose.model('Account', schema);
