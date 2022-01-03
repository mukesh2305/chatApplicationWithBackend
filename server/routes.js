const express = require("express");
const connectdb = require("./dbConnection");
const Chat = require("./chatSchema");

const router = express.Router();

router.route("/").get((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    connectdb.then(db => {
        Chat.find({}).then(chat => {
            res.json(chat);
        });
    });
});

module.exports = router;
