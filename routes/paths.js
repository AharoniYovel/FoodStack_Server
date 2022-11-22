const express = require("express");
const pathsControllers = require("../controllers/pathsControllers");
const { auth, authEmployee } = require("../middlewares/auth");
const router = express.Router();

router.get("/", pathsControllers.checkRouter); //* [GET]

router.get('/allPathList', pathsControllers.getListOfAll); //* [GET]

router.get("/pathList", pathsControllers.getPathList); //* [GET]

router.get('/pathInfo/:idPath', auth, pathsControllers.pathInfo); //* [GET]

// router.get('/count', authEmployee, pathsControllers.getCount); //* [GET]
router.get('/count', pathsControllers.getCount); //* [GET]

router.post("/addPath", pathsControllers.addPath); //todo [POST]

//todo delete one point & his city from the points_arr in pathModel 
router.put('/delOneDonated/:idPathValid/:idOfPoint', pathsControllers.delOneDonated); //todo [POST]

router.delete('/delPath/:idDelPath', pathsControllers.deletePath); //! [DEl]


module.exports = router;