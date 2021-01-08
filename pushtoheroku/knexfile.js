// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
      filename: './data/animalgamationLocal.db3'
    },
   pool: {
     afterCreate: (conn, done) => {
       conn.run("PRAGMA foreign_keys = ON", done);
     }
   } 
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL, //get this from heroku env variables in settings
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tablename: 'knex_migrations',
      directory: './migrations'
    } 

  }
};
