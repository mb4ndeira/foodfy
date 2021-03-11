const fs = require('fs')
const db = require('../app/config/db')

const base = require('./Base')
base.init({ table: 'files' })

module.exports = {
    ...base,
    check(name) {
        return db.query(`SELECT * FROM files WHERE name = $1`, [name])
    }
}