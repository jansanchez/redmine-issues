/**
 * Module dependencies.
 */

var exec = require("child_process").exec;

/*
 * Execute
 *
 */

var Execute = module.exports = function Execute(command, callback) {
  this.execute(command, callback);
};

/**
 * Execute prototype.
 */


/**
 * Execute Command.
 */
Execute.prototype.execute = function(command, callback){
  exec(command, function (error, stdout, stderr) {
    callback(stdout.replace(/\n/gi, ''), error);
  });
};
