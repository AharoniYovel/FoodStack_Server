const { DonatedModel, validateDonated, validateEditDonated } = require("../models/donateModel");
const { PointModel } = require("../models/pointModel");

//* check router [GET]
exports.checkRouter = async (req, res) => {
    res.json({ msg: "donates work fine" });
}

//* get all list of donates [GET]
exports.getList = async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;

    try {
        let data = await DonatedModel.find({})
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

//* get info of donated to edit [GET]
exports.donInfo = async (req, res) => {
    try {
        let donated = await DonatedModel.findOne({ _id: req.params.id });
        res.json(donated);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ err_msg: "There is problem in the server, try again later1", err })
    }
}

//* Get the number of Obj in collection [GET]
exports.getCount = async (req, res) => {

    try {
        let count = await DonatedModel.countDocuments({});
        res.json(count);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There err to count", err });
    }
}

//TODO add new pending card of donates [POST]
exports.registration = async (req, res) => {
    let validBody = validateDonated(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }

    try {
        let donated = new DonatedModel(req.body);
        donated.short_id = await genShortId(DonatedModel);
        await donated.save();
        let donateID = donated._id;
        res.status(201).json(donateID);
    }

    catch (err) {
        console.log(err);
        if (err.code == 11000 && err.keyPattern.phone == 1) {
            res.status(400).json({ code: 11000, err_msg: "phone already in system" })
        }
        if (err.code)
            res.status(500).json({ err_msg: "There is problem in the server, try again later1" })
    }
}

//? edit Donate by Employee [PUT]
exports.editDonate = async (req, res) => {
    let validBody = validateEditDonated(req.body);
    if (validBody.error) {
        return res.status(400).json(validBody.error.details);
    }

    try {
        let id_edit = req.params.idEdit;
        let data = await DonatedModel.updateOne({ _id: id_edit }, req.body);
        res.json(data);
    }

    catch (err) {
        if (err.code = 11000) {
            return res.status(500).json({ err_msg: "Email is already in system", code: 11000 });
        }
        res.status(500).json({ err_msg: "There is problem, try again later" });
    }
}

//! delete Donate by Employee [DEL]
exports.deleteDonate = async (req, res) => {

    try {
        let idDel = req.params.idDel;
        let data = await DonatedModel.deleteOne({ _id: idDel });
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