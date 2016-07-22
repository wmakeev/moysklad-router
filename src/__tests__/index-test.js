'use strict'

const test = require('blue-tape')
const sinon = require('sinon')
const Router = require('../index')

const setup = () => {
  global.window = {
    location: {
      protocol: 'https:',
      hostname: 'online.moysklad.ru',
      pathname: '/app/'
    },
    onhashchange: {},
    addEventListener: sinon.spy(),
    removeEventListener: sinon.spy()
  }

  global.history = {
    replaceState: sinon.spy()
  }

  return { router: Router() }
}

const teardown = () => {
  delete global.window
}

test('moysklad-router', t => {
  t.equal(typeof Router, 'function', 'to be function')
  t.end()
})

test('moysklad-router instance', t => {
  let router = Router()
  t.ok(router, 'is defined')
  t.equal(router.state, null, 'state is null')
  t.end()
})

test('moysklad-router instance have methods', t => {
  let router = Router()
  let methods = [
    'start', 'stop', 'checkUrl', 'navigate', 'replaceState', 'refresh', 'getState',
    'getPath', 'getSection', 'getAction', 'getQuery', 'on', 'off'
  ]
  methods.forEach(m => t.equal(typeof router[m], 'function', `method "${m}"`))
  t.ok(router.VERSION, 'field VERSION')
  t.end()
})

test('moysklad-router start throw error if no window.hashchange', t => {
  let router = setup().router
  t.throws(router.start.bind(this.router), 'The browser not supports the hashchange event')
  teardown()
  t.end()
})
