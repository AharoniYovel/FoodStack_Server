const bcrypt = require("bcrypt");
const { infConect } = require("../config/secret");
const { validateEmployee, EmployeeModel, validateLoginEmployee, genToken, validateEditEmployee } = require("../models/employeeModel");


//* check router [GET]
exports.checkRouter = async (req, res) => {
    res.json({ msg: "employees work fine" });
}

//* Check Token & the role of the employee [GET]
exports.checkToken = async (req, res) => {
    return res.json({ status: "ok", role: req.tokenData.role });
}

//* get info of employee to edit [GET]
exports.employeeInfo = async (req, res) => {
    try {
        let employee = await EmployeeModel.findOne({ _id: req.params.id }, { password: 0 });
        res.json(employee);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ err_msg: "There is problem in the server, try again later1", err })
    }
}

//* get all list of employees only super admin auth [GET]
exports.getList = async (req, res) => {
    let perPage = req.query.perPage || 5;
    let page = req.query.page || 1;

    try {
        let data = await EmployeeModel.find({}, { password: 0 })
            .limit(perPage)
            .skip((page - 1) * perPage)
            // .sort({ _id: -1 }) order oposite to the order
            .sort({ _id: 1 })

        res.json(data);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ err_msg: "There is problem in the server, try again later1", err })
    }
}

//* Get the number of Obj in collection [GET]
exports.getCount = async (req, res) => {

    try {
        let count = await EmployeeModel.countDocuments({});
        res.json(count);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There err to count", err });
    }
}

//todo Add employee only super admin can [POST]
exports.addAdmin = async (req, res) => {
    let validBody = validateEmployee(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }

    try {
        let employee = new EmployeeModel(req.body);
        employee.password = await bcrypt.hash(employee.password, 10);
        employee.short_id = await genShortId(EmployeeModel);
        await employee.save();
        employee.password = "******";
        res.status(201).json(employee);
    }

    catch (err) {
        console.log(err)
        if (err.code == 11000 && err.keyPattern.phone == 1) {
            res.status(400).json({ code: 11000, err_msg: "phone already in system" })
        }
        if (err.code == 11000 && err.keyPattern.email == 1) {
            res.status(400).json({ code: 11000, err_msg: "Email already in system" })
        }
        if (err.code)
            res.status(500).json({ err_msg: "There is problem in the server, try again later12" })
    }
}

//todo Login and generate Token [POST]
exports.login = async (req, res) => {
    let validBody = validateLoginEmployee(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }

    let tempReq = req.body;
    try {
        let employee = await EmployeeModel.findOne({ email: tempReq.email });
        if (!employee) {
            return res.status(401).json({ msg: "employee is not found" });
        }

        let validPass = await bcrypt.compare(tempReq.password, employee.password);
        if (!validPass) {
            return res.status(401).json({ msg: "password wrong" });
        }

        let token = genToken(employee.id, employee.role);
        res.json({ token, employee: { nickName: employee.nickName, role: employee.role } });
    }

    catch (err) {
        res.status(500).json({ err_msg: "There is problem in the server, try again later1 and db" })

    }
}

//? edit employee by super admin [PUT]
exports.editEmployee = async (req, res) => {
    //! simple if that prevent to edit/delete the super admin
    if (req.params.idEdit == infConect.superAdminId || req.params.idEdit == req.tokenData._id) {
        return res.status(401).json({ msg_err: "You cant change yourself and the super Admin!!!" });
    }

    let validBody = validateEditEmployee(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }

    try {
        let id_edit = req.params.idEdit;
        let data = await EmployeeModel.updateOne({ _id: id_edit }, req.body);
        res.json(data);
    }

    catch (err) {
        if (err.code = 11000) {
            return res.status(500).json({ err_msg: "Email is already in system", code: 11000 });
        }
        res.status(500).json({ err_msg: "There is problem, try again later" });
    }
}

//! delete employee by super admin [DEL]
exports.deleteEmployee = async (req, res) => {
    try {
        let idDel = req.params.idDel;

        if (idDel == infConect.superAdminId || idDel == req.tokenData._id) {
            return res.status(401).json({ msg_err: "You cant delete yourself and the super Admin!!!" });
        }

        let data = await EmployeeModel.deleteOne({ _id: idDel });
        res.json(data);
    }

    catch (err) {
        res.status(500).json({ err_msg: "There is problem, try again later" });
    }
}

// * Gen short id by max+1 id in DB
const genShortId = async (_model) => {
    let data = await _model.find({}, { _id: 0, short_id: 1 });
    if (data.length <= 0) {
        return 1;
    }

    let max = 0;
    data.forEach(item => {
        if (item.short_id > max) {
            max = item.short_id;
        }
    });

    return max + 1;
}