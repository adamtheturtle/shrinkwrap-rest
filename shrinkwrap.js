var async = require('async')
var fs = require('fs')
var cp = require('child_process')
var mkdirp = require('mkdirp')

module.exports = function(github_key, package_json_content, done) {

  /*
      Unique timestamped directory name so that this can be run without
      conflicts multiple times.
    */
  var timestamp = new Date().getTime()
  var folderPath = '/tmp/shrinkwrap-build-' + timestamp

  var shrinkwrap_contents = null
  async.series([
    function(next) {
      mkdirp(folderPath, next)
    },
    function(next) {
      mkdirp('/root/.ssh', next)
    },
    function(next) {
      fs.writeFile(folderPath + '/package.json', package_json_content, next)
    },
    function(next) {
      fs.writeFile('/root/.ssh/id_rsa', github_key, next)
    },
    function(next) {
      cp.exec('chmod 0600 /root/.ssh/id_rsa', {
        cwd: folderPath
      }, function(err, data, stderr) {
        if (err) return next(err)
        if (stderr) return next(stderr)
        next()
      })
    },
    function(next) {
      cp.exec('ssh-keyscan -t rsa github.com >> /root/.ssh/known_hosts', {
        cwd: folderPath
      }, function(err, data, stderr) {
        next()
      })
    },
    function(next) {
      cp.exec('npm install', {
        cwd: folderPath
      }, function(err, data, stderr) {
        next()
      })
    },
    function(next) {
      cp.exec('npm shrinkwrap', {
        cwd: folderPath
      }, function(err, data, stderr) {
        next()
      })
    },
    function(next) {
      fs.readFile(folderPath + '/npm-shrinkwrap.json', 'utf8', function(err, data) {
        if (err) next(err)
        shrinkwrap_contents = data
        next()
      })
    },
  ], function(err) {
    if (err) console.log(err)
    if (err) return done(err)
    done(null, shrinkwrap_contents)
  })
}
