var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var rekognition = new AWS.Rekognition();

exports.handler = (event, context, callback) => {
// TODO implement
    var responseData = {};
    var eventText= JSON.stringify(event);
    console.log('event data is:');
    
//    console.log(eventText);
    var sourceBucket = event.Records[0].s3.bucket.name;
    var catTargetBucket = 'catimage' + sourceBucket.substr(sourceBucket.indexOf('.'),(sourceBucket.length - sourceBucket.indexOf('.')));
    var processedTargetBucket = 'processedimage' + sourceBucket.substr(sourceBucket.indexOf('.'),(sourceBucket.length - sourceBucket.indexOf('.')));
    var moveObject = event.Records[0].s3.object.key;
    var sourceObject = sourceBucket + '/' + moveObject;
    console.log('bucket name ',sourceBucket);
    console.log('object name ', moveObject);
    console.log('cat target bucket ', catTargetBucket);
    console.log('processed target bucket ', processedTargetBucket);
    console.log('SourceObject ', sourceObject);
    
//  Add Rekognition code
    var params = {
        Image: {
        S3Object: {
            Bucket: sourceBucket, 
            Name: moveObject
            }
        }, 
        MaxLabels: 100, 
        MinConfidence: 70
    };
    
    rekognition.detectLabels(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else {     console.log(data);           // successful response

        var catFound = false;
        data.Labels.forEach(element => { 
            console.log(element);
            if (element.Name == "Cat" && element.Confidence >= 70) catFound = true
        }); 

        var deleteParams = {
            Bucket: sourceBucket,
            Key: moveObject
        };

//  Move file to processed bucket if not deemed cat image
        if (catFound==false) {
            var copyParams = {
                Bucket: processedTargetBucket,
                CopySource: sourceObject,
                Key: moveObject
            };
        }            
    
// Move file to cat bucket if probability high enough
        if (catFound) {
            console.log('found cat image!!');
            var copyParams = {
                Bucket: catTargetBucket,
                CopySource: sourceObject,
                Key: moveObject
            };
        }            

        console.log(copyParams);
        s3.copyObject(copyParams, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else {
                console.log(data);           // successful response
                s3.deleteObject(deleteParams, function(err, data) {
                    if (err) console.log(err, err.stack);  // error
                    else     console.log();                 // deleted
                })
            };
        });

    }
    });
    var response = {
        statusCode: 200, 
        body: JSON.stringify('Hello from Lambda!')
    };

    console.log(response);
    callback(null, response);
};
