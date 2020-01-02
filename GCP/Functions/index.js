/**
 * Copyright 2017, Google, Inc.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * To register with GCP use:
 *  gcloud beta functions deploy AnalyzeImage --trigger-bucket=jvtemp1 --runtime nodejs8
 */


'use strict';

// [START functions_imagemagick_setup]
const exec = require('child_process').exec;
const fs = require('fs');
const path = require('path');
const storage = require('@google-cloud/storage')();
const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient();
// [END functions_imagemagick_setup]

exports.AnalyzeImage = (event) => {
  const object = event.data;
  console.log(event);
  console.log(event.data);

  //const file = storage.bucket(object.bucket).file(object.name);
  const file = 'gs://'+event.bucket+'/'+event.name;
  console.log(event.bucket);
  console.log(event.name);
  console.log('Analyzing ${file.name}.');

  client.labelDetection(file).then(response => {
	console.log(response[0]);
	const labels = response[0].labelAnnotations;
	console.log('Labels:');
    console.log(labels[0]);
	labels.forEach(label => {
      console.log(label.description)
      console.log(label.score)
    });
	}).catch((err) => {
      		console.error('Failed to analyze ${file.name}.', err);
    	});

};
