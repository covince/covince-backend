// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: {
      database: 'covince',
      user: 'postgres',
      password: 'password'
    },
    migrations: {
      directory: './migrations'
    },
    seeds: { directory: './seeds' }
  },

  production: {
    client: 'pg',
    connection: process.env.PG_URL,
    migrations: {
      directory: './migrations'
    },
    seeds: { directory: './seeds' }
  }

}
