const { hash } = require('bcryptjs')
const User = require('../../models/user')
const mailer = require('../../lib/mailer')

module.exports = {
    create(req, res) {
        return res.render('admin/users/create.njk')
    },
    async edit(req, res) {
        try {
            const id = req.params.id
            let user = await User.findUsers({ where: { id } })

            user = { ...user, admin: user.is_admin }

            return res.render('admin/users/edit.njk', { items: user })
        } catch (err) {
            console.log(err)
        }
    },
    profile(req, res) {
        return res.render('admin/users/profile.njk', { items: req.user })
    },
    async list(req, res) {
        try {
            const error = req.session.error
            req.session.error = false

            const users = await User.all()

            return res.render('admin/users/list.njk', { items: users, error })
        } catch (err) {
            console.log(err)
        }
    },
    update(req, res) {
        try {
            const user = req.user
            let { name, email } = req.body

            await = User.update({
                name,
                email
            }, user.id)

            return res.render('admin/users/profile', {
                items: req.body,
                sucess: "Dados atualizados"
            })
        } catch (err) {
            console.log(err)
            return res.render('admin/users/profile', {
                error: 'Erro inesperado, tente novamente'
            })
        }
    },
    async post(req, res) {
        try {
            const random = Math.random().toString(20).substr(2, 5)
            const password = await hash(random, 8)

            if (!req.body.admin) req.body.admin = false

            await User.create({
                name: req.body.name,
                email: req.body.email,
                password,
                is_admin: req.body.admin,
            })

            await mailer.sendMail({
                to: req.body.email,
                from: 'no-reply@foodfy',
                subject: 'Senha de acesso',
                html: `<h2>Senha de acesso foodfy</h2>
            <p>Usuário: ${req.body.name}</p>
            <p>Senha: ${password}</p>
            `
            })

            req.session.sucess = 'Usuário adicionado'
            return res.redirect('/admin/users')
        } catch (err) {
            console.log(err)
            return res.render('admin/users/create', {
                error: 'Erro inesperado, tente novamente',
                items: req.body
            })
        }
    },
    async put(req, res) {
        try {
            let { name, email, id, admin } = req.body

            let is_admin = false
            if (admin == 'true') is_admin = true

            await User.update({
                name,
                email,
                is_admin
            }, id)

            req.session.sucess = 'Usuário atualizado'
            return res.redirect('/admin/users')
        } catch (err) {
            console.log(err)
            return res.render('admin/users/edit', {
                error: 'Erro inesperado, tente novamente',
                items: req.body
            })
        }
    },
    async delete(req, res) {
        try {
            await User.delete(req.params.id)

            const users = await User.all()

            req.session.sucess = 'Usuário deletado'
            return res.redirect('/admin/users')
        } catch (err) {
            console.log(err)
            const users = await User.all()

            return res.render('admin/users/list', {
                items: users,
                error: 'Não foi possível deletar a conta'
            })
        }
    }
}