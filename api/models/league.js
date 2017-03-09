const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var schema = new Schema({
  name:String,
  year:Number,
  members:[],
  points:Object
});

module.exports = mongoose.model('League', schema);
