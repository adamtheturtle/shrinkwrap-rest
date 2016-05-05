var async = require('async')

/*

  inputs:

    * github ssh key
    * package.json contents

  outputs:

    * shrinkwrap.json contents
  
*/
var async = require('async')
var fs = require('fs')
var cp = require('child_process')

module.exports = function(github_key, package_json_content, done){

    var timestamp = new Date().getTime()
    var folderPath = '/tmp/shrinkwrap-build-' + timestamp
    var ssh_config = [
      'Host github',
      '    User git',
      '    HostName github.com',
      '    IdentityFile ' + folderPath + '/github_key',
      '    StrictHostKeyChecking no'
    ].join("\n")

    var shrinkwrap_contents = null
    async.series([
      function(next) {
        fs.mkdir(folderPath, next)
      },
      function(next) {
        fs.mkdir('/root/.ssh', next)
      },
      function(next) {
        fs.writeFile(folderPath + '/package.json', package_json_content, next)
      },
      function(next) {
        fs.writeFile(folderPath + '/github_key', github_key, next)
      },
      function(next) {
        fs.writeFile('/root/.ssh/config', ssh_config, next)
      },
      function(next) {
          cp.exec('chmod 0600 github_key', {
          cwd: folderPath
        }, function(err, data, stderr) {
            if (err) return next(err)
            if (stderr) return next(stderr)
            next()
        })
      },
/*      function(next) {
          cp.exec('eval `ssh-agent -s`', {
          cwd: folderPath
        }, function(err, data, stderr) {
            console.log('eval error')
            console.dir(err)
            console.log(data)
            console.log(stderr)
            next(err)
        })
      },*/
      function(next) {
        cp.exec('npm install --cache .', {
          cwd: folderPath
        }, function(err, data, stderr) {
          if (err) return next(err)
          if (stderr) return next(stderr)
          next()
        })
      },
      function(next) {
        cp.exec('npm shrinkwrap', {
          cwd: folderPath
        }, function(err, data, stderr) {
          if (err) return next(err)
          if (stderr) return next(stderr)
          next()
        })
      },
    ], function(err){
      if (err) console.log("FINAL ERROR " + err)
      if (err) return done(err)
      done()
    })
}