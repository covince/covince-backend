const { isPangoLineage, expandLineage } = require('pango-utils')

module.exports = (text) => {
  const rows = text.split('\n').slice(1)

  const data = {}
  for (const row of rows) {
    const [date, area, lineage, count] = row.split('\t')
    if (isPangoLineage(lineage)) {
      const record = { area, lineage, count: parseInt(count) }
      if (date in data) {
        data[date].push(record)
      } else {
        data[date] = [record]
      }
    }
  }
  const entries = Object.entries(data)
  entries.sort(([a], [b]) => {
    if (a > b) return 1
    if (a < b) return -1
    return 0
  })

  const records = []
  for (let i = 0; i < entries.length; i++) {
    const [date, _records] = entries[i]
    console.log(date, _records.length)
    for (const { area, lineage, count } of _records) {
      // handle sliding window
      if (entries[i + 1]) {
        const [, nextRecords] = entries[i + 1]
        const nextWeek = nextRecords.find(_ => _.area === area && _.lineage === lineage)
        if (!nextWeek) {
          nextRecords.push({ area, lineage, count: 0 })
        }
      }
      const previousWeek = i > 0 ? entries[i - 1][1].find(_ => _.area === area && _.lineage === lineage) : null
      const period_count = count + (previousWeek ? previousWeek.count : 0)

      if (period_count > 0) {
        records.push({
          date,
          area,
          lineage,
          count,
          period_count,
          pango_clade: `${expandLineage(lineage)}.`,
        })
      }
    }
  }
  return records
}
