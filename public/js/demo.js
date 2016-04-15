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

$(document).ready(function () {
  var $table = $('.js-output-section--table-container'),
      $prediction = $('.js-output-section--prediction-container'),
      $loading = $('.js-output-section--loading'),
      $error = $('.js-output-section--error'),
      $errorMessage = $('.js-output-section--error-message'),
      $submitButton = $('.js-input-section--submit-button'),
      $textarea = $('.js-input-section--text-area'),
      tableTemplate = entityTableTemplate.innerHTML,
      predictionTemplate = predictionTextTemplate.innerHTML,
      $mapLayout = $('.output-section-map');

  /**
   * Emits table view update
   * @param  {array} tableArray [{ mention: {String}, entity: {String} }]
   */
  function updateTable(tableArray) {
    $table.html(_.template(tableTemplate, {
      items: tableArray
    }));
  }

  /**
   * Gets textarea input text
   * @return {String} text
   */
  function getText() {
    return $textarea.val();
  }

  // function predictCrime(var a) {
  //   $prediction.html(_.template(predictionTemplate,{test: a}));
  //   //$prediction.text("please work!");
  // }
  /**
   * Send in input text and gets back Relationship Extraction data.
   * Makes AJAX Post Request.
   */
  function extractData() {
    var parameters = {
      text: getText()
    };

    $.post('/api/extract', parameters, function(data) {
      $loading.hide();
      $table.show();
      $error.hide();
      $prediction.show();
      $mapLayout.show();


      //var mentionArray = data.doc.mentions.mention;
      var entityArray = data.doc.entities.entity;
      var i=0
      while(i< entityArray.length)
      {
        console.log('entity type is ' + JSON.stringify(entityArray[i].type));
        i++;
      }

      var a = data.mlPrediction;
      console.log('prediction received is ' + a);
      $prediction.html(_.template(predictionTemplate,{test: a}));


//predictCrime(test);

      updateTable(entityArray.map(function(item) {
        return {
          entity: item.mentref[0].text,
          type: item.type
        };
      }));

    }).fail(function(error) {
      $loading.hide();
      $table.hide();
      $error.show();
      $mapLayout.hide();
      $errorMessage.text(error.responseJSON.code + ': ' + error.responseJSON.error);
    });
  }

  /**
   * Submit Button Click Event
   */
  $submitButton.click(function() {
    $loading.show();
    $table.hide();
    $error.hide();
    extractData();
    //predictCrime();
  });

});
