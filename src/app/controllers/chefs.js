const fs = require('fs')
const Chef = require('../../models/chef')
const File = require('../../models/file')
const Recipe_file = require('../../models/recipe_file')
const { checkCompletion, getImages_show, getImages_recipes } = require('../../lib/useful')


module.exports = {
    async index(req, res) {
        try {
            const sucess = req.session.sucess
            req.session.sucess = false

            const error = req.session.error
            req.session.error = false

            let results = await Chef.allChefs()
            let items = results.rows

            items.forEach(item => {
                if (item.path.includes('https://')) {
                    item.src = `${item.path}`
                } else {
                    item.src = `${req.protocol}://${req.headers.host}/${item.path}`
                }
            })

            return res.render('admin/chefs/list', { items, sucess })
        } catch (err) {
            console.log(err)
        }
    },
    create(req, res) {
        return res.render('admin/chefs/create')
    },
    async show(req, res) {
        req.params.index = Number(req.params.index)
        if (Number.isNaN(req.params.index)) {
            req.session.error = 'Chef não encontrado'
            return res.redirect('/admin/chefs')
        }

        try {
            results = await Chef.findChef(req.params.index)
            const { items, recipes, count } = results

            const avatar = await getImages_show(items.file_id, req.protocol, req.headers.host, File)
            const images = await getImages_recipes(recipes, req.protocol, req.headers.host, Recipe_file)

            return res.render('admin/chefs/show', { items, count, recipes, avatar, images })
        } catch (err) {
            console.log(err)
            req.session.error = 'Erro ao carregar chef'
            return res.redirect('/admin/chefs')
        }
    },
    async edit(req, res) {
        req.params.index = Number(req.params.index)
        if (Number.isNaN(req.params.index)) {
            req.session.error = 'Chef não encontrado'
            return res.redirect('/admin/chefs')
        }

        const error = req.session.error
        req.session.error = false

        try {
            let results = await Chef.findChef(req.params.index)
            const { items } = results

            const image = await getImages_show(items.file_id, req.protocol, req.headers.host, File)
            return res.render('admin/chefs/edit', { items, image, edit: true, error })
        } catch (err) {
            console.log(err)
            req.session.error = 'Erro ao carregar chef'
            return res.redirect('/admin/chefs')
        }
    },
    async post(req, res) {
        const pagecontent = checkCompletion(req.body)

        if (!pagecontent) {
            console.log(err)
            return res.render('admin/chefs/create', {
                error: 'Por favor, preencha todos os campos',
            })
        }

        try {
            const file = req.files[0]
            const file_id = await File.create({ name: file.filename, path: file.path })

            // date(Date.now()).iso
            await Chef.create({ name: pagecontent.name, file_id })

            return res.render('admin/added', {
                thing: 'Chef', action: 'Adicionado'
            })
        } catch (err) {
            console.log(err)
            return res.render('admin/chefs/create', {
                error: 'Por favor, preencha todos os campos',
                items: req.body
            })
        }
    },
    async put(req, res) {
        let pagecontent = checkCompletion(req.body)

        if (!pagecontent) {
            console.log(err)
            return res.render('admin/chefs/edit', {
                error: 'Por favor, preencha todos os campos',
            })
        }

        try {
            if (req.files.length > 0) {
                let file = req.files[0]
                const file_id = await File.create({ name: file.filename, path: file.path })

                await Chef.update({ name: req.body.name, file_id: file_id }, req.body.id)

                file = await File.find(pagecontent.removed_file)

                if (!file[0].path.includes('https://')) await fs.unlinkSync(file[0].path)

                await File.delete(pagecontent.removed_file)
            } else {
                await Chef.update({ name: req.body.name }, req.body.id)
            }

            return res.render('admin/added', {
                thing: 'Chef', action: 'adicionado'
            })
        } catch (err) {
            console.log(err)
            req.session.error = 'Ocorreu um erro, tente novamente'
            return res.redirect(`/admin/chefs/${req.body.id}/edit`)
        }

    },
    async delete(req, res) {
        if (req.body.count != 0) {
            req.session.error = 'Ocorreu um erro, tente novamente'
            return res.redirect(`/admin/chefs/${req.body.id}/edit`)
        }

        try {
            await Chef.delete(req.body.id)
            await File.delete(req.body.file_id)
            
            return res.render('admin/deleted', {
                thing: 'Chef', action: 'deletado'
            })
        } catch (err) {
            console.log(err)
            req.session.error = 'Ocorreu um erro, tente novamente'
            return res.redirect(`/admin/chefs/${req.body.id}/edit`)
        }
    }
}

