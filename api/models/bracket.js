const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var schema = new Schema({
  year: Number,
  playoffs:[]
});

module.exports = mongoose.model('Bracket', schema);
