const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ msg: "FOOD STACK work fine!! Cyclic update: 22/11/2022    13:55 p.m !" });
})

module.exports = router;