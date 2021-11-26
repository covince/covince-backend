const { isPangoLineage, expandLineage } = require('pango-utils')

module.exports = (text) => {
  const records = []
  const rows = text.split('\n').slice(1)
  for (const row of rows) {
    const [lineage, date, country, count, period_count] = row.split(',')
    if (isPangoLineage(lineage)) {
      records.push({
        lineage,
        date,
        area: country,
        count,
        period_count,
        pango_clade: `${expandLineage(lineage)}.`
      })
    }
  }
  return records
}
