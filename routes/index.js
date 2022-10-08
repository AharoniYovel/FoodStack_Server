const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ msg: "FOOD STACK work fine!! Heroku update: 09/10/22    1:31 a.m !" });
})

module.exports = router;