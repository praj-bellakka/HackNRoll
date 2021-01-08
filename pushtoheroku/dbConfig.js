const dbEngine = process.env.DB_ENVIRONMENT || 'development'; //set DB_ENVIRONMENT only in heroku 
const config = require('./knexfile')[dbEngine]; //dbEngine will either be development or production

const knex = require('knex');
module.exports = knex(config);