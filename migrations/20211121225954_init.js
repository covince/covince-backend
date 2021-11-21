
exports.up = async function (knex) {
  await knex.schema.createTable('last_updated', tbl => {
    tbl.increments()
    tbl.bigInteger('timestamp')
  })

  await knex.schema.createTable('aggregated', tbl => {
    tbl.increments()
    tbl.text('area', 24)
    tbl.index('area')
    tbl.text('lineage', 24)
    tbl.index('lineage')
    tbl.text('pango_clade', 48)
    tbl.index('pango_clade')
    tbl.date('date')
    tbl.index('date')
    tbl.float('count')
    tbl.index('count')
    tbl.float('period_count')
    tbl.index('period_count')
  })
}

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('last_updated')
  await knex.schema.dropTableIfExists('aggregated')
}
