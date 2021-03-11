const db = require('../app/config/db')

const base = require('../models/Base')
base.init({ table: 'chefs' })

module.exports = {
    ...base,
    allChefs() {
        return db.query(`
        SELECT chefs.*, (SELECT path FROM files WHERE id = chefs.file_id)
        FROM chefs
        LEFT JOIN files ON (chefs.file_id=files.id)
        ORDER BY id`
        )
    },

    async findChef(id) {
        try {
            let recipes = []
            let results = await db.query(`SELECT recipes.* FROM recipes WHERE chef_id=$1 ORDER BY created_at DESC`, [id])
            recipes = results.rows

            results = await db.query(`SELECT chefs.*, count(recipes) AS count 
            FROM chefs
            LEFT JOIN recipes ON (chefs.id=recipes.chef_id) 
            WHERE chefs.id= $1
            GROUP BY chefs.id`, [id])
            const count = results.rows[0].count

            return ({ items: results.rows[0], count, recipes })
        } catch (err) { console.log(err) }
    },
    async chefsList(callback) {
        let results = await db.query(`SELECT id, name FROM chefs`)
        return (results.rows)
    }
}