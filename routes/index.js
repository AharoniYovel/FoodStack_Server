const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ msg: "FOOD STACK work fine!! Heroku update: 10/11/2022    14:55 p.m !" });
})

module.exports = router;