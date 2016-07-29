'use strict'

const test = require('blue-tape')
const cases = require('./url-test-cases')
const parseHash = require('../parse-hash')

test('parse-hash', assert => {
  assert.ok(parseHash)
  assert.ok(typeof parseHash === 'function', 'should be function')
  assert.end()
})

test('parse-hash parse moysklad urls', assert => {
  cases.forEach((caseItem, caseIndex) => {
    var urls = caseItem.urls || [caseItem.url]
    urls.forEach((url, urlIndex) => {
      assert.deepEqual(parseHash(url), caseItem.result, `case#${caseIndex}-${urlIndex} pass`)
    })
  })
  assert.end()
})
