'use strict';

var express = require('express');
var controller = require('./search.controller');
var config = require('../../config/environment');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:location', controller.search);

module.exports = router;