const db = require('../app/config/db')

const base = require('../models/Base')
base.init({ table: 'recipes' })

module.exports = {
    ...base,
    async findRecipe(id) {
        try {
            let results = await db.query(`SELECT recipes.*, (SELECT name FROM chefs WHERE id = recipes.chef_id )
            FROM recipes
            LEFT JOIN chefs ON(recipes.chef_id=chefs.id)
            WHERE recipes.id= $1`, [id])
            return results.rows
        } catch (err) {
            console.log(err)
        }
    }
}