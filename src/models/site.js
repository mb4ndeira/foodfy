const db = require('../app/config/db')

module.exports = {
    async allRecipes(home) {
        try {
            let results = await db.query(`SELECT chefs.name,chefs.id FROM chefs`)
            let chefs = results.rows

            let query = `SELECT * FROM recipes ORDER BY created_at DESC`
            if (home) query += ` LIMIT 6`

            results = await db.query(query)
            results = results.rows
            results = { results, chefs }

            return (results)
        } catch (err) { console.log(err) }
    },
    allChefs() {
        try {
            return db.query(`SELECT chefs.*,count(recipes) AS count 
        FROM chefs 
        LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
        GROUP BY chefs.id`
            )
        } catch (err) { console.log(err) }

    },
    find(id) {
        try {
            return db.query(`SELECT recipes.*, (SELECT name FROM chefs WHERE id = recipes.chef_id )
        FROM recipes
        LEFT JOIN chefs ON (recipes.chef_id=chefs.id)
        WHERE recipes.id= $1 `, [id])
        } catch (err) {
            console.log(err)
        }
    },
    async search(search) {
        try {
            let results = await db.query(`SELECT chefs.name,chefs.id FROM chefs`)
            let chefs = results.rows

            results = await db.query(`SELECT *
            FROM recipes
            WHERE recipes.title ILIKE '%${search}%'
            OR recipes.ingredients ILIKE '%${search}%'
            GROUP BY recipes.id
            ORDER BY recipes.title DESC, updated_at DESC`)
            results = results.rows

            results = { results, chefs, search }

            return (results)
        } catch (err) { console.log(err) }

    }
}