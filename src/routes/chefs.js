const express = require("express")
const routes = express.Router()

const chefs = require("../app/controllers/chefs")
const multer = require('../app/middlewares/multer')

const { isAdmin } = require('../app/middlewares/session')

routes.get('/', chefs.index)
routes.get("/create", isAdmin, chefs.create)
routes.get("/:index", chefs.show)
routes.get("/:index/edit",  isAdmin,chefs.edit)

routes.post("/", isAdmin, multer.array('image', 1), chefs.post)
routes.put("/", isAdmin, multer.array('image', 1), chefs.put)
routes.delete("/", isAdmin, chefs.delete)

module.exports = routes