
module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc : '.jshintrc',
        "smarttabs" : true
      },
      lib: ['bin/**/*.js', 'lib/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['jshint']);

};