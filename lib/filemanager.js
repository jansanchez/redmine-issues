/**
 * Module dependencies.
 */

var fs = require('fs');

/*
 * Filemanager.
 *
 */

var FileManager = module.exports = function FileManager(filename, templateFile) {
  this.charset = "utf8";
  this.data = "";
  this.dataObject = {};
  this.templateFile = templateFile || "../config/config.template.json";
  this.filename = filename || "../config/config.json";
  this.readFileName();
  this.format = this.dataObject['contenttype'];
};

/**
 * FileManager prototype.
 */

/**
 * Reads the contents of a file and converts it to an JSON Object.
 */
FileManager.prototype.readFileName = function() {
  if (fs.existsSync(this.filename)) {
    try {
      this.data = fs.readFileSync(this.filename, this.charset);
      this.dataObject = JSON.parse(this.data);
    }
    catch(err) {
      console.log(err.message);
    }
  }else{
    this.restoreConfigFile();
  }
};

/**
 * Setter.
 */
FileManager.prototype.set = function(key, value){
  this.dataObject[key] = value;
};

/**
 * Getter.
 */
FileManager.prototype.get = function(key){
  return this.dataObject[key];
};

/**
 * Saves the configuration object in the physical file.
 */
FileManager.prototype.save = function(){
  var stringData = JSON.stringify(this.dataObject);

  try {
    fs.writeFileSync(this.filename, stringData, this.charset);
  }
  catch(err) {
    console.log(err.message);
  }
};

/**
 * Saves the configuration object in the physical file.
 */
FileManager.prototype.restoreConfigFile = function(){
  this.data = fs.readFileSync(this.templateFile, this.charset);
  this.dataObject = JSON.parse(this.data);
  this.save();
};

/**
 * Getter from key caption.
 */
FileManager.prototype.getCaption = function(key){
  return this.dataObject['caption'][key];
};