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
   * Lee el contenido de un archivo y lo convierte en un Objeto JSON.
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
   * Devuelve el contenido del archivo en un Objeto JSON.
   *
   */
  set: function(key, value){
    this.dataObject[key] = value;
  },
  /**
   * Retorna el valor del objeto indicado.
   *
   */
  get: function(key){
    return this.dataObject[key];
  },
  /**
   * Guarda el objeto de configuracion en el archivo fisico.
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
   * Restaura el archivo de configuracion.
   *
   */
  restoreConfigFile: function(){
    this.data = fs.readFileSync(this.templateFile, this.charset);
    this.dataObject = JSON.parse(this.data);
    this.save();
  }

};