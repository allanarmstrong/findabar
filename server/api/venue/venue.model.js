'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VenueSchema = new Schema({
  name: String,
  attendance: [String],
});

module.exports = mongoose.model('Venue', VenueSchema);