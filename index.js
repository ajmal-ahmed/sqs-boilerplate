require("dotenv").config({ path: __dirname + "/.env" }); //load env variables
const express = require("express");
const app = express();
const AWS = require("aws-sdk");

// Init Middleware
//extended: true ->support parsing of application/x-www-form-urlencoded post data
app.use(express.json({ extended: true }));

// Define routes
app.use("/api", require("./routes/index"));


// UI
app.get("/", (req, res) => {
    res.sendFile("public/index.html", { root: __dirname });
});

// //ensure connectivity generate an access key
// AWS.config.getCredentials(function (err) {
//     if (err) console.log(err.stack);
//     // credentials not loaded
//     else {
//         console.log("Access key:", AWS.config.credentials.accessKeyId);
//     }
// });
app.use(function (req, res) {
    res.send(404);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Client Server started on port ${PORT}`));
