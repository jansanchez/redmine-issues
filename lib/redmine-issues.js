#!/usr/bin/env node

/**
 * Module dependencies.
 */

var FileManager = require('./filemanager'),
	Api = require('./redmine-api');


/**
 * Expose `configFile`.
 */
exports.configFile = "../config/config.json";

/**
 * Expose `FileManager`.
 */

exports.FileManager = FileManager;

/**
 * Expose `Api`.
 */

exports.Api = Api;

