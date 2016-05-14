var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');
    //validator = require('validator');

/**
 * Account Schema
 */
var schema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['user',  'admin'],
        default: 'user'
    },
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
        /*
         validate: [{
         validator: function(v) {
         return validator.isEmail(v);
         },
         msg: 'THATS NOT RIGHT code: {ERRORCODE} for value "{VALUE}"',
         errorCode: 25
         }]*/
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        select: false
    }
}, { timestamps: true });

/**
 * Password Functions
 * Hashing / Comparing
 */
schema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        callback(err, isMatch);
    });
};

schema.pre('save', function(next) {
    var account = this;

    /*
    if (account.password) {
        if (!validator.isLength(account.password, {min: 6, max: undefined})) {
            return next(new Error('Password too short'));
        } else if (!validator.is) {

        } else {

        }
    } else {
        return next(new Error('Password is required'));
    }

    if (account.email && !validator.isEmail(account.email)) {
        return next(new Error('E-mail is invalid'));
    } else*/
    if (account.isModified('password')) {
        console.log('password is modified');
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

module.exports = mongoose.model('Account', schema);