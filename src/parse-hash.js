'use strict'

// https://regex101.com/r/uV6yS6/2
const routeRegex = /#(?:([\w-]+)(?:\/(\w+))?(?:\?(.+))?)?/

const parseQueryString = require('./parse-query-string')

module.exports = function parseHash (hash) {
  let match = routeRegex.exec(hash)
  if (match && match.length) {
    return {
      path: match[1] + (match[2] ? '/' + match[2] : ''),
      query: parseQueryString(match[3])
    }
  } else {
    return {
      path: null,
      query: {}
    }
  }
}
