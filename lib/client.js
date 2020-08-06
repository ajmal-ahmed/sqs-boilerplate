const AWS = require('aws-sdk')
AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const uniqid = require('uniqid');

const TABLE_NAME = process.env.TABLE_NAME;
module.exports.createClient = async function () {
    return new Promise((resolve, reject) => {
        let clientId = uniqid("UID")
        //dynamoDB create instance for client
        var params = {
            TableName: TABLE_NAME,
            Item: {
                "id": clientId,
                "csvdata": null
            }
        };

        console.log("Adding a new client...");
        dynamoDb.put(params, function (err, data) {
            if (err) {
                reject(JSON.stringify(err, null, 2))
            } else {
                resolve(clientId)
            }
        });
    })
}
module.exports.retrieveClient = async function (clientId) {
    return new Promise((resolve, reject) => {
        var params = {
            TableName: TABLE_NAME,
            Key: {
                "id": clientId
            }
        };

        dynamoDb.get(params, function (err, data) {
            if (err) {
                reject(JSON.stringify(err, null, 2))
            } else {
                resolve(JSON.stringify(data))
            }
        });
    })
}

module.exports.updateClient = async function (clientId, data) {
    return new Promise((resolve, reject) => {
        // console.log(data)
        var params = {
            TableName: TABLE_NAME,
            Key: {
                "id": clientId
            },
            UpdateExpression: "set csvdata = :r",
            ExpressionAttributeValues: {
                ":r": data
            },
            ReturnValues: "UPDATED_NEW"
        };

        // console.log("Updating the item...");
        dynamoDb.update(params, function (err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                reject(JSON.stringify(err, null, 2))
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                resolve(JSON.stringify(data))
            }
        });
    })
}