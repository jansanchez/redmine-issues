
module.exports = function(grunt) {
  /*
  * Configuración
  */
  grunt.initConfig({
    jshint: {
      options: {
        jshintrc : '.jshintrc',
        "smarttabs" : true
      },
      lib: ['bin/**/*.js', 'lib/**/*.js']
    },
    watch: {
      js: {
        files: ['bin/**/*.js', 'lib/**/*.js'],
        tasks: ['jshint:lib'],
        options: {
          interrupt: true,
          livereload: {
            port: 35729
          }
        }
      }
    }
  });

  /*
  * Cargando tareas
  */
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');

  /*
  * Registro de tareas
  */
  grunt.registerTask('default', ['jshint']);

};
