const User = require('../../models/user')
const {compare}= require('bcryptjs')

const login = async (req, res, next) => {
    const { email, password } = req.body

    const user = await User.findUsers({ where: { email } })

    if (!user) return res.render('session/login.njk', {
        items: req.body,
        error: 'Usuário não registrado'
    })

    const passed = await compare(password, user.password)

    if (!passed) return res.render('session/login.njk', {
        items: req.body,
        error: 'Senha incorreta'
    })

    req.user = user

    return next()
}
const forgot = async (req, res, next) => {
    const { email } = req.body

    try {
        let user = await User.find({ where: { email } })

        if (!user) return res.render('session/forgot.njk', {
            user: req.body,
            error: 'Email não cadastrado'
        })

        req.user = user

        next()
    } catch (err) {
        console.log(err)
    }
}
const reset = async (req, res, next) => {
    const { email, password, password_repeat, token } = req.body

    const user = await User.find({ where: { email } })

    if (!user) return res.render('session/reset.njk', {
        items: req.body,
        error: 'Usuário não registrado',
        token
    })

    if (password != password_repeat)
        return res.render('session/reset.njk', {
            error: 'Senhas não coincidem',
            user: req.body,
            token
        })

    if (token != user.reset_token) return res.render('session/reset', {
        error: 'Token inválido',
        user: req.body
    })

    let now = new Date()
    now = now.setHours(now.getHours())

    if (now > user.reset_token_expires) return res.render('session/reset', {
        error: 'Token expirado',
        user: req.body
    })

    req.user = user

    next()
}

module.exports = { login, forgot, reset }