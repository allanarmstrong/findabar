'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VenueSchema = new Schema({
  id: String,
  attendance: [String],
});

module.exports = mongoose.model('Venue', VenueSchema);