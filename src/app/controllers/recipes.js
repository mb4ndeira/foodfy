const Recipes = require('../../models/recipe')
const File = require('../../models/file')
const Chef = require('../../models/chef')
const Recipe_file = require('../../models/recipe_file')
const { convertToArray, checkCompletion, fixComma, getImages_show, getImages_recipes } = require('../../lib/useful')


module.exports = {
    async index(req, res) {
        const sucess = req.session.sucess
        req.session.sucess = false

        const error = req.session.error
        req.session.error = false

        try {
            const items = await Recipes.all('ORDER BY created_at DESC')

            const images = await getImages_recipes(items, req.protocol, req.headers.host, Recipe_file)
            const chefs = await Chef.all()

            return res.render('admin/recipes/list', { items, images, chefs, sucess, error })
        } catch (err) {
            console.log(err)
        }

    },
    async show(req, res) {
        const index = Number(req.params.index)
        if (Number.isNaN(index)) {
            console.log(err)
            req.session.error = 'Receita não encontrada'
            return res.redirect('/admin/recipes')
        }

        try {
            let items = await Recipes.findRecipe(index)
            items = items[0]
            items.ingredients = convertToArray(items.ingredients)
            items.preparation = convertToArray(items.preparation)

            let recipe_files = await Recipe_file.findBy(items.id, 'recipe_id')
            const files_id = []

            recipe_files.forEach(file => files_id.push(file.file_id))
            let images = await getImages_show(files_id, req.protocol, req.headers.host, File)

            return res.render('admin/recipes/show', { items, images })
        } catch (err) {
            console.log(err)
            req.session.error = 'Não foi possível carregar receita'
            return res.redirect('/admin/recipes')
        }
    },
    async edit(req, res) {
        const index = Number(req.params.index)
        if (Number.isNaN(index)) {
            console.log(err)
            req.session.error = 'Receita não encontrada'
            return res.redirect('/admin/recipes')
        }

        const error = req.session.error
        req.session.error = false

        try {
            let recipe = await Recipes.find(index)
            recipe = recipe[0]

            recipe.ingredients = convertToArray(recipe.ingredients)
            recipe.preparation = convertToArray(recipe.preparation)

            const chefs = await Chef.all()

            let recipe_files = await Recipe_file.findBy(index, 'recipe_id')
            const images_id = []
            recipe_files.forEach(file => images_id.push(file.file_id))

            let promises = images_id.map(id => File.find(id))
            results = await Promise.all(promises)
            let images = []
            results.forEach(result => images.push(result))
            images = images[0]

            images.forEach(image => {
                if (image.path.includes('https://')) {
                    image.src = `${image.path}`
                } else {
                    image.src = `${req.protocol}://${req.headers.host}/${image.path}`
                }
            })


            return res.render('admin/recipes/edit', { items: recipe, chefs, images, previous: images_id, error })
        } catch (err) {
            console.log(err)
            req.session.error = 'Não foi possível carregar receita'
            return res.redirect('/admin/recipes')
        }
    },
    async create(req, res) {
        const error = req.session.error
        req.session.error = false

        const chefs = await Chef.chefsList()

        return res.render('admin/recipes/create', { chefs, error })
    },
    async post(req, res) {
        let pagecontent = checkCompletion(req.body)

        if (!pagecontent) {
            console.log(err)
            return res.render('admin/recipes/edit', {
                error: 'Por favor, preencha todos os campos',
                items:req.body
            })
        }

        try {
            req.body = { ...req.body, user_id: req.session.user_id }

            if (req.files.length == 0) {
                return res.render('admin/recipes/create', { error: 'Envie pelo menos uma imagem', items: req.body })
            }

            const recipe_id = await Recipes.create({
                chef_id: req.body.chef_id,
                title: req.body.title,
                ingredients: req.body.ingredients,
                preparation: req.body.preparation,
                information: req.body.information,
                user_id: req.body.user_id
            })

            let promises = req.files.map(image => File.create({ name: image.filename, path: image.path }))
            results = await Promise.all(promises)

            const files_ids = []
            results.forEach(result => files_ids.push(result))

            promises = files_ids.map(id => Recipe_file.create({ recipe_id, file_id: id }))
            await Promise.all(promises)

            req.session.sucess = 'Receita adicionada'
            return res.redirect("/admin")
        } catch (err) {
            console.log(err)
            req.session.error = 'Ocorreu um erro, tente novamente'
            return res.redirect('/admin/recipes/create')
        }
    },
    async put(req, res) {
        const pagecontent = checkCompletion(req.body)

        if (!pagecontent) {
            console.log(err)
            return res.render('admin/recipes/edit', {
                error: 'Por favor, preencha todos os campos',
            })
        }

        console.log(req.body)
        try {
            await Recipes.update({
                chef_id: Number(req.body.chef_id),
                title: req.body.title,
                ingredients: req.body.ingredients,
                preparation: req.body.preparation,
                information: req.body.information,
            }, req.body.id)

            if (req.files) {
                let promises = req.files.map(image => File.create({ name: image.filename, path: image.path }))
                let results = await Promise.all(promises)

                const files_ids = []
                results.forEach(result => files_ids.push(result))

                promises = files_ids.map(id => Recipe_file.create({ recipe_id: req.body.id, file_id: id }))
                await Promise.all(promises)
            }

            if (req.body.removed_files) {
                const removedFiles = fixComma(req.body.removed_files)
                let promises = removedFiles.map(id => Recipe_file.deleteBy(id, 'file_id'))
                await Promise.all(promises)

                promises = removedFiles.map(id => File.delete(id))
                await Promise.all(promises)
            }

            req.session.sucess = 'Receita atualizada'
            return res.redirect('/admin')
        } catch (err) {
            console.log(err)
            req.session.error = 'Ocorreu um erro, tente novamente'
            return res.redirect(`/admin/recipes/${req.body.id}/edit`)
        }
    },
    async delete(req, res) {
        try {
            let results = await Recipe_file.deleteBy(req.body.id, 'recipe_id')
            const files_id = []
            results.forEach(result => {
                files_id.push(result.file_id)
            })

            let promises = files_id.map(id => File.delete(id))
            await Promise.all(promises)

            await Recipes.delete(req.body.id)

            return res.render('admin/deleted', {
                thing: 'Receita', action: 'deletada'
            })
        } catch (err) {
            console.log(err)
        }
    }
}