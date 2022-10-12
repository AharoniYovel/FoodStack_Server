const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ msg: "FOOD STACK work fine!! Heroku update: 13/10/22    02:52 a.m !" });
})

module.exports = router;