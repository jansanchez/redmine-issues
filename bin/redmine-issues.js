#!/usr/bin/env node

/**
 * Module dependencies.
 */

var fs = require('fs')
  , program = require('commander')
  , path = require('path')
  , basename = path.basename
  , dirname = path.dirname
  , resolve = path.resolve
  , exists = fs.existsSync || path.existsSync
  , join = path.join
  , monocle = require('monocle')()
  , mkdirp = require('mkdirp')
  , Redmine = require('../');

/**
 * Functions.
 */

function config(configValue) {

  //console.log('configValue: '+configValue);

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
    flag = false;
    console.log("Favor ingresar una configuración válida(Ej: domain:yourdomain.com) sin espacios en blanco.");
    process.exit();
  }

  if (flag) {

    var configuration = new Redmine.FileManager("../config/config.json");

    configuration.set(key, value);
    configuration.save();

    console.log("Se registró correctamente {" + key + " : " + configuration.get(key) + "}");
  
  }else{
    console.log("Favor ingresar un valor de configuración válido(domain, port, apikey, contenttype).");
  };

  process.exit();
};

// redmine-issues options

var options = {};

program
  .version(require('../package.json').version)
  .usage('[options] <file ...>')
  .option('-i, --integer <n>', 'An integer argument')
  .option('-o, --optional [value]', 'An optional value')
  .option('-c, --config <key>:<value>', 'Configuration options', config)
  .option('-v, --verbose', 'A value that can be increased');


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
program.on('--config', function(){
  console.log('  --config:');
  console.log(arguments[0]);
  console.log(arguments[1]);
  process.exit();
});
*/




// options given, parse them

if (program.obj) {
  if (exists(program.obj)) {
    options = JSON.parse(fs.readFileSync(program.obj));
  } else {
    options = eval('(' + program.obj + ')');
  }
}

// --filename

if (program.path) options.filename = program.path;

// --no-debug

options.compileDebug = program.debug;


// --pretty

options.pretty = program.pretty;

// --watch

options.watch = program.watch;

// left-over args are file paths

var files = program.args;


stdin();


console.log('files: ',files);




/**
 * Compile from stdin.
 */

function stdin() {
  var buf = '';

  console.log('stdin');

  process.stdin.setEncoding('utf8');

  process.stdin.on('data', function(chunk){ buf += chunk; });

  process.stdin.on('end', function(){

    var output = 'nada';
    process.stdout.write(output);
  }).resume();
  
  process.on('SIGINT', function() {
    process.stdout.write('\n');
    process.stdin.emit('end');
    process.stdout.write('\n');
    process.exit();
  })
}




/**
 * Process the given path, compiling the redmine_labs files found.
 * Always walk the subdirectories.
 */

/*
function renderFile(path) {
  var re = /\.redmine_labs$/;
  fs.lstat(path, function(err, stat) {
    if (err) throw err;
    // Found redmine_labs file
    if (stat.isFile() && re.test(path)) {
      fs.readFile(path, 'utf8', function(err, str){
        if (err) throw err;
        options.filename = path;
        var fn = options.client ? redmine_labs.compileClient(str, options) : redmine_labs.compile(str, options);
        var extname = options.client ? '.js' : '.html';
        path = path.replace(re, extname);
        if (program.out) path = join(program.out, basename(path));
        var dir = resolve(dirname(path));
        mkdirp(dir, 0755, function(err){
          if (err) throw err;
          try {
            var output = options.client ? fn : fn(options);
            fs.writeFile(path, output, function(err){
              if (err) throw err;
              console.log('  \033[90mrendered \033[36m%s\033[0m', path);
            });
          } catch (e) {
            if (options.watch) {
              console.error(e.stack || e.message || e);
            } else {
              throw e
            }
          }
        });
      });
    // Found directory
    } else if (stat.isDirectory()) {
      fs.readdir(path, function(err, files) {
        if (err) throw err;
        files.map(function(filename) {
          return path + '/' + filename;
        }).forEach(renderFile);
      });
    }
  });
}
*/