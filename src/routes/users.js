const express = require("express")
const routes = express.Router()

const users = require("../app/controllers/users")
const validator = require("../app/validators/users")

const { isAdmin } = require('../app/middlewares/session')

// Rotas de perfil de um usuário logado
routes.get('/profile', validator.show, users.profile) // Mostrar o formulário com dados do usuário logado
routes.put('/profile', validator.update, users.update)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', users.list) //Mostrar a lista de usuários cadastrados
routes.get('/users/create', isAdmin, users.create)
routes.post('/users', isAdmin, validator.post, users.post) //Cadastrar um usuário
routes.get('/users/edit/:id', isAdmin, users.edit)
routes.put('/users', isAdmin, validator.put, users.put) // Editar um usuário
routes.delete('/users/:id', isAdmin, validator.deleting,users.delete) // Deletar um usuário

module.exports = routes