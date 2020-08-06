require("dotenv").config({ path: __dirname + "/.env" }); //load env variables
const AWS = require('aws-sdk');
const { Consumer } = require('sqs-consumer');
const s3Handler = require('./lib/s3Handler')
const client = require('./lib/client')

// Configure the region
AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });

const queueUrl = process.env.SQS_URL;

function processMessage(message) {
    // let sqsMessage = JSON.parse(message.Body);
    console.log(message)
    let clientId = message.MessageAttributes.UID.StringValue;
    return new Promise((resolve, reject) => {
        s3Handler.retrieveCsv(clientId).then((json) => {
            client.updateClient(clientId, json).then((data) => {
                resolve()
            }).catch((e) => {
                reject();
            })

        }).catch((e) => {
            reject();
        })
    })

}
// Create our consumer
const app = Consumer.create({
    queueUrl: queueUrl,
    messageAttributeNames: ["UID", "s3url"],
    handleMessage: async (message) => {
        processMessage(message);
    },
    sqs: new AWS.SQS()
});

app.on('error', (err) => {
    console.error(err.message);
});

app.on('processing_error', (err) => {
    console.error(err.message);
});

console.log('SQS consumer service is running');
app.start();