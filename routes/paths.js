const express = require("express");
const pathsControllers = require("../controllers/pathsControllers");
const { auth } = require("../middlewares/auth");
const { PathModel } = require("../models/pathModel");
const router = express.Router();

router.get("/", pathsControllers.checkRouter); //* [GET]

router.get('/allPathList', pathsControllers.getListOfAll); //* [GET]

router.get("/pathList", pathsControllers.getPathList); //* [GET]

router.get('/pathInfo/:idPath', pathsControllers.pathInfo); //* [GET]

router.get('/count', pathsControllers.getCount); //* [GET]

router.post("/addPath", pathsControllers.addPath); //todo [POST]


// router.delete("delOneDonated/:idPathValid",pathsControllers.delOneDonated); //! [DEL]

router.put('/delOneDonated/:idPathValid/:idOfPoint', async (req, res) => {
    try {
        let idPathValid = req.params.idPathValid;
        let idOfPoint = req.params.idOfPoint;

        let pathData = await PathModel.findOne({ _id: idPathValid });

        const indexOfPointToDel = pathData.arr_points_id.indexOf(idOfPoint);
        if (indexOfPointToDel > -1) {
            pathData.arr_points_id.splice(indexOfPointToDel, 1);
            pathData.arr_citys.splice(indexOfPointToDel, 1);
        }

        pathData.save();

        res.json(pathData);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ err_msg: "There is problem to delete point from pathModel.arr_points_id, try again later1", err })
    }
})



module.exports = router;