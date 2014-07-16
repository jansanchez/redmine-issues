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
  this.data = "";
  this.dataObject = {};
  this.headers = {};
  this.options = {};
  this.IdIssue = 0;
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

  this.issues = configuration.get('issue');

  this.language = configuration.get('language');

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
Api.prototype.getIssue = function(issue, callback){
  var that = this;
  that.options.method = "GET";

  //console.log('getIssue');

  that.getIdIssue(function(id){

    var patternId = new RegExp(/([0-9]+$)/gi);
    var patternFormat = new RegExp(/[^(?!\/)]([a-z]+$)/gi);

    //console.log('issue', issue);
    
    if (issue == 0) {
      that.IdIssue = id.match(patternId);
    }else{
      that.IdIssue = issue;
    };
    
    if (that.IdIssue===null) {
      console.log('Please, enter your issue id.');
      return false;
    };
    
    that.format = that.contentType.match(patternFormat)[0];
    that.options.path = "/issues/" + that.IdIssue + "." + that.format;

    console.log(that.options.path);

    var req = http.request(that.options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        if (res.statusCode === 200) {
          that.data += chunk;
        }else{
          console.log('Error: ' + res.statusCode);
        }
      });

      res.on('end', function(){
        that.dataObject = JSON.parse(that.data);
        callback(that.dataObject);
      });
    });

    req.on('error', function(e) {
      if (that.language === "en") {
        console.log('Problem with request: ' + e.message);
      }else{
        console.log('Ocurrió un error con la solicitud: ' + e.message);
      };
    });
    req.end();

  });

};

/**
 * get Id of a Issue.
 */
Api.prototype.getIdIssue = function(callback){
  var command = "git rev-parse --abbrev-ref HEAD";
  var exe = new Execute(command, callback);
};

/**
 * Get multiple Issues.
 */
Api.prototype.getIssues = function(querystring, callback){
  var that = this;
  that.options.method = "GET";

  //console.log('getIssues');

  var patternFormat = new RegExp(/[^(?!\/)]([a-z]+$)/gi);

  that.format = that.contentType.match(patternFormat)[0];
  that.options.path = "/issues." + that.format + "?assigned_to_id=me&limit=2";

  console.log(that.options.path);
  console.log('_ _ _ _ _ _ _ _ _');

  var req = http.request(that.options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      if (res.statusCode === 200) {
        that.data += chunk;
      }else{
        console.log('Error: ' + res.statusCode);
      }
    });
    res.on('end', function(){
      that.dataObject = JSON.parse(that.data);
      callback(that.dataObject);
    });
  });

  req.on('error', function(e) {
    if (that.language === "en") {
      console.log('Problem with request: ' + e.message);
    }else{
      console.log('Ocurrió un error con la solicitud: ' + e.message);
    };
  });

  req.end();

  

};

/**
 * Update Issue.
 */
Api.prototype.updateIssue = function(doneRatio, notes, estimatedHours, spentHours){
  var that = this,
      newStatus = 2,
      newNotes = notes;

  that.options.method = "PUT";
  if (doneRatio === 0) {
    doneRatio = that.data.issue.done_ratio;
  }else{
    doneRatio = Number(doneRatio);
  };

  if (doneRatio === 100) {
    if (that.data.issue.tracker.id == 2) {
      newStatus = 3; // Completado
    }else{
      newStatus = 31; // Desarrollo Resuelto
    };
  };
  
  if (notes == "") {
    if (that.language === "en") {
      newNotes = "Updating progress to "+ doneRatio +"%.";
    }else{
      newNotes = "Actualizando Avance a "+ doneRatio +"%.";
    };
  };
  
  var putData = {
    "issue" : {
      "status_id" : newStatus,
      "done_ratio" : doneRatio,
      "notes" : newNotes
    }
  };

  if (Number(estimatedHours) !== 0) {
    putData.issue.estimated_hours = Number(estimatedHours);    
  };

  // esta caracteristica aun no se encuentra disponible
  if (Number(spentHours) !== 0) {
    putData.issue["spent_time"] = Number(spentHours);
  }; 

  var req = http.request(that.options, function(res) {

    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      if (res.statusCode === 200) {
        if (that.language === "en") {
          console.log('Issue updated correctly!');
        }else{
          console.log('Ticket actualizado correctamente!');
        }
      }else{
        console.log('Error: ' + res.statusCode);
      };
    });

  });
  req.on('error', function(e) {
    console.log('problem with request: ' + e.message);
  });

  var body = JSON.stringify(putData);
  req.setHeader('Content-Length', body.length);
  console.log("Sent ("+body.length+"): "+body);
  req.write(body);
  req.end();

};



Api.prototype.escapeJSONString = function(key, value) {
  if (typeof value == 'string') {
    return value.replace(/[^ -~\b\t\n\f\r"\\]/g, function(a) {
    return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
    });
  }
  return value;
}

Api.prototype.JSONStringify = function(data) {
  return JSON.stringify(data, this.escapeJSONString).replace(/\\\\u([\da-f]{4}?)/g, '\\u$1');
}




/*

var api = new Api();

api.getIssue(function(){

  var issue = api.data.issue;

  //console.log(issue);

  //api.updateIssue("21", "nota 21");
  
  //console.log('Issue: ' + issue.id);
  //console.log('Proyecto:' + issue.project.name);
  //console.log('Asunto: ' + issue.subject);
  ////console.log(issue.tracker.id);
  //console.log('Tipo: ' + issue.tracker.name);
  ////console.log(issue.status.id);
  //console.log('Estado: ' + issue.status.name);
  //console.log('Author: ' + issue.author.name + '('+ issue.author.id +')');
  ////console.log(issue.assigned_to.id);
  //console.log('Asignado a: ' + issue.assigned_to.name + '('+ issue.assigned_to.id +')');
  //console.log('Fecha de inicio: ' + issue.start_date);
  //console.log('Fecha de termino: ' + issue.due_date);
  //console.log('Porcentaje: ' + issue.done_ratio + '%');
  //console.log('Horas estimadas: ' + issue.estimated_hours);
  //console.log('Horas utilizadas: ' + issue.spent_hours);
  
});

*/