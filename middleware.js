const express = require('express')

const { topologise, isPangoLineage } = require('pango-utils')

const MAX_LINEAGES = parseInt(process.env.COVINCE_MAX_LINEAGES) || 12

const validateLineages = lineages =>
  Array.isArray(lineages) &&
  lineages.length <= MAX_LINEAGES &&
  lineages.every(l => {
    if (typeof l !== 'string') return false
    return isPangoLineage(l)
  })

module.exports = function (knex) {
  if (!knex) {
    throw new Error('knex instance not provided.')
  }

  const router = express.Router()

  router.get('/info', async (req, res, next) => {
    try {
      const [[lastUpdated], dates, areas] = await Promise.all([
        knex('last_updated').select('timestamp').where({ id: 0 }),
        knex('aggregated').distinct('date').orderBy('date'),
        knex('aggregated').distinct('area')
      ])
      res.json({
        lastModified: parseInt(lastUpdated.timestamp),
        dates: dates.map(_ => _.date),
        areas: areas.map(_ => _.area),
        maxLineages: parseInt(MAX_LINEAGES)
      })
    } catch (e) {
      next(e)
    }
  })

  router.get('/lineages', async (req, res, next) => {
    try {
      const { area, from, to } = req.query
      const query = knex('aggregated')
        .select('pango_clade', 'lineage')
        .sum('count')
        .groupBy('pango_clade', 'lineage')
        .orderBy('pango_clade')
        .where('count', '>', 0)
      if (area && area !== 'overview') query.where('area', area)
      if (from) query.where('date', '>=', from)
      if (to) query.where('date', '<=', to)
      const result = await query // .debug()
      res.json(result)
    } catch (e) {
      next(e)
    }
  })

  const addUnionClauses = (context, node) => {
    const { query, area } = context
    const clause = knex
      .select(knex.raw('? as key, date', node.name))
      .sum('period_count')
      .from('aggregated')
      .where('pango_clade', 'like', `${node.name}.%`)
    if (area) clause.where('area', area)
    for (const child of node.children) {
      clause.whereNot(function () {
        this.where('pango_clade', 'like', `${child.name}.%`)
      })
      // TODO: conditionalise this to stop early if mutual parent node
      addUnionClauses(context, child)
    }
    clause.groupBy('date')
    query.union(clause, true)
  }

  router.get('/frequency', async (req, res, next) => {
    const { lineages: lineageList, area } = req.query
    const lineages = lineageList ? lineageList.split(',') : []

    if (!validateLineages(lineages)) {
      return res.status(400).send('Invalid lineages')
    }

    const tree = topologise(lineages)
    const query = knex.select(knex.raw('null as key, null as date, null as period_count')).from('aggregated').whereRaw('1 = 0')
    for (const root of tree) {
      addUnionClauses({ query, area }, root)
    }
    const result = await query.orderBy('date') // .debug()
    res.json(result)
  })

  router.get('/spatiotemporal/total', async (req, res, next) => {
    const { lineages: lineageList } = req.query
    const lineages = lineageList ? lineageList.split(',') : []

    if (!validateLineages(lineages)) {
      return res.status(400).send('Invalid lineages')
    }

    const query =
      knex.select(['area', 'date'])
        .sum('period_count')
        .from('aggregated')
        .groupBy('area', 'date')
        .where(1, '=', 0)

    for (const lineage of lineages) {
      query.orWhere('pango_clade', 'like', `${lineage}.%`)
    }

    const result = await query.orderBy('date')
    res.json(result)
  })

  router.get('/spatiotemporal/lineage', async (req, res, next) => {
    const { lineage, excluding: excludingList } = req.query
    const excluding = excludingList ? excludingList.split(',') : []

    if (!isPangoLineage(lineage)) {
      return res.status(400).send('Invalid lineages')
    }
    if (excluding.length && !excluding.every(isPangoLineage)) {
      return res.status(400).send('Invalid lineages')
    }

    const query = knex
      .select(['area', 'date'])
      .sum('period_count')
      .from('aggregated')
      .where('pango_clade', 'like', `${lineage}.%`)
    for (const l of excluding) {
      query.whereNot('pango_clade', 'like', `${l}.%`)
    }
    query.groupBy('area', 'date')

    const result = await query.orderBy('date')
    res.json(result)
  })

  return router
}
