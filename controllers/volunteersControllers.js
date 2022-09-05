const { VolunteerModel, validateVolunteer, validateLogin, genToken, validateEditVolunteer } = require("../models/volunteerModel");
const bcrypt = require("bcrypt");
const { PathModel } = require("../models/pathModel");

//* check router [GET]
exports.checkRouter = async (req, res) => {
    res.json({ msg: "volunteer work fine" });
}

//* Check Token & the role of the Volunteer [GET]
exports.checkToken = async (req, res) => {
    return res.json({ status: "ok", role: req.tokenData.role });
}

//* show the volunteer info [GET]
exports.volunteerInfo = async (req, res) => {
    try {
        let volunteer = await VolunteerModel.findOne({ _id: req.tokenData._id }, { password: 0 });
        res.json(volunteer);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ err_msg: "There is problem in the server, try again later1", err })
    }
}

//* show the volunteer info only for employee[GET]
exports.volunteerInfoByEmp = async (req, res) => {
    try {
        let volunteer = await VolunteerModel.findOne({ _id: req.params.id });
        res.json(volunteer);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ err_msg: "There is problem in the server, try again later1", err })
    }
}

//* get all list of volunteers [GET]
exports.getList = async (req, res) => {
    let perPage = req.query.perPage || 5;
    let page = req.query.page || 1;

    try {
        let data = await VolunteerModel.find({}, { password: 0 })
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

exports.getListOfPaths = async (req, res) => {
    try {
        let data = await VolunteerModel.find({ _id: req.tokenData._id }).populate({ path: 'path_id', populate: { path: 'arr_points_id', populate: { path: 'donateId' } } })

        res.json(data[0].path_id);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ err_msg: "There is problem in the server, try again later1", err })
    }
}


//* Get the number of Obj in collection [GET]
exports.getCount = async (req, res) => {

    try {
        let count = await VolunteerModel.countDocuments({});
        res.json(count);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There err to count", err });
    }
}

//todo add new  card of volunteer [POST]
exports.registration = async (req, res) => {
    let validBody = validateVolunteer(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }


    try {
        let volunteer = new VolunteerModel(req.body);
        volunteer.password = await bcrypt.hash(volunteer.password, 10);
        volunteer.short_id = await genShortId(VolunteerModel);
        await volunteer.save();
        volunteer.password = "******";
        res.status(201).json(volunteer);
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
            res.status(500).json({ err_msg: "There is problem in the server, try again later1" })
    }
}

//todo Login and generate Token [POST]
exports.login = async (req, res) => {
    let validBody = validateLogin(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }

    let tempReq = req.body;
    try {
        let volunteer = await VolunteerModel.findOne({ email: tempReq.email });
        if (!volunteer) {
            return res.status(401).json({ msg: "volunteer is not found" });
        }

        let validPass = await bcrypt.compare(tempReq.password, volunteer.password);
        if (!validPass) {
            return res.status(401).json({ msg: "password wrong" });
        }

        let token = genToken(volunteer.id, volunteer.role);
        res.json({ token, volunteer: { fullName: volunteer.fullName } });
    }

    catch (err) {
        res.status(500).json({ err_msg: "There is problem in the server, try again later12" })
    }
}

//? edit the volunteer only by Employee [PUT]
exports.editVolunteer = async (req, res) => {
    let validBody = validateEditVolunteer(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }

    try {
        let id_edit = req.params.idEdit;
        let data = await VolunteerModel.updateOne({ _id: id_edit }, req.body);
        res.json(data);
    }

    catch (err) {
        if (err.code = 11000) {
            return res.status(500).json({ err_msg: "Email is already in system", code: 11000 });
        }
        res.status(500).json({ err_msg: "There is problem, try again later" });
    }
}

exports.addPathToPathAr = async (req, res) => {
    try {
        let pathID = req.body._idOfPath;
        // let idVol = res.tokenData._id;
        let data = await VolunteerModel.findOneAndUpdate({ _id: req.tokenData._id }, { $push: { path_id: pathID } })



        // await data.save();

        let dataOfPath = await PathModel.findOne({ _id: pathID }).updateOne({ volunteerID: req.tokenData._id });
        console.log(dataOfPath);
        // let data = await VolunteerModel.updateOne({ _id: req.tokenData._id }, path_id = idPath);
        res.json(data);

    }

    catch (err) {
        console.log(err);
        res.status(500).json({ err_msg: "There is problem in the server, try again later" })

    }
}

//! delete Volunteer by employee [DEL]
exports.deleteVolunteer = async (req, res) => {

    try {
        let idDel = req.params.idDel;
        let data = await VolunteerModel.deleteOne({ _id: idDel });
        res.json(data);
    }

    catch (err) {
        res.status(500).json({ err_msg: "There is problem, try again later" });
    }
}

//* Gen short id by max+1 id in DB
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
