/**
 * Module dependencies.
 */

var FileManager = require('./filemanager'),
    http = require('http'),
    querystring = require('querystring'),
    Execute = require('./execute'),
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

  this.options = {};

  this.data = {};

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

  this.options.host = this.host;
  this.options.port = this.port;
  this.options.headers = this.headers;

  this.options.method = "GET";
  this.options.path = "";

};


/**
 * Get an Issue.
 */
Api.prototype.getIssue = function(callback){
  var that = this;
  that.options.method = "GET";

  that.getIdIssue(function(id){
    var pattern = new RegExp(/([0-9]+$)/gi);
    that.issues.id = id.match(pattern);

    that.options.path = "/issues/" + that.issues.id + ".json";

    var req = http.request(that.options, function(res) {

      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        if (res.statusCode === 200) {
          that.data = JSON.parse(chunk);
          callback();
        }else{
          console.log('Error: #' + res.statusCode);
        };
      });
    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    req.end();


  });

  




};

/**
 * get Id of a Issue.
 */
Api.prototype.getIdIssue = function(callback){
  var exe = new Execute("git rev-parse --abbrev-ref HEAD", callback);
};





/**
 * Update Issue.
 */
Api.prototype.update = function(){
  this.setOptions("PUT");
  console.log("update");
  console.log(this.options);
};



var api = new Api();

api.getIssue(function(){

  var issue = api.data.issue;

  console.log('Issue: ' + issue.id);
  console.log('Proyecto:' + issue.project.name);
  console.log('Asunto: ' + issue.subject);
  //console.log(issue.tracker.id);
  console.log('Tipo: ' + issue.tracker.name);
  //console.log(issue.status.id);
  console.log('Estado: ' + issue.status.name);
  console.log('Author: ' + issue.author.name + '('+ issue.author.id +')');
  //console.log(issue.assigned_to.id);
  console.log('Asignado a: ' + issue.assigned_to.name + '('+ issue.assigned_to.id +')');
  console.log('Fecha de inicio: ' + issue.start_date);
  console.log('Fecha de termino: ' + issue.due_date);
  console.log('Porcentaje: ' + issue.done_ratio + '%');
  console.log('Horas estimadas: ' + issue.estimated_hours);
  console.log('Horas utilizadas: ' + issue.spent_hours);
  
});
