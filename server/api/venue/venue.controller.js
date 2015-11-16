'use strict';

var _ = require('lodash');
var Venue = require('./venue.model');

// Get list of venues
exports.index = function(req, res) {
  Venue.find(function (err, venues) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(venues);
  });
};

// Get a single venue
exports.show = function(req, res) {
  Venue.findById(req.params.id, function (err, venue) {
    if(err) { return handleError(res, err); }
    if(!venue) { return res.status(404).send('Not Found'); }
    return res.json(venue);
  });
};

// Creates a new venue in the DB.
exports.create = function(req, res) {
  Venue.create(req.body, function(err, venue) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(venue);
  });
};

// Updates an existing venue in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Venue.findOne({name: req.params.id}, function (err, venue) {
    if (err) { return handleError(res, err); }
    if (!venue) { return res.status(404).send('Not Found'); }
    var updated = _.extend(venue, req.body);
    console.log(updated);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(venue);
    });
  });
};

// Deletes a venue from the DB.
exports.destroy = function(req, res) {
  Venue.findById(req.params.id, function (err, venue) {
    if(err) { return handleError(res, err); }
    if(!venue) { return res.status(404).send('Not Found'); }
    venue.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}