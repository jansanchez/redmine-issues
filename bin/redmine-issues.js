#!/usr/bin/env node

/**
 * Module dependencies.
 */

var fs = require('fs')
  , path = require('path')
  , mkdirp = require('mkdirp')
  , monocle = require('monocle')()
  , program = require('commander')
  , basename = path.basename
  , dirname = path.dirname
  , exists = fs.existsSync || path.existsSync
  , join = path.join
  , resolve = path.resolve
  , Redmine = require('../');

/**
 * Functions.
 */

function config(configValue) {

  var arrConfig = configValue.split(':'),
      key = arrConfig[0],
      value = arrConfig[1],
      flag = false;

  switch (key){
    case "domain":
    case "port":
    case "apikey":
    case "contenttype":
      flag = true;
    break;
    default:
    flag = false;
    break;
  }

  if (value === undefined || value === " " || value === "") {
    console.log("Please enter a valid configuration(Ej. domain:yourdomain.com) without whitespaces.");
    process.exit();
  }

  if (flag) {
    var configuration = new Redmine.FileManager(Redmine.configFile);
    configuration.set(key, value);
    configuration.save();
    console.log("Set correctly {" + key + " : " + configuration.get(key) + "}");
  }else{
    console.log("Please enter a valid configuration value(domain, port, apikey, contenttype).");
  };
  process.exit();
};

// redmine-issues options

var options = {};

program
  .version(require('../package.json').version)
  .usage('[options] <file ...>')
  .option('-c, --config <key>:<value>', 'Configuration options', config)
  .option('-i, --issue <issue>', 'issue id')
  .option('-p, --percent <percent>', 'percent')
  .option('-m, --message <message>', 'the message');

program.on('--help', function(){
  console.log('  Examples:');
  console.log('');
  console.log('    # configure your domain');
  console.log('    $ redmine --config domain:yourdomain.com');
  console.log('');
  console.log('    # configure your port');
  console.log('    $ redmine --config port:80');
  console.log('');
  console.log('    # configure your apikey');
  console.log('    $ redmine --config apikey:here_your_api_key');
  console.log('');
  console.log('    # configure your content type');
  console.log('    $ redmine --config domain:application/json');

  console.log('');
});

program.parse(process.argv);


/*
* Program options
*/


if (program.issue){
  options.issue = program.issue || 0;
}

if (program.percent){
  options.percent = program.percent || 0;
}

if (program.message){
  options.message = program.message || "";
}

