module.exports = {
    admin(req, res) {
        return res.redirect('admin/recipes')
    },
    create(req, res) {
        return res.redirect('admin/recipes/create')
    }
}