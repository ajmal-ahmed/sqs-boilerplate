const client = require("./client");

module.exports.validateClient = function () {
    return function (req, res, next) {
        console.log("req=>", req.params)
        let clientId = req.params.id
        if (!clientId) {
            res.status(400)
            res.json({ error: "invalid request", description: "unique id is required" })
            return
        }
        client.retrieveClient(clientId).then((clientInfo) => {
            console.log("clientinfo", clientInfo)
            let inFo = JSON.parse(clientInfo)
            if (!inFo.Item) {
                res.status(400)
                res.json({ error: "invalid request", description: "invalid client id" })
                return;
            }
            res.locals.clientInfo = inFo.Item
            next();
        }).catch((e) => {
            console.log("client err->", e)
            res.status(400)
            res.json({ error: "invalid request", description: "invalid client id" })
            return
        })

    };
};
//

module.exports.validateFile = function () {
    return function (req, res, next) {
        console.log("in=>", req)
        if (!req.files || Object.keys(req.files).length === 0) {
            res.status(400)
            res.json({ error: "invalid request", description: "No files were uploaded" })
            return;
        }
        if (!req.files.csvField) {
            res.status(400)
            res.json({ error: "invalid request", description: "csv file not uploaded" })
            return;
        }
        //accept  types only
        let allowedMimetypes = ["text/csv", "application/vnd.ms-excel"]
        if (!allowedMimetypes.includes(req.files.csvField.mimetype)) {
            res.status(400)
            res.json({ error: "invalid request", description: "only csv files can uploaded" })
            return;
        }
        next();


    };
};