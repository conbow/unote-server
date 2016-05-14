var language = require('./en.json');

module.exports = function(key) {
    return language[key];
};