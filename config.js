module.exports = {
  mongodb_uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/unote',
  secret: process.env.SECRET || 'secret'
};