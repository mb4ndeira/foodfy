const User = require('../../models/user')
const { checkCompletion } = require('../../lib/useful')
const { compare } = require('bcryptjs')

const show = async (req, res, next) => {
    const id = req.session.user_id

    const user = await User.find({ where: { id } })

    if (!user) return res.render('admin/users/profile', {
        error: 'Usuário não encontrado'
    })

    req.user = user

    return next()
}

const post = async (req, res, next) => {
    const pageContent = checkCompletion(req.body)

    if (!pageContent) return res.render('admin/users/profile', {
        error: 'Por favor preencha todos os campos',
        items: req.body
    })

    const { password, password_repeat, email, name } = pageContent
    const id = req.session.user_id

    const user = await User.find({ where: { email } })

    if (user) return res.render('admin/users/create', {
        error: 'Email já registrado',
        items: req.body
    })

    if (password != password_repeat)
        return res.render('admin/users/create', {
            error: 'Senhas não coincidem',
            items: req.body
        })

    return next()
}

const update = async (req, res, next) => {
    const pageContent = checkCompletion(req.body)

    const { password } = req.body
    const id = req.session.user_id

    if (!password) return res.render('admin/users/profile', {
        error: 'Insira sua senha para atualizar seus dados',
        items: req.body
    })

    if (!pageContent) return res.render('admin/users/profile', {
        error: 'Por favor preencha todos os campos',
        items: req.body
    })

    const user = await User.find({ where: { id } })

    const passed = await compare(password, user.password)

    if (!passed) return res.render('admin/users/profile', {
        error: 'Senha incorreta',
        items: req.body
    })

    req.user = user

    return next()
}

const put = async (req, res, next) => {
    const pageContent = checkCompletion(req.body)

    if (!pageContent) return res.render('admin/users/profile', {
        error: 'Por favor preencha todos os campos',
        items: req.body
    })

    return next()
}
const deleting = async (req, res, next) => {
    if (req.session.user_id == req.params.id) {
        req.session.error = 'Não é possível deletar seu próprio usuário'
        return res.redirect('/admin/users')
    }

    next()
}


module.exports = { show, update, post, put, deleting }