// create the appropriate _id file in the app

var fs = require('fs');

function Setup (config) {
  var users = config.users;

  return function (done) {
    fs.writeFile('app/_id', users.join('-'), done);
  };
}

module.exports = function (grunt) {
  grunt.registerMultiTask('setup', function () {
    var done = this.async(),
        config = {
          users: grunt.option('target').split(',')
        };

    Setup(config)(done);
  });
};