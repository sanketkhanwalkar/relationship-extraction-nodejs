/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express    = require('express'),
  app          = express(),
  vcapServices = require('vcap_services'),
  extend       = require('util')._extend,
  watson       = require('watson-developer-cloud');

// Bootstrap application settings
require('./config/express')(app);

// if bluemix credentials exists, then override local
var credentials =  extend({
  url: '<url>',
  username: '<username>',
  password: '<password>',
  version: 'v1'
}, vcapServices.getCredentials('relationship_extraction'));
// <service name> is coming from node_modules/watson-developer-cloud/lib/index.js

var relationshipExtraction = watson.relationship_extraction(credentials);

app.get('/', function(req, res) {
  res.render('index');
});

/* Relationship Extraction */
app.post('/api/extract', function(req, res, next) {
  // if req.body.text === undefined, throw error
  // if req.body.text === empty, throw error
  relationshipExtraction.extract({
    text: req.body.text,
    dataset: 'ie-en-news'
  }, function(err, results) {
    if (err)
      return next(err);
    else
      res.json(results);
  });
});

// error-handler application settings
require('./config/error-handler')(app);

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);
