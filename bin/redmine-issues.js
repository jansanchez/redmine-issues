#!/usr/bin/env node

/**
 * Module dependencies.
 */

var fs = require('fs'),
    path = require('path'),
    mkdirp = require('mkdirp'),
    monocle = require('monocle')(),
    program = require('commander'),
    Table = require('cli-table'),
    colors = require('colors'),
    basename = path.basename,
    dirname = path.dirname,
    exists = fs.existsSync || path.existsSync,
    join = path.join,
    resolve = path.resolve,
    Redmine = require('../');

/**
 * Main Config.
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
    case "language":
    case "head":
    case "border":
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

  var configuration = new Redmine.FileManager(Redmine.configFile);

  if (flag) {
    configuration.set(key, value);
    configuration.save();

    if (configuration.get("language") === "en") {
      console.log("Set correctly {" + key + " : " + configuration.get(key) + "}");      
    }else{
      console.log("Se estableció correctamente {" + key + " : " + configuration.get(key) + "}");      
    }
  }else{
    if (configuration.get("language") === "en") {
      console.log("Please enter a valid configuration value(domain, port, apikey, contenttype, language).");
    }else{
      console.log("Por favor ingrese una configuración válida(domain, port, apikey, contenttype, language).");
    }
  }
  process.exit();
}

/*
 * Program.
 */

program
  .version(require('../package.json').version)
  .usage('[options]')
  .option('-c, --config <key>:<value>', 'configuration options', config)
  .option('-i, --issue <issue>', 'issue id')
  .option('-p, --percent <percent>', 'percent of progress')
  .option('-m, --message <message>', 'your message or note')
  .option('-e, --estimated <estimated>', 'estimated hours')
  .option('-q, --query', 'query of issues')
  .option('-l, --limit, <limit>', 'limit of issues');
  //.option('-s, --spent <spent>', 'spent hours');

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
  console.log('    # configure your language');
  console.log('    $ redmine --config language:es');

  console.log('');
});

program.parse(process.argv);

/*
 * Program options.
 */

var options = {};

options.issue = program.issue || 0;
options.percent = program.percent || 0;
options.message = program.message || "";
options.estimated = program.estimated || 0;
options.query = program.query || false;
options.limit = program.limit || 5;
//options.spent = program.spent || 0;


/*
 * Functions.
 */


/*
 * Function getStateName.
 */

function getStateName(status){
  var pattern = new RegExp(/([a-z\ ]+$)/gi);
  pattern.lastIndex = 0;

  var arrStateName = status.name.match(pattern),
  stateName = arrStateName[0].toString();

  switch(status.id){
    case 0: // None
      stateName = "Ninguno".yellow;
    break;
    case 29: // Nuevo
      stateName = stateName.yellow;
    break;
    case 2: // En curso
      stateName = stateName.cyan;
    break;
    case 13: // Asignado
      stateName = stateName.blue;
    break;
    case 16: // Completo
    case 31: // Desarrollo Resuelto
      stateName = "Completo".grey;
    break;
    case 33: // En Produccion
      stateName = "Produccion".grey;
    break;
    case 22: // Conforme
      stateName = "Conforme".grey;
    break;
    case 39: // Obs. in Pre
      stateName = "Obs. Prep".grey;
    break;
    default:
      stateName = stateName.grey;
    break;
  }
  return stateName;
}


/*
 * Function issues.
 */

function issues(){
  var api = new Redmine.Api();
  api.getIssue(options.issue, function(){
    var issue = api.dataObject.issue;
    api.updateIssue(options.percent, options.message, options.estimated);
  });
}


/*
 * Function issuesList.
 */

function issuesList(){
  var api = new Redmine.Api(),
      configuration = new Redmine.FileManager(Redmine.configFile),
      queryObject = {};

  queryObject.limit = options.limit;

  api.getIssues(queryObject, function(response){

    var issues = response.issues,
    otherStates = [],
    stateName = "",
    status = {},
    statusId = 0,
    table = new Table(
      { head: ["Proyecto", "ID", "Tipo", "Estado", "Asunto", "Avance"], 
        colWidths: [13, 7, 10, 12, 50, 8],
        style: { head: [configuration.get("head")], border: [configuration.get("border")] }
      });

    for (var i = 0; i < issues.length; i++) {

      status = issues[i].status;
      statusId = Number(status.id);

      stateName = getStateName(status);

      var arrayTemp = [issues[i].project.name, issues[i].id.toString().magenta, issues[i].tracker.name, stateName, issues[i].subject, issues[i].done_ratio+'%'];

      if (statusId === 29 || statusId === 2 || statusId === 13) {
        table.push(arrayTemp);
      }else{
        otherStates.push(arrayTemp);
      }
    }

    for (var j = 0; j < otherStates.length; j++) {
      table.push(otherStates[j]);
    }

    console.log(table.toString());

  });
}


/*
 * Function issueDetail.
 */
function issueDetail(){
  var api = new Redmine.Api();
  var configuration = new Redmine.FileManager(Redmine.configFile);

  var queryObject = {};
  queryObject.limit = 1;

  if (options.issue !== 0) {
    queryObject.issue = options.issue;
  }

  api.getIssues(queryObject, function(response){

    var issue = response.issue,
    otherStates = [],
    stateName = "",
    description = "",
    statusId = 0,
    status = {};

    status = issue.status;
    statusId = Number(status.id);
    stateName = getStateName(status);

    var table = new Table({style: { head: [configuration.get("head")], border: [configuration.get("border")] }});

    table.push(
      { 'Proyecto': [issue.project.name] }, 
      { 'ID': [issue.id.toString().magenta] },
      { 'Asunto': [issue.subject] },
      { 'Tipo': [issue.tracker.name] },
      { 'Estado': [stateName] },
      { 'Asignado': [ issue.author.name.grey + "(".grey +issue.author.id.toString().grey+")".grey + " --> ".green + issue.assigned_to.name + "("+issue.assigned_to.id.toString().yellow+")"] },
      { 'Fecha de inicio': [issue.start_date]},
      { 'Avance': [issue.done_ratio+'%'] }
    );

    console.log(table.toString());

    description = issue.description;
    description = description.replace(/<pre>/g,"");
    description = description.replace(/<\/pre>/g,"");

    console.log(" Descripción: ".green);
    console.log(description);
    console.log("");

  });
}


/*
 * Run Functions.
 */

if (options.percent !== 0 ) {
  issues();
}else{
  if (options.message !== "") {
    issues();
  }
}

if (options.percent === 0 && options.message === "" && options.issue !== 0 && options.estimated === 0) {
  issueDetail();
}else{
  if (options.estimated !== 0) {
    issues();
  }
}

if (options.query) {
  issuesList();
}

