const Recipes = require('../../models/recipe')

const isMine = async (req, res, next) => {
    let results = await Recipes.find(req.params.index)

    if (!req.session.admin)
        if (results.rows[0].user_id != req.session.user_id) {
            req.session.error = 'Acesso negado'
            return res.redirect('/login')
        }

    next()
}

module.exports = { isMine }