const mongoose = require('mongoose')
const Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new Schema({
  user:ObjectId,
  league:ObjectId,
  picks: []
});

module.exports = mongoose.model('Pick', schema);
