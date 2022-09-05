const mongoose = require('mongoose');
const Joi = require('joi');

const pathSchema = new mongoose.Schema({
    path_id: Number,
    radius: Number,
    rangePeople: Number,
    arr_points_id: [{ type: mongoose.SchemaTypes.ObjectId, ref: "points" }],
    volunteerID: { type: mongoose.SchemaTypes.ObjectId, ref: "volunteers", default: null },
    arr_citys: [String],
    create_at: { type: Date, default: Date.now() }
})

exports.PathModel = mongoose.model("paths", pathSchema);

// exports.validatePath = (_reqBody) => {
//     let joiSchema = Joi.object({
//         radius: Joi.number().min(1).max(99999).allow("", null),
//         rangePeople: Joi.number().min(1).max(10).required(),
//     })
//     return joiSchema.validate(_reqBody);
// }