const { PathModel } = require("../models/pathModel");
const { PointModel } = require("../models/pointModel");


//* [GET]
exports.checkRouter = async (req, res) => {
    res.json({ msg: "paths work fine" });
}

//* [GET]
exports.getListOfAll = async (req, res) => {
    let data = await PathModel.find({}).populate('volunteerID').populate({ path: 'arr_points_id', populate: { path: 'donateId pathId' } });
    // let data = await PathModel.find({});
    res.json(data);
}

//* [GET]
exports.getPathList = async (req, res) => {
    try {
        let data = await PathModel.find({ volunteerID: null }).populate({ path: 'arr_points_id', populate: { path: 'donateId' } })

        res.json(data);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ err_msg: "There is problem in the server, try again later1", err })
    }
}

//* [GET]
exports.pathInfo = async (req, res) => {

    let idPath = req.params.idPath;
    let data = await PathModel.findOne({ _id: idPath }).populate({ path: 'arr_points_id', populate: { path: 'donateId' } })


    res.json(data.arr_points_id);

}

//* [GET]
exports.getCount = async (req, res) => {
    try {

        let total = await PathModel.countDocuments();
        let volunteerIDIsNull = await PathModel.countDocuments({ volunteerID: null });
        res.json(total - volunteerIDIsNull);
    }

    catch (err) {
        console.log(err);
        res.status(500).json({ msg: "There err to count", err });
    }
}



//todo [POST]
exports.addPath = async (req, res) => {

    try {

        let path = new PathModel();
        path.path_id = await genPathtId(PathModel);
        path.arr_points_id = await (req.body);


        await path.save();

        let data = await PathModel.find({ _id: path._id }).populate("arr_points_id");
        let arr_points_id_data = data[0].arr_points_id
        let citys = [];



        arr_points_id_data.forEach((elem, i) => {
            citys[i] = elem.city;
        })
        console.log(citys);

        PathModel.updateOne({ _id: path._id }, path.arr_citys = citys);

        arr_points_id_data.forEach((elem, i) => {
            PointModel.updateOne({ _id: elem._id }, elem.pathId = path._id);
            elem.save();
        })


        await path.save();

        res.status(201).json(path);
    }


    catch (err) {
        console.log(err);
        res.status(500).json({ err_msg: "There is problem in the server, try again later1", err });
    }
}

//todo [POST]
exports.delOneDonated = async (req, res) => {
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
}

//! [DEl]
exports.deletePath = async (req, res) => {
    try {
        let idDelPath = req.params.idDelPath;
        let data = await PathModel.deleteOne({ _id: idDelPath });
        res.json(data);
    }

    catch (err) {
        res.status(500).json({ err_msg: "There is problem to delete path, try again later" });
    }
}



// * Gen short id by max+1 id in DB
const genPathtId = async (_model) => {
    let data = await _model.find({}, { _id: 0, path_id: 1 });
    if (data.length <= 0) {
        return 1;
    }

    let max = 0;
    data.forEach(item => {
        if (item.path_id > max) {
            max = item.path_id;
        }
    });

    return max + 1;
}