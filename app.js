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
  MonkeyLearn = require('monkeylearn'),
  vcapServices = require('vcap_services'),
  extend       = require('util')._extend,
  watson       = require('watson-developer-cloud');

// Bootstrap application settings
require('./config/express')(app);

// if bluemix credentials exists, then override local
var credentials =  extend({
  url: 'https://gateway.watsonplatform.net/relationship-extraction-beta/api',
  username: '260764c8-81ae-4b42-8fdd-ff417233a4d4',
  password: 'HdE56JeTkth7',
  version: 'v1'
}, vcapServices.getCredentials('relationship_extraction'));
// <service name> is coming from node_modules/watson-developer-cloud/lib/index.js

var relationshipExtraction = watson.relationship_extraction(credentials);

app.get('/', function(req, res) {
  console.log('GET method is called');
  res.render('index', { title: 'test'});
});

/* Relationship Extraction */
app.post('/api/extract', function(req, res, next) {
    console.log('POST method is called');
  // if req.body.text === undefined, throw error
  // if req.body.text === empty, throw error
  relationshipExtraction.extract({
    text: req.body.text,
    dataset: 'ie-en-news'
  }, function(err, results) {
    if (err)
      return next(err);
    else
    {
      //call monkeylearn and find the crime category
    var ml = new MonkeyLearn('1e98c9c6fea2aacefcdaa85139610725f42366fe');
    var ml_prediction='';
var module_id = 'cl_N8BmpbrK';
var text_list = [req.body.text];
var p = ml.classifiers.classify(module_id, text_list, true);
p.then(function (res2) {
  var temp = res2.result;
  temp = temp[0];
  if (temp.length>1)
  {
    ml_prediction = '\n' + temp[0].label + ' --> ' +temp[1].label +'\n';
  console.log('Crime Prediction');
  console.log(temp[0].label + ' --> ' +temp[1].label +'\n');
  results.testTitle = ml_prediction;

      res.json(results);
}
else
{
  ml_prediction = '\n' + temp[0].label + '\n';
    console.log('Crime Prediction:');
  console.log(temp[0].label + '\n');
  results.mlPrediction = ml_prediction;

      res.json(results);
}
});

      console.log('Crime report entered:');
      console.log(req.body.text);
      console.log(JSON.stringify(results));
      // results.testTitle = "fucking awesome!"

      // res.json(results);
    }
  });
});

// error-handler application settings
require('./config/error-handler')(app);

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);
