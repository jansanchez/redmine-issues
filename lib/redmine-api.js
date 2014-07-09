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
  this.data = {};
  this.headers = {};
  this.options = {};
  this.issues = {};
  this.format = "";
  this.method = "";
  this.path = "";
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

  this.options.host    = this.host;
  this.options.port    = this.port;
  this.options.headers = this.headers;
  this.options.method  = "GET";
  this.options.path    = "";

};


/**
 * Get an Issue.
 */
Api.prototype.getIssue = function(callback){
  var that = this;
  that.options.method = "GET";

  that.getIdIssue(function(id){
    var patternId = new RegExp(/([0-9]+$)/gi);
    var patternFormat = new RegExp(/[^(?!\/)]([a-z]+$)/gi);    
    that.issues.id = id.match(patternId);
    that.format = that.contentType.match(patternFormat)[0];
    that.options.path = "/issues/" + that.issues.id + "." + that.format;

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
Api.prototype.updateIssue = function(done_ratio, notes){
  var that = this;
  that.options.method = "PUT";

  /*
  tracker: { id: 1, name: 'Errores' },
  status: { id: 2, name: '19-En curso' },
  
  Nuevo      : 29
  Asignado   : 13
  En Curso   : 2
  Completado : 3
  Desarrollo Completo : 31

  */

  var putData = {
    "issue" : {
      "status_id" : that.data.issue.status.id,
      "done_ratio" : done_ratio,
      "notes" : notes
    }
  };

  var req = http.request(that.options, function(res) {

    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      if (res.statusCode === 200) {
        console.log('Issue updated correctly!');
      }else{
        console.log('Error: #' + res.statusCode);
      };
    });

  });
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  var body = JSON.stringify(putData);
  req.setHeader('Content-Length', body.length);
  console.log("cuerpo enviado("+body.length+"): "+body);
  req.write(body);
  req.end();

};


var api = new Api();

api.getIssue(function(){

  var issue = api.data.issue;

  //console.log(issue);

  api.updateIssue("12", "notasss12");


  /*
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
  */
});

