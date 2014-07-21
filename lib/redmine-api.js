/**
 * Module dependencies.
 */

var FileManager = require('./filemanager'),
    http = require('http'),
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
  this.idIssue = 0;
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

  that.getIdIssue(function(id){

    var patternId = new RegExp(/([0-9]+$)/gi);
    var patternFormat = new RegExp(/[^(?!\/)]([a-z]+$)/gi);
    
    if (issue === 0) {
      that.idIssue = id.match(patternId);
    }else{
      that.idIssue = issue;
    }
    
    if (that.idIssue === null) {
      console.log('Please, enter your issue id.');
      return false;
    }
    
    that.format = that.contentType.match(patternFormat)[0];
    that.options.path = "/issues/" + that.idIssue + "." + that.format;

    var req = http.request(that.options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        if (res.statusCode === 200) {
          that.data += chunk;
        }else{
          console.log('Error: ' + res.statusCode + ", Please verify your request.");
        }
      });

      res.on('end', function(){
        if (res.statusCode === 200) {
          that.dataObject = JSON.parse(that.data);
          callback(that.dataObject);
        }
      });
    });

    req.on('error', function(e) {
        console.log('Problem with request: ' + e.message);
    });

    req.end();

  });
};

/**
 * get Id of a Issue.
 */
Api.prototype.getIdIssue = function(callback){
  var command = "git rev-parse --abbrev-ref HEAD",
  exe = new Execute(command, callback);
};

/**
 * Get multiple Issues.
 */
Api.prototype.getIssues = function(queryObject, callback){
  var that = this;
  that.options.method = "GET";

  var patternFormat = new RegExp(/[^(?!\/)]([a-z]+$)/gi),
      string = "&limit="+queryObject.limit;

  that.format = that.contentType.match(patternFormat)[0];

  if (queryObject.issue) {
    that.options.path = "/issues/" + queryObject.issue + "." + that.format;
  }else{
    that.options.path = "/issues." + that.format + "?assigned_to_id=me" + string;
  }

  var req = http.request(that.options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      if (res.statusCode === 200) {
        that.data += chunk;
      }else{
        console.log('Error: ' + res.statusCode + ", Please verify your request.");
      }
    });
    res.on('end', function(){
      if (res.statusCode === 200) {
        that.dataObject = JSON.parse(that.data);
        callback(that.dataObject);
      }
    });
  });

  req.on('error', function(e) {
    console.log('Problem with request: ' + e.message);
  });

  req.end();

};

/**
 * Update Issue.
 */
Api.prototype.updateIssue = function(doneRatio, notes, estimatedHours, spentHours){
  var that = this,
      newStatus = 2,
      newNotes = notes,
      changeRatio = false,
      putData = {
        "issue" : {}
      },
      counter = 0;

  estimatedHours = Number(estimatedHours);

  that.options.method = "PUT";
  if (doneRatio === 0) {
    doneRatio = that.dataObject.issue.done_ratio;
  }else{
    doneRatio = Number(doneRatio);
  }

  if (doneRatio === 100) {
    if (that.dataObject.issue.tracker.id == 2) {
      newStatus = 3;  // Completed
    }else{
      newStatus = 31; // Solved
    }
  }

  if (that.dataObject.issue.status.id !== newStatus) {
    putData.issue.status_id = newStatus;    
  }

  if (that.dataObject.issue.done_ratio !== doneRatio) {
    putData.issue.done_ratio = doneRatio;
    changeRatio = true;
  }

  if (newNotes === "" && changeRatio === true) {
    newNotes = "Updating progress to " + doneRatio + "%.";
    if (estimatedHours === 0) {
      putData.issue.notes = newNotes;
    }
  }else{
    if (newNotes !== "") {
      putData.issue.notes = newNotes;
    }
  }

  if (estimatedHours !== 0) {
    putData.issue.estimated_hours = estimatedHours;    
  }

  for (var prop in putData.issue) {
    if (putData.issue.hasOwnProperty(prop)) {
      counter++;
    }
  }

  if (counter !== 0){
    var req = http.request(that.options, function(res) {

      res.setEncoding('utf8');

      res.on('data', function (chunk) {
        if (res.statusCode === 200) {
          console.log('Issue updated correctly!');          
        }else{
          console.log('Error: ' + res.statusCode + ", Please verify your request.");
        }
      });

      res.on('end', function(){
        if (res.statusCode === 200) {
          console.log('Issue updated correctly!');    
        }
      });

    });

    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    });

    var body = JSON.stringify(putData);
    req.setHeader('Content-Length', body.length);
    //console.log("Sent (" + body.length + "): " + body);
    req.write(body);

    req.end();

  }else{
    console.log("Review your settings, there is no new information to send.");
  }

};
