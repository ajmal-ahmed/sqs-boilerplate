var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });

// Create S3 service object
s3 = new AWS.S3({ apiVersion: '2006-03-01' });
const csv = require('csvtojson');

module.exports.upload = function (uid, content) {
    return new Promise((resolve, reject) => {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: uid + '.csv',
            Body: content
        };

        // Uploading files to the bucket
        s3.upload(params, function (err, data) {
            if (err) {
                reject(err)
                return
            }
            console.log("File uploaded ,inf->", data);
            resolve(data.Location)

        });
    })
}

module.exports.retrieveCsv = function (uid) {
    return new Promise(async (resolve, reject) => {
        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: uid + '.csv'
        };
        try {
            const stream = s3.getObject(params).createReadStream();  // convert csv file (stream) to JSON format data
            const json = await csv().fromStream(stream);
            resolve(json)
        } catch (e) {
            console.log("s3 read error", e)
            reject(e)
        }


    })
}