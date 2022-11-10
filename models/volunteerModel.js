const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const { infConect } = require('../config/secret');

const volunteerSchema = new mongoose.Schema({
    fullName: String,
    short_id: Number,
    email: String,
    password: String,
    path_id: [{ type: mongoose.SchemaTypes.ObjectId, ref: "paths" }],
    city: String,
    phone: String,
    radius: Number,
    rangePeople: Number,
    role: { type: String, default: "volunteer" },
    anonymous: { type: Boolean, default: false },
    create_at: { type: Date, default: Date.now() }
})

exports.VolunteerModel = mongoose.model("volunteers", volunteerSchema);

exports.genToken = (_id, role) => {
    let token = jwt.sign({ _id, role }, infConect.secretToken, { expiresIn: "120mins" });
    return token;
}

exports.validateVolunteer = (_reqBody) => {
    let joiSchema = Joi.object({
        fullName: Joi.string().min(2).max(99).required(),
        email: Joi.string().email().min(2).max(150).required(),
        password: Joi.string().min(3).max(99).required(),
        path_id: Joi.array(),
        city: Joi.string().min(2).max(50).required(),
        phone: Joi.string().min(9).max(10).required(),
        radius: Joi.number().min(1).max(99999).required(),
        rangePeople: Joi.number().min(1).max(10).required(),
        anonymous: Joi.boolean().required()
    })
    return joiSchema.validate(_reqBody);
}

exports.validateEditVolunteer = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(150).email(),
        city: Joi.string().min(2).max(50),
        phone: Joi.string().min(9).max(10),
        radius: Joi.number().min(1).max(99999),
        rangePeople: Joi.number().min(1).max(10),
        anonymous: Joi.boolean()
    })
    return joiSchema.validate(_reqBody);
}

exports.validateLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(150).email().required(),
        password: Joi.string().min(3).max(99).required(),
    })
    return joiSchema.validate(_reqBody);
}

