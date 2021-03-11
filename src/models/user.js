const db = require('../app/config/db')

const base = require('../models/Base')
base.init({ table: 'users' })

module.exports = {
    ...base,
    async findUsers(filters) {
        try {
            let query = `SELECT * FROM users`

            Object.keys(filters).map(key => {
                query = `${query} ${key}`

                Object.keys(filters[key]).map(field => {
                    query = `${query} ${field} = '${filters[key][field]}' `
                })
            })


            let results = await db.query(query)

            return results.rows[0]

        } catch (err) { console.log(err) }
    }
}