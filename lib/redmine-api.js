/**
 * Module dependencies.
 */

var FileManager = require('./filemanager'),
    http = require('http'),
    querystring = require('querystring'),
    configFile = "../config/config.json";

/*
 *
 * Redmine-Api
 *
 */

var Api = module.exports = function Api(filename) {
  this.charset = "utf8";
  
  this.method = "";
  this.path = "";

  this.issues = {};
  this.headers = {};

  this.Api();

};


/**
 * Constructor.
 */
Api.prototype.Api = function(){

  var configuration = new FileManager(configFile);

  this.host = configuration.get('domain');
  this.port = configuration.get('port');
  this.apiKey = configuration.get('apikey');
  this.contentType = configuration.get('contenttype');

  this.headers = {
    "User-Agent" : "curl/7.26.0",
    "Accept" : "*/*",
    "Proxy-Connection" : "Keep-Alive",
    "Content-Type" : this.contentType,
    "X-Redmine-API-Key" : this.apiKey
  };

};


/**
 * xxx.
 */
Api.prototype.xxx = function(){
  
};
