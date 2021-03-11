const express = require("express")
const routes = express.Router()

const session = require("../app/controllers/session")
const validator = require("../app/validators/session")

// login/logout
routes.get('/login', session.loginForm)
routes.post('/login', validator.login, session.login)
routes.post('/logout', session.logout)

// reset password
routes.get('/forgot', session.forgotForm)
routes.get('/reset', session.resetForm)
routes.post('/forgot', validator.forgot, session.forgot)
routes.post('/reset', validator.reset,session.reset) 

module.exports = routes