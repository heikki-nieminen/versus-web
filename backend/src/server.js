const express = require('express')
const router = require('./routes/router')

const server = express()
server.use("/", router)

module.exports = server