'use strict'

const url = require('url')
const test = require('blue-tape')
const cases = require('./url-test-cases')

const buildUrl = require('../build-url')
const parseQueryString = require('../parse-query-string')

const setup = () => {
  global.window = {
    location: {
      protocol: 'https:',
      hostname: 'online.moysklad.ru',
      pathname: '/app/'
    }
  }
}

const teardown = () => {
  delete global.window
  delete global.history
}

test('build-url', assert => {
  assert.ok(buildUrl)
  assert.ok(typeof buildUrl === 'function', 'should be function')
  // TODO assert.ok(buildUrl({}) === ?, 'should return ..')
  // TODO assert.ok(buildUrl(void 0) === ?, 'should return ..')
  assert.end()
})

test('build-url build moysklad urls', assert => {
  cases.forEach((caseItem, caseIndex) => {
    assert.comment(`- case#${caseIndex}`)

    let expectedUrl = url.parse(caseItem.urls ? caseItem.urls[0] : caseItem.url, true)
    let state = caseItem.result

    setup()

    window.location.protocol = expectedUrl.protocol
    window.location.hostname = expectedUrl.hostname
    window.location.pathname = expectedUrl.pathname

    let buildedUrl = buildUrl(state)
    let actualUrl = url.parse(buildedUrl, true)

    assert.equal(actualUrl.host, expectedUrl.host)
    assert.equal(actualUrl.pathname, expectedUrl.pathname)
    assert.deepLooseEqual(actualUrl.query || {}, expectedUrl.query || {})

    let expectedHash = (expectedUrl.hash || '').substring(1)
    expectedHash = parseQueryString(expectedHash.substring(expectedHash.indexOf('?') + 1))

    let actualHash = (actualUrl.hash || '').substring(1)
    actualHash = parseQueryString(actualHash.substring(actualHash.indexOf('?') + 1))

    assert.deepEqual(actualHash, expectedHash)

    teardown()
  })

  assert.end()
})
