const knex = require('knex')
const { types } = require('pg')
const { builtins } = require('pg-types')
const knexfile = require('./knexfile')

types.setTypeParser(builtins.DATE, _ => _)

const env = process.env.NODE_ENV || 'development'
const configOptions = knexfile[env]

module.exports = knex(configOptions)
