const HttpHashRouter = require('http-hash-router')
const concat = require('concat-stream')
const shrinkwrap = require('./shrinkwrap')

function doError(res, error){
  res.statusCode = 500
  res.end(error)
}

module.exports = function(opts){

  var router = HttpHashRouter()

  router.set('/v1/shrinkwrap', {
    POST:function(req, res, opts, cb){
      
      req.pipe(concat(function(data){
        data = JSON.parse(data.toString())

        if(!data.github_ssh_key){
          return doError(res, 'github_ssh_key property required')
        }

        if(!data.package_file){
          return doError(res, 'package_file property required')
        }

        var githubKey = new Buffer(data.github_ssh_key, 'base64').toString()
        var packageJSON = new Buffer(data.package_file, 'base64').toString()
        shrinkwrap(githubKey, packageJSON, function(err, data){
          if(err) return doError(res, err)
          res.setHeader('Content-type', 'application/json')
          res.statusCode = 200
          res.end(data)
        })
      }))
    }
  })

  function handler(req, res) {

    function onError(err) {
      if (err) {
        res.statusCode = err.statusCode || 500;
        res.end(err.message);
      }
    }

    router(req, res, {}, onError);
  }

  return handler
}