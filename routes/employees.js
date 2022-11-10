const express = require("express");
const employeesControlles = require('../controllers/employeesControllers');
const { authSuperAdmin, authEmployee } = require("../middlewares/auth");
const router = express.Router();


router.get("/", employeesControlles.checkRouter); //* check router [GET]
router.get("/checkToken", authEmployee, employeesControlles.checkToken); //* Check Token & the role of the employee without DB request [GET]
router.get("/empInfo/:id", authSuperAdmin, employeesControlles.employeeInfo); //* get info of employee to edit [GET]
router.get("/list", authSuperAdmin, employeesControlles.getList); //* Check Token & the role of the employee without DB request [GET]
router.get("/count", authEmployee, employeesControlles.getCount); //* Get the number of Obj in collection [GET]
// authEmployee^^ //todo


router.post("/addAdmin", authSuperAdmin, employeesControlles.addAdmin); //todo Add employee only super admin can [POST]
// authSuperAdmin^^ //todo


router.post("/login", employeesControlles.login); //todo Login and generate Token [POST]

router.put("/editEmp/:idEdit", authSuperAdmin, employeesControlles.editEmployee); //? edit employee by super admin [PUT]
// authSuperAdmin^^ //todo

router.delete("/delEmployee/:idDel", authSuperAdmin, employeesControlles.deleteEmployee); //! delete employee by super admin [DEL]
// authSuperAdmin^^ //todo

module.exports = router;