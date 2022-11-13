const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ msg: "FOOD STACK work fine!! Heroku update: 13/11/2022    22:50 p.m !" });
})

module.exports = router;