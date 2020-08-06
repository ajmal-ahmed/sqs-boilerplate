# SQS Boilerplate


## What's covered?

It's a simple app that lets you create a unique client. Upload csv files using the client. once it's uploaded the file is saved to s3 bucket and a message is added to SQS. SQS messages are consumed in background. while each message is consumed  corresponding CSV files from s3 are read and saved to dynamoDB as Json data. These data can be retrieved via API endpoint using the unique Id.

## Getting started

Make sure you have [npm](http://npmjs.org/).

1. `git clone https://github.com/ajmal-ahmed/sqs-boilerplate.git`
2. `npm install`
3. Add `.env` and set your AWS credentials (see .env.sample file to know all the variables used).
4. `npm start`
5. Open `localhost:PORT` in your browser to test-client creation and file upload
6. Start hacking!

## Find your way around

* `index.js` - express app entry point
* `sqsconsumer.js` - SQS consumer
* `lib/` - library functions
* `routes/index.js` - Primary endpoints
