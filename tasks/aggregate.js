// get, format, and write out the user(s'|'s) active tasks

var fs = require('fs'),
    request = require('request'),
    async = require('async');

function Aggregator (config) {
  var users = config.users,
      auth = config.auth;

  function getTasks (done) {
    async.map(users, function (user, cb) {
      var url = 'https://' + auth + '@' + user + '.cloudant.com/_active_tasks';
      request(url, function (err, res, body) {
        var json = JSON.parse(body),
            result = json.filter(function (task) {
              return task.type === 'replication';
            }).map(function (task) {
              return {
                source: task.source,
                target: task.target
              };
            });

        cb(err, result);
      });
    }, function (err, results) {
      if (err) throw err;

      var uniques = {},
          aggregate = [];
      results
        .reduce(function (a, b) {
          return a.concat(b);
        })
        .forEach(function (task) {
          if (!(task.source in uniques)) {
            uniques[task.source] = [task.target];
          } else {
            uniques[task.source].push(task.target);
          }
        });

      for (var i in uniques) {
        aggregate.push({
          source: i,
          targets: uniques[i]
        });
      }

      done(aggregate);
    });
  }

  return function (done) {
    getTasks(function (tasks) {
      fs.writeFile('app/_attachments/data.json', JSON.stringify(tasks), done);
    });
  };
}

module.exports = function (grunt) {
  grunt.registerMultiTask('get_active_tasks', function () {
    var done = this.async(),
        config = {
          auth: [this.data.user, this.data.pass].join(':'),
          users: grunt.option('target').split(',')
        };

    Aggregator(config)(done);
  });
};