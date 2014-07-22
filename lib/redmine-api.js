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
  this.filename = filename || "../config/config.json";
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

  var configuration = new FileManager(this.filename);

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
  var self = this;
  self.options.method = "GET";

  self.getIdIssue(function(id){

    var patternId = new RegExp(/([0-9]+$)/gi),
        patternFormat = new RegExp(/[^(?!\/)]([a-z]+$)/gi);
    
    if (issue === 0) {
      self.idIssue = id.match(patternId);
    }else{
      self.idIssue = issue;
    }
    
    if (self.idIssue === null) {
      console.log('Please, enter your issue id.');
      return false;
    }
    
    self.format = self.contentType.match(patternFormat)[0];
    self.options.path = "/issues/" + self.idIssue + "." + self.format;

    //console.log(self.options.path);

    var req = http.request(self.options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        if (res.statusCode === 200) {
          self.data += chunk;
        }else{
          console.log('Error: ' + res.statusCode + ", Please verify your request.");
        }
      });

      res.on('end', function(){
        if (res.statusCode === 200) {
          self.dataObject = JSON.parse(self.data);
          callback(self.dataObject);
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
  var self = this;
  self.options.method = "GET";

  var patternFormat = new RegExp(/[^(?!\/)]([a-z]+$)/gi),
      string = "&limit="+queryObject.limit;

  self.format = self.contentType.match(patternFormat)[0];

  if (queryObject.issue) {
    self.options.path = "/issues/" + queryObject.issue + "." + self.format;
  }else{
    self.options.path = "/issues." + self.format + "?assigned_to_id=me" + string;
  }

  var req = http.request(self.options, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      if (res.statusCode === 200) {
        self.data += chunk;
      }else{
        console.log('Error: ' + res.statusCode + ", Please verify your request.");
      }
    });
    res.on('end', function(){
      if (res.statusCode === 200) {
        self.dataObject = JSON.parse(self.data);
        callback(self.dataObject);
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
  var self = this,
      newStatus = 2,
      newNotes = notes,
      changeRatio = false,
      putData = {
        "issue" : {}
      },
      counter = 0;

  estimatedHours = Number(estimatedHours);

  self.options.method = "PUT";
  if (doneRatio === 0) {
    doneRatio = self.dataObject.issue.done_ratio;
  }else{
    doneRatio = Number(doneRatio);
  }

  if (doneRatio === 100) {
    if (self.dataObject.issue.tracker.id === 2) {
      newStatus = 3;  // Completed
    }else{
      newStatus = 31; // Solved
    }
  }

  if (self.dataObject.issue.status.id !== newStatus) {
    putData.issue.status_id = newStatus;    
  }

  if (self.dataObject.issue.done_ratio !== doneRatio) {
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
    var req = http.request(self.options, function(res) {

      res.setEncoding('utf8');

      res.on('data', function (chunk) {
        if (res.statusCode !== 200) {
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

