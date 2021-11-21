const fs = require('fs')
const mapTsvToRecords = require('./mapTsvToRecords')

const filename = process.argv[2] || './input.tsv'
const text = fs.readFileSync(filename, 'utf8')

// parse file

fs.open('./02-data.sql', 'w', (err, fd) => {
  if (err) throw err

  fs.writeSync(fd, `
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

\\connect covince

COPY public.last_updated (id, "timestamp") FROM stdin;
0\t${Date.now()}
\\.
`)

  fs.writeSync(fd, `
COPY public.aggregated (id, ltla, lineage, pango_clade, date, count, period_count) FROM stdin;
`)
  // map rows
  const records = mapTsvToRecords(text)
  for (let i = 0; i < records.length; i++) {
    const record = records[i]
    fs.writeSync(fd, [
      i + 1,
      record.ltla,
      record.lineage,
      record.pango_clade,
      record.date,
      record.count,
      record.twoweek,
      record.average
    ].join('\t'))
    fs.writeSync(fd, '\n')
  }

  fs.writeSync(fd, '\\.\n')

  fs.writeSync(fd, `
SELECT pg_catalog.setval('public.last_updated_id_seq', 1, false);
SELECT pg_catalog.setval('public.aggregated_id_seq', ${records.length}, true);
`)
})
