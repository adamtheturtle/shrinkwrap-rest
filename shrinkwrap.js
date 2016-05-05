var async = require('async')

/*

  inputs:

    * github ssh key
    * package.json contents

  outputs:

    * shrinkwrap.json contents
  
*/

module.exports = function(githubKey, packageJSON, done){

  console.log(githubKey)
  console.log(packageJSON)

  done()

}