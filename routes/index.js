const express = require("express");
const router = express.Router();
const client = require('../lib/client')
const s3Handler = require('../lib/s3Handler')
const sqs = require('../lib/sqs')
const middleware = require('../lib/middleware')
const fileUpload = require('express-fileupload');
const { response, json } = require("express");
router.use(fileUpload());
router.get("/generate", (req, res) => {
    client.createClient().then((clientId) => {
        return res.json({ clientId })
    }).catch((e) => {
        console.log(e)
        res.status(400)
        res.json({ error: "system error", description: "unable to generate client credentials" })
    })
});
router.post("/uploads/:id", middleware.validateClient(), middleware.validateFile(), (req, res) => {
    let uid = req.params.id, data = req.files.csvField.data
    // console.log("file=>", data)
    s3Handler.upload(uid, data).then((s3url) => {
        sqs.addToQueue(uid, s3url).then((response) => {
            console.log("messgae", response)
            res.json({ message: "csv uploaded to sqs" })
            return
        }).catch((error) => {
            console.log("s3-file-upload error=>", error)
            res.status(400)
            res.json({ error: "system error", description: "unable to upload csv,try again" })
        })

    }).catch((e) => {
        console.log("s3-file-upload error=>", e)
        res.status(400)
        res.json({ error: "system error", description: "unable to upload csv,try again" })
    })

});

router.get("/:id", middleware.validateClient(), (req, res) => {
    let clientInfo = res.locals.clientInfo;
    if (clientInfo.csvdata) {
        res.json({ data: clientInfo.csvdata })
    } else {
        res.json({ message: "CSV file not processed yet" })
    }


});

module.exports = router;
