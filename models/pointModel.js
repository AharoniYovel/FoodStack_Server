const mongoose = require('mongoose');
const Joi = require('joi');


const pointSchema = new mongoose.Schema({
    location: {
        lat: Number,
        lng: Number,
    },
    city: String,
    floor: Number,
    donateId: { type: mongoose.SchemaTypes.ObjectId, ref: "donates" },
    pathId: { type: mongoose.SchemaTypes.ObjectId, ref: "paths", default: null },
    point_id: Number,
})

exports.PointModel = mongoose.model("points", pointSchema);

exports.validatePoint = (_reqBody) => {
    let joiSchema = Joi.object({

        city: Joi.string().min(2).max(50).required(),
        location: {
            lat: Joi.number().min(2).max(99).required(),
            lng: Joi.number().min(2).max(99).required()
        },
        floor: Joi.number().min(1).max(99).required(),
        pathId: Joi.object().allow(null)
    })
    return joiSchema.validate(_reqBody);
}