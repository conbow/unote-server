var mongoose = require('mongoose'),
    bcrypt = require('bcrypt');
//validator = require('validator');

/**
 * Note Schema
 */
var schema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    title: {
        type: String,
        required: true
    },
    body: String
}, { timestamps: true });

module.exports = mongoose.model('Note', schema);