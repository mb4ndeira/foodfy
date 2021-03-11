const express = require("express")
const routes = express.Router()

const recipes = require("../app/controllers/recipes")
const multer = require('../app/middlewares/multer')

const { isMine } = require('../app/middlewares/recipes')

routes.get('/', recipes.index)
routes.get("/create", recipes.create)
routes.get("/:index", recipes.show)
routes.get("/:index/edit", isMine,recipes.edit)

routes.post("/", multer.array('images', 5), recipes.post)
routes.put("/", isMine, multer.array('images', 5), recipes.put)
routes.delete("/", isMine, recipes.delete)

module.exports = routes