const db = require('../app/config/db')

const base = {
    init({ table }) {
        if (!table) throw new Error('Invalid params')

        this.table = table
    },
    async find(id) {
        try {
            let results = await db.query(`SELECT * FROM ${this.table} WHERE id = $1`, [id])
            return results.rows
        } catch (err) { console.log(err) }
    },
    async all(organize) {
        let results = await db.query(`SELECT * FROM ${this.table} ${organize}`)
        return results.rows
    },
    async create(fields) {
        try {
            let keys = [], values = []
            Object.keys(fields).map(key => {
                keys.push(key)
                values.push(`'${fields[key]}'`)
            })

            const query = `INSERT INTO ${this.table} (${keys.join(',')})
             VALUES(${values.join(',')})
             RETURNING id`

            const results = await db.query(query)
            return results.rows[0].id
        } catch (err) {
            console.log(err)
        }
    },
    update(fields, id) {
        try {
            let holder = '',
                values = [],
                update = []

            Object.keys(fields).map((key, index, array) => {
                if (index < array.length) {
                    holder = `$${index + 1}`
                }
                values.push(fields[key])

                let line = `${key} = (${holder})`
                update.push(line)
            })

            let query = `UPDATE ${this.table} SET
        ${update.join(",")} WHERE id = ${id}`

            return db.query(query, values)
        } catch (err) {
            console.log(err)
        }
    },
    async delete(id) {
        try {
            return db.query(`DELETE FROM ${this.table} WHERE id = $1`, [id])
        } catch (err) {
            console.log(err)
        }
    },
    async deleteBy(id, type) {
        try {
            let results = await db.query(`DELETE FROM ${this.table} WHERE ${type} = $1 RETURNING file_id`, [id])
            return results.rows
        } catch (err) { console.log(err) }
    },
    async findBy(id, type) {
        try {
            let results = await db.query(`SELECT * FROM ${this.table} WHERE ${type} = $1`, [id])
            return results.rows
        } catch (err) { console.log(err) }
    },
}

module.exports = base