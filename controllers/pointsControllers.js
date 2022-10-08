const { PointModel } = require("../models/pointModel");



//* [GET]
exports.getList = async (req, res) => {
    let perPage = req.query.perPage || 10;
    let page = req.query.page || 1;

    try {
        let data = await PointModel.find({}).populate({ path: 'donateId' }).populate({ path: 'pathId', populate: { path: 'arr_points_id' } })
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

//* [GET]
exports.getListForMap = async (req, res) => {
    try {
        let data = await PointModel.find({ pathId: null }).populate({ path: 'donateId', select: ['fullName', 'rangePeople', 'status'] });
        res.json(data);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ err_msg: "There is problem in the server, try again later1", err })
    }
}

//* [GET]
exports.getCount = async (req, res) => {

    try {
        let count = await PointModel.countDocuments({ pathId: null });
        res.json(count);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There err to count", err });
        
    } 
}

exports.pathIdValid = async (req, res) => {cls
    try {
        let donateIdParam = req.params.idDonated;
        let validPathId = await PointModel.findOne({ donateId: donateIdParam }, { pathId: 1 });
        res.json(validPathId);
    }

    catch (err) {
        res.status(500).json({ err_msg: "There is problem, try again later" });
    }
}

//todo [POST]
exports.addPoint = async (req, res) => {
    try {
        let point = new PointModel(req.body);
        point.point_id = await genPointId(PointModel);
        point.donateId = await req.body.donateId;
        await point.save();
        res.status(201).json(point);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ err_msg: "There is problem in the server, try again later1", err });
    }
}

//! [DEL]
exports.deletePoint = async (req, res) => {
    try {
        let idDel = req.params.idDel;
        let data = await PointModel.deleteOne({ donateId: idDel });
        res.json(data);
    }

    catch (err) {
        res.status(500).json({ err_msg: "There is problem, try again later" });
    }
}

const genPointId = async (_model) => {
    let data = await _model.find({}, { _id: 0, point_id: 1 });
    if (data.length <= 0) {
        return 1;
    }

    let max = 0;
    data.forEach(item => {
        if (item.point_id > max) {
            max = item.point_id;
        }
    });

    return max + 1;
}