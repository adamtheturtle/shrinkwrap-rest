const http = require('http')
const Router = require('./router')


var router = Router()
var server = http.createServer(router)
server.listen(8080)
