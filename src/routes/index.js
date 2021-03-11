const express = require("express")
const routes = express.Router()

const site = require("../app/controllers/site")
const redirecters = require("../app/controllers/redirecters")

const { logged } = require('../app/middlewares/session')

// session
const session = require('./session')
routes.use('/', session)

// site

routes.get('/', site.home)
routes.get('/about', site.about)
routes.get('/recipes', site.recipes)
routes.get('/recipes/:index', site.showRecipe)
routes.get('/chefs', site.chefs)
routes.get('/chefs/:index', site.showChef)

routes.post('/', site.post)
routes.post('/recipes', site.post)

// users
const users = require('./users')
routes.use('/admin', logged, users)

// recipes
const recipes = require('./recipes')
routes.use('/admin/recipes', recipes)

// chefs
const chefs = require('./chefs')
routes.use('/admin/chefs', chefs)

// redirects

routes.get('/admin', redirecters.admin)
routes.get('/admin/create', redirecters.create)
routes.get('/create', redirecters.create)

module.exports = routes
