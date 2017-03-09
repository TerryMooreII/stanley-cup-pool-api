const mongoose = require('mongoose')
const Schema = mongoose.Schema;

var schema = new Schema({
  name:String,
  abbreviation:String,
  teamname:String,
  shortName:String,
  division:String,
  conference:String,
  image:String,
  isActive:Boolean
});

module.exports = mongoose.model('Team', schema);
