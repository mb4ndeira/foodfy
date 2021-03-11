const db = require('../app/config/db')

const base = require('./Base')
base.init({ table: 'recipe_files' })

module.exports = {
    ...base,
    allRecipe_files(id) {
        try {
            return db.query(`SELECT recipe_files.* ,(SELECT path FROM files WHERE id = recipe_files.file_id) 
            FROM recipe_files 
            LEFT JOIN files ON (recipe_files.file_id=files.id)
            WHERE recipe_id = $1
            ORDER BY id
            `, [id])
        } catch (err) { console.log(err) }
    }
}