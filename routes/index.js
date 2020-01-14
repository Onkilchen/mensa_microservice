// This file loads all the other router files and its the only file the application has to load at startup
const express = require('express')
const router = express.Router()

/**
 * register the routes here and export them for use in other components
 */
router.use('/meals', require('./meals'))
router.use('/swagger', require('./swagger'))

module.exports = router
