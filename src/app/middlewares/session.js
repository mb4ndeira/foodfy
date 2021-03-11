const logged = (req, res, next) => {
    if (!req.session.user_id)
        return res.redirect('/login')

    next()
}

const isAdmin = async (req, res, next) => {
    if (!req.session.admin) {
        req.session.error = 'Acesso negado'
        return res.redirect('/login')
    }

    next()
}

module.exports = { logged, isAdmin }