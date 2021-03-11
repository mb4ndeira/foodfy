const { convertToArray, getImages_recipes, getImages_show } = require('../../lib/useful')
const Site = require('../../models/site')
const Chef = require('../../models/chef')
const Recipe_file = require('../../models/recipe_file')
const File = require('../../models/file')

module.exports = {
    async home(req, res) {
        const error = req.session.error
        req.session.error = false

        try {
            const home = true

            let allRecipes = await Site.allRecipes(home)
            const { results: items, chefs } = allRecipes

            const images = await getImages_recipes(items, req.protocol, req.headers.host, Recipe_file)

            return res.render('site/index.njk', { items, chefs, images, error })
        } catch (err) {
            console.log(err)
        }
    },
    about(req, res) {
        return res.render('site/about')
    },
    async recipes(req, res) {
        try {
            let results = await Site.allRecipes()
            const { results: items, chefs } = results

            const images = await getImages_recipes(items, req.protocol, req.headers.host, Recipe_file)

            return res.render('site/recipes', { items, chefs, images })
        } catch (err) {
            console.log(err)
        }
    },
    async showRecipe(req, res) {
        const index = Number(req.params.index)
        if (Number.isNaN(index)) {
            console.log(err)
            req.session.error = 'Receita não encontrada'
            return res.redirect('/admin/recipes')
        }

        try {
            let results = await Site.find(index)
            let items = results.rows[0]
            items.ingredients = convertToArray(items.ingredients)
            items.preparation = convertToArray(items.preparation)

            results = await Recipe_file.find(items.id)
            const files_id = []

            results.rows.forEach(result => files_id.push(result.file_id))
            const images = await getImages_show(files_id, req.protocol, req.headers.host, File)

            return res.render('site/showRecipe', { items, images })
        } catch (err) {
            console.log(err)
            req.session.error = 'Não foi possível carregar receita'
            return res.redirect('/recipes')
        }
    },
    async showChef(req, res) {
        const index = Number(req.params.index)
        if (Number.isNaN(index)) {
            console.log(err)
            req.session.error = 'Chef não encontrado'
            return res.redirect('/chefs')
        }

        try {
            let results = await Chef.find(index)
            const { items, count, recipes } = results

            const avatar = await getImages_show(items.file_id, req.protocol, req.headers.host, File)
            const images = await getImages_recipes(recipes, req.protocol, req.headers.host, Recipe_file)

            return res.render('site/showChef', { items, count, recipes, avatar, images })
        } catch (err) {
            console.log(err)
            req.session.error = 'Não foi possível carregar chef'
            return res.redirect('/chefs')
        }
    },
    async chefs(req, res) {
        try {
            let results = await Site.allChefs()
            results = results.rows

            const files_id = []
            results.forEach(result => files_id.push(result.file_id))

            const avatars = await getImages_show(files_id, req.protocol, req.headers.host, File)

            return res.render('site/chefs', { items: results, avatars })
        } catch (err) {
            console.log(err)
        }
    },
    async post(req, res) {
        try {
            let results = await Site.search(req.body.search)

            const { results: items, chefs, search } = results

            const images = await getImages_recipes(items, req.protocol, req.headers.host, Recipe_file)

            return res.render('site/search', { items, chefs, search, images })
        } catch (err) {
            console.log(err)
            req.session.error = 'Erro ao pesquisar,tente novamente'
            return res.redirect('/')
        }
    }
}
