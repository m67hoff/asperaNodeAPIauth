#!/usr/bin/env node
'use strict'

const log = require('npmlog')
const packagejson = require('./package.json')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const helmet = require('helmet')

const pam = require('authenticate-pam')

var LOGLEVEL = 'verbose'
var PORT = 5555

log.level = LOGLEVEL

log.notice('main', 'Moin Moin from nodeAPIauth v' + packagejson.version)

app.use(helmet())
app.use(bodyParser.json())

// start http server listen only on localhost
app.listen(PORT, 'localhost', function() {
  log.http('express', 'server starting on ' + PORT)
})

// logger for all requests
app.use(function(req, res, next) {
  log.silly('express', 'log method ' + req.method + ' ' + req.originalUrl)
  log.silly('express', 'log headers ', req.headers)
  log.silly('express', 'log body ', json2s(req.body))
  next()
})

app.post('/', doNodeAPIAuth)

async function doNodeAPIAuth(req, res) {
  log.verbose('NodeAPIAuth', '---> new auth request')
  var userName = req.body.user_name
  var secret = req.body.secret
  var isAuthorized = false
  log.verbose('NodeAPIAuth', 'user/pw: ', userName, secret)

  // isAuthorized = true   // always ok

  isAuthorized = await pamAuthAsync(userName, secret)
  log.silly('NodeAPIAuth', 'isAuthorized: ', isAuthorized)

  if (isAuthorized === true) {
    log.info('NodeAPIAuth', 'User: ' + userName + ' - authenticated')
    res.status(200).send({ 'key': '200:user is authorized' })
  } else {
    log.info('NodeAPIAuth', 'User: ' + userName + ' - auth failed')
    res.status(401).send({ 'key': '401:user is not authorized' })
  }
}

function pamAuthAsync(userid, password) {
  log.silly('pam', 'start pam auth')

  return new Promise(resolve => {
    pam.authenticate(userid, password,
      (err) => {
        if (err) {
          log.info('pam', 'user: ' + userid + ' error: ', err)
          resolve(false)
        } else {
          log.verbose('pam', 'success')
          resolve(true)
        }
      },
      { serviceName: 'sshd', remoteHost: 'localhost' }
    )
  })
}

function json2s(obj) { return JSON.stringify(obj, null, 2) } // format JSON payload for log
