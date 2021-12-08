const fs = require('fs')
const mapCsvToRecords = require('../mapCsvToRecords')

exports.seed = async function (knex) {
  const text = fs.readFileSync('./input.csv', 'utf8')

  const records = mapCsvToRecords(text)

  console.log('Mapped', records.length, 'records, inserting ...')
  await knex('aggregated').del()
  await knex.batchInsert('aggregated', records)

  await knex('last_updated').insert({ id: 0, timestamp: Date.now() }).onConflict('id').merge()
}
