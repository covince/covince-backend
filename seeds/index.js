const fs = require('fs')
const mapTsvToRecords = require('../mapTsvToRecords')

exports.seed = async function (knex) {
  const text = fs.readFileSync('./input.tsv', 'utf8')

  const records = mapTsvToRecords(text)
  console.log('Mapped', records.length, 'records, inserting ...')
  await knex('aggregated').del()
  await knex.batchInsert('aggregated', records)

  await knex('last_updated').insert({ id: 0, timestamp: Date.now() }).onConflict('id').merge()
}
