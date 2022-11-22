const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ msg: "FOOD STACK work fine!! Cyclic update: 22/11/2022    15:24 p.m !" });
})

module.exports = router;