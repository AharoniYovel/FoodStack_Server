const express = require("express");
const pointsControllers = require("../controllers/pointsControllers");
const { authEmployee } = require("../middlewares/auth");
const router = express.Router();


router.get("/list", pointsControllers.getList); //* [GET]
router.get('/listForMap', authEmployee, pointsControllers.getListForMap); //* [GET]
router.get('/count', authEmployee, pointsControllers.getCount); //* [GET]
router.get('/pathIdValid/:idDonated', pointsControllers.pathIdValid); //* [GET]

router.post("/addPoint", pointsControllers.addPoint); //todo [POST]

router.delete("/delPoint/:idDel", authEmployee, pointsControllers.deletePoint); //! [DEL]



module.exports = router;