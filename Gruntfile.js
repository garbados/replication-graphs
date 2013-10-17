// get config if it exists
try {
  var config = require('./config');
} catch (e) {
  var config = {};
}

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    config: config,
    jshint: {
      files: [
        'tasks/*',
        'Gruntfile.js'
      ]
    },
    prompt: {
      app: {
        options: {
          questions: [{
            config: 'username',
            type: 'input',
            message: 'What\'s your Cloudant username?'
          },{
            config: 'db',
            type: 'input',
            message: 'What database will your graphs inhabit?',
            default: 'replication-graphs'
          },{
            config: 'adm_user',
            type: 'input',
            message: "What is your admin username?"
          },{
            config: 'adm_pass',
            type: 'password',
            message: "What is your admin password?"
          }]
        }
      }
    },
    template: {
      app: {
        options: {
          data: {
            username: '<%= username %>',
            db: '<%= db %>',
            adm_user: '<%= adm_user %>',
            adm_pass: '<%= adm_pass %>'
          }
        },
        files: {
          'config.js': ['config.js.example']
        }
      }
    },
    'couch-compile': {
      app: {
        files: {
          'app.json': 'app'
        }
      }
    },
    'couch-push': {
      options: '<%= config.auth %>',
      app: {
        files: {
          '<%= config.remote %>': 'app.json'
        }
      }
    },
    get_active_tasks: {
      app: '<%= config.auth %>'
    },
    setup: {
      app: {

      }
    }
  });

  // Load plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.loadTasks('./tasks');

  // Default task(s).
  grunt.registerTask('default', [
    'jshint',
    'setup',
    'get_active_tasks',
    'couch'
  ]);

  grunt.registerTask('init', [
    'prompt',
    'template'
  ]);

};