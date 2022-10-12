const express = require("express");
const volunteersControlles = require("../controllers/volunteersControllers");
const { auth, authEmployee, authSuperAdmin } = require("../middlewares/auth");
const { VolunteerModel } = require("../models/volunteerModel");
const router = express.Router();


router.get("/", volunteersControlles.checkRouter);  //* check router [GET]
router.get("/checkToken", auth, volunteersControlles.checkToken);  //* Check Token & the role of the user without DB request [GET]
// auth^^ //todo

router.get("/volunteerInfo", auth, volunteersControlles.volunteerInfo); //* show the volunteer info [GET]
// auth^^ //todo

router.get("/volunteerInfoByEmp/:id", authEmployee, volunteersControlles.volunteerInfoByEmp); //* show the volunteer info only for employee[GET]


router.get("/list", authEmployee, volunteersControlles.getList); //* get all list of volunteers [GET]

router.get("/listOfPathsOfVol", auth, volunteersControlles.getListOfPaths); //* get all list of path of volunteer [GET]

router.get("/count", authEmployee, volunteersControlles.getCount); //* Get the number of Obj in collection [GET]

// authEmployee^^ //todo

router.post("/reg", volunteersControlles.registration);  //todo add new  card of volunteer [POST]
router.post("/login", volunteersControlles.login); //todo Login and generate Token [POST]

router.put("/volEdit/:idEdit", authEmployee, volunteersControlles.editVolunteer); //? edit the volunteer only by Employee [PUT]
// authEmployee^^ //todo
router.put("/addPathToVol", auth, volunteersControlles.addPathToPathAr);//?  [PUT]

router.put('/delOnePath/:idVol/:idPath', async (req, res) => {

    let idVol = req.params.idVol;
    let idPath = req.params.idPath;

    let volData = await VolunteerModel.findOne({ _id: idVol });

    const indexOfPathToDel = volData.path_id.indexOf(idPath);

    if (indexOfPathToDel > -1) {
        volData.path_id.splice(indexOfPathToDel, 1);
    }
    volData.save();

    res.json(volData);
})

router.delete("/delVol/:idDel", authEmployee, volunteersControlles.deleteVolunteer); //! delete a volunteer by Employee only [DEL]
// authEmployee^^ //todo


module.exports = router;