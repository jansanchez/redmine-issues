/**
 * Module dependencies.
 */

var fs = require('fs');

/*
 *
 * Filemanager
 *
 */

var FileManager = module.exports = function FileManager(filename) {
  this.charset = "utf8";
  this.data = "";
  this.dataObject = {};
  this.templateFile = "../config/config.template.json";
  this.filename = filename;
  this.readFileName();
};

/**
 * FileManager prototype.
 */

FileManager.prototype = {
  /**
   * Reads the contents of a file and converts it to an JSON Object.
   *
   */
  readFileName: function(){
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
    };
  },
  /**
   * Setter.
   *
   */
  set: function(key, value){
    this.dataObject[key] = value;
  },
  /**
   * Getter.
   *
   */
  get: function(key){
    return this.dataObject[key];
  },
  /**
   * Saves the configuration object in the physical file.
   *
   */
  save: function(){
    var stringData = JSON.stringify(this.dataObject);

    try {
      fs.writeFileSync(this.filename, stringData, this.charset);
    }
    catch(err) {
      console.log(err.message);
    }
  },
  /**
   * Restores the configuration file.
   *
   */
  restoreConfigFile: function(){
    this.data = fs.readFileSync(this.templateFile, this.charset);
    this.dataObject = JSON.parse(this.data);
    this.save();
  }

};