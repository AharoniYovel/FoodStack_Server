const express = require("express");
const donatesControlles = require("../controllers/donatesControllers");
const { authEmployee, auth, authSuperAdmin } = require("../middlewares/auth");
const router = express.Router();


router.get("/", donatesControlles.checkRouter); //* check router [GET]
router.get("/donInfo/:id", authEmployee, donatesControlles.donInfo); //* get info of donated to edit [GET]
router.get("/list", authEmployee, donatesControlles.getList); //* get all list of donates [GET]
// router.get("/count", authEmployee, donatesControlles.getCount); //* Get the number of Obj in collection [GET]
router.get("/count", donatesControlles.getCount); //* Get the number of Obj in collection [GET]

//authEmployee^^ //todo

router.post("/reg", donatesControlles.registration); //todo add new pending card of donates [POST]

router.put("/editDon/:idEdit", authEmployee, donatesControlles.editDonate); //? edit donate by employee [PUT]
// authEmployee^^ //todo


router.delete("/delDon/:idDel", authEmployee, donatesControlles.deleteDonate); //! delete donate by employee [DEL]
// authEmployee^^^ //todo

module.exports = router;