#!/usr/bin/env node

/**
 * Module dependencies.
 */

var FileManager = require('./filemanager'),
	Api = require('./redmine-api'),
	path = require('path');

/**
 * Expose `configFile`.
 */
exports.configFile = path.join(__dirname, '../config/config.json');;

/**
 * Expose `FileManager`.
 */

exports.FileManager = FileManager;

/**
 * Expose `Api`.
 */

exports.Api = Api;

