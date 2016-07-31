'use strict'

/* eslint no-shadow: ["warn", { "builtinGlobals": true, "allow": ["stop"] }] */

const parseHash = require('./parse-hash')
const buildCurrentUrl = require('./build-url')
const EventEmitter = require('event-emitter')
const cloneDeep = require('lodash.clonedeep')
const have = require('have')

const navigateArgsMap = [
  { state: 'obj', isPatch: 'opt bool' },
  { path: 'str', uuid: 'str', isPatch: 'opt bool' },
  { path: 'str', query: 'opt obj', isPatch: 'opt bool' }
]

function deepAssignCustomizer (objectValue, sourceValue) {
  if (sourceValue === void 0) return objectValue
  else if (
    (typeof objectValue === 'object' && !(objectValue instanceof Array)) &&
    (typeof sourceValue === 'object' && !(sourceValue instanceof Array))
    ) return Object.assign(objectValue, sourceValue, deepAssignCustomizer)
  else return sourceValue
}

function updateState (newState, oldState, isMod) {
  if (isMod && oldState) return Object.assign(oldState, newState, deepAssignCustomizer)
  else return newState
}

function getStateByNavigateArgs (args) {
  let state = {}
  if (args.path) {
    state.path = args.path
    if (args.uuid) {
      state.query = { id: args.uuid }
    } else if (args.query) {
      state.query = args.query
    }
  } else if (args.state) {
    state = args.state
  } else {
    throw new Error('Incorrect navigate arguments')
  }
  return state
}

function ensureStarted (router) {
  if (!router.started) throw new Error('Роутер не запущен. Используйте router.start()')
}

function start () {
  if (window && 'onhashchange' in window) {
    window.addEventListener('hashchange', this.checkUrl, false)
    this.started = true
    this.checkUrl()
    this.emit('start', this)
  } else throw new Error('The browser not supports the hashchange event!')
  return this
}

function stop () {
  window.removeEventListener('hashchange', this.checkUrl)
  this.started = false
  this.state = null
  this.emit('stop', this)
  return this
}

function checkUrl () {
  this.state = parseHash(window.location.hash)
  this.emit('route', cloneDeep(this.state), this)
}

function navigate () {
  ensureStarted(this)
  let args = have.strict(arguments, navigateArgsMap)
  let state = getStateByNavigateArgs(args)
  let newState = updateState(cloneDeep(state), this.getState(), args.isPatch)
  window.location = buildCurrentUrl(newState)
  return this
}

function replaceState () {
  ensureStarted(this)
  let args = have.strict(arguments, navigateArgsMap)
  let state = getStateByNavigateArgs(args)
  let newState = updateState(cloneDeep(state), this.getState(), args.isPatch)
  history.replaceState(null, null, buildCurrentUrl(newState))
  return this
}

function buildUrl () {
  let args = have.strict(arguments, [
    { state: 'obj' },
    { path: 'str', uuid: 'str' },
    { path: 'str', query: 'opt obj' }
  ])
  let state = getStateByNavigateArgs(args)
  return buildCurrentUrl(state)
}

function refresh () {
  // TODO Restore window.scroll after refresh
  this.replaceState({
    query: {
      refresh: +(new Date())
    }
  }, true)
  return this
}

function getState () {
  ensureStarted(this)
  return cloneDeep(this.state)
}

function getPath () {
  ensureStarted(this)
  return this.state.path
}

function getQuery () {
  ensureStarted(this)
  return this.getState().query
}

function getSection () {
  ensureStarted(this)
  return this.state.path.split('/')[0]
}

function getAction () {
  ensureStarted(this)
  return this.state.path.split('/')[1]
}

/**
 * Creates new router
 * @constructor
 */
function moyskladRouter () {
  let router = function () {
    router.navigate.apply(router, arguments)
  }

  router.VERSION = '/** router.VERSION **/'

  EventEmitter(router)

  router.checkUrl = checkUrl.bind(router)
  router.start = start
  router.stop = stop
  router.navigate = navigate
  router.replaceState = replaceState
  router.refresh = refresh
  router.getState = getState
  router.getPath = getPath
  router.getSection = getSection
  router.getAction = getAction
  router.getQuery = getQuery
  router.state = null

  return router
}

moyskladRouter.buildUrl = buildUrl

module.exports = moyskladRouter
