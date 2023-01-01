const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.json({ msg: "FOOD STACK work fine!! Render update: 01/01/2023    21:31 p.m !" });
})

module.exports = router;