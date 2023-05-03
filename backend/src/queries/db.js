require("dotenv").config();
const {Pool} = require('pg')
const dbConnectionString = process.env.DB_URL

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
})

console.log("DB PASSWORD:", process.env.DB_PASSWORD)
const query = (queryString, parameters, callback) => {
    return pool.query(queryString, parameters, callback)
}

module.exports = {query}