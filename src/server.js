const express = require("express")
const nunjucks = require("nunjucks")
const routes = require("./routes/index")
const method = require("method-override")
const session = require("./app/config/session")
const server = express()

server.use(session)
server.use((req, res, next) => {
    res.locals.session = req.session 
    res.locals.user = req.user
    next()
})

server.use(method("_method"))
server.use(express.urlencoded({extended:true})) 
server.use(express.static('./'))
server.use(routes)

server.set('view engine', 'njk')

 nunjucks.configure('./src/app/views', {
    express:server,
    autoescape:false,
    noCache: true
})

server.listen(process.env.PORT || 4000, function(){
    console.log("server is running")
})


