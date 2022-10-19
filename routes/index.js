const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ msg: "FOOD STACK work fine!! Heroku update: 20/10/22    00:10 a.m !" });
})

module.exports = router;