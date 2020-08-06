// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });

// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

module.exports.addToQueue = function (uid, s3url) {
    return new Promise((resolve, reject) => {
        var params = {
            // Remove DelaySeconds parameter and value for FIFO queues
            DelaySeconds: 10,
            MessageAttributes: {
                "UID": {
                    DataType: "String",
                    StringValue: uid
                },
                "s3url": {
                    DataType: "String",
                    StringValue: s3url
                }
            },
            MessageBody: "Lorem ipsum",
            QueueUrl: process.env.SQS_URL
        };

        sqs.sendMessage(params, function (err, data) {
            if (err) {
                console.log("Error", err);
                reject(err)
            } else {
                console.log("Success", data.MessageId);
                resolve(data)
            }
        });
    })

}
