const { Pool } = require('pg');

const path = require('path');
require('dotenv').config({
    override: true,
    path: path.join(__dirname, "development.env")
});

const pool = new Pool({
    user: process.env.USER,
    host: process.env.HOST,
    database: "postgres",
    password: process.env.PASSWORD,
    port: process.env.PORT
})

module.exports = pool