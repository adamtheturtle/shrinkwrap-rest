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
var mkdirp = require('mkdirp')

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
/*      function(next) {
        fs.writeFile('/root/.ssh/config', ssh_config, next)
      },*/
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
            /*Stupid thing gives an error when it works*/
            next()
        })
      },
/*      function(next) {
          cp.exec('eval `ssh-agent -s` && ssh-add github_key && npm install && npm shrinkwrap', {
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
/*        return done()*/
        console.log("WILL NPM INSTALL")
        cp.exec('npm install', {
          cwd: folderPath
        }, function(err, data, stderr) {
          /*if (err) return next(err)
          if (stderr) return next(stderr)*/
          next()
        })
      },
      function(next) {
        console.log("WILL NPM SHRINKWRAP")
        cp.exec('npm shrinkwrap', {
          cwd: folderPath
        }, function(err, data, stderr) {
/*          if (err) return next(err)
          if (stderr) return next(stderr)*/
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
    ], function(err){
      if (err) console.log("FINAL ERROR " + err)
      if (err) return done(err)
      done(null, shrinkwrap_contents)
    })
}