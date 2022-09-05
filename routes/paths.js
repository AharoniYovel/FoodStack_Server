const express = require("express");
const pathsControllers = require("../controllers/pathsControllers");
const { auth } = require("../middlewares/auth");
const router = express.Router();

router.get("/", pathsControllers.checkRouter); //* [GET]

router.get('/allPathList', pathsControllers.getListOfAll); //* [GET]

router.get("/pathList", pathsControllers.getPathList); //* [GET]

router.get('/pathInfo/:idPath', pathsControllers.pathInfo); //* [GET]

router.get('/count', pathsControllers.getCount); //* [GET]

router.post("/addPath", pathsControllers.addPath); //todo [POST]



module.exports = router;