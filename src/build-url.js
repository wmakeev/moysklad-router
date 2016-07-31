'use strict'

const buildQueryString = require('./build-query-string')

module.exports = function buildUrl ({ path, query }) {
  let url = [
    window.location.protocol + '//',
    window.location.hostname,
    window.location.pathname
    // TODO Query string?
  ].join('')

  if (path) {
    url += (url.slice(-1) === '/' ? '' : '/') + '#' + path
    let queryStr = buildQueryString(query, true)
    if (queryStr) url += '?' + queryStr
  }

  return url
}
