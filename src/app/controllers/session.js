const crypto = require('crypto')
const { hash } = require('bcryptjs')
const User = require('../../models/user')
const mailer = require('../../lib/mailer')


module.exports = {
    async loginForm(req, res) {
        const error = req.session.error
        req.session.error = await false
        return res.render('session/login.njk', { error })
    },
    resetForm(req, res) {
        return res.render('session/reset.njk', { token: req.query.token })
    },
    forgotForm(req, res) {
        return res.render('session/forgot.njk')
    },
    login(req, res) {
        req.session.user_id = req.user.id
        req.session.admin = req.user.is_admin

        req.session.sucess = `Bem vindo ${req.user.name}`
        return res.redirect('/admin')
    },
    logout(req, res) {
        req.session.destroy()

        return res.redirect('/login')
    },
    async forgot(req, res) {
        const user = req.user

        try {
            const token = crypto.randomBytes(20).toString('hex')

            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            await mailer.sendMail({
                to: user.email,
                from: 'no-reply@foodfy',
                subject: 'Recuperação de senha',
                html: `<h2>Recuperação de senha</h2>
                <p><a href='//localhost:3000/reset?token=${token}'>Recuperar</a></p>`
            })

            return res.render('session/forgot', {
                sucess: 'Verifique seu email'
            })

        } catch (err) {
            console.log(err)
            return res.render('session/forgot', {
                error: 'Erro inesperado'
            })
        }
    },
    async reset(req, res) {
        const user = req.user

        const { email, password, token } = req.body

        try {
            const newPassword = await hash(password, 8)

            await User.update(user.id, {
                password: newPassword,
                reset_token: '',
                reset_token_expires: ''
            })

            return res.render('session/login', {
                user: req.body,
                token,
                sucess: 'Senha atualizada'
            })
        } catch (err) {
            console.log(err)
            return res.render('session/reset', {
                error: 'Erro inesperado',
                user: req.body
            })
        }





    }
}