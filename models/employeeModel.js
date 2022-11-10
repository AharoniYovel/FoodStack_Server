const mongoose = require('mongoose');
const Joi = require("joi");
const jwt = require('jsonwebtoken');
const { infConect } = require('../config/secret');

const employeeSchema = new mongoose.Schema({
    email: String,
    password: String,
    nickName: String,
    phone: String,
    short_id: Number,
    role: { type: String, default: "employee" }
})

exports.EmployeeModel = mongoose.model("employees", employeeSchema);

exports.genToken = (_id, role) => {
    let token = jwt.sign({ _id, role }, infConect.secretToken, { expiresIn: "120mins" });
    return token;
}

exports.validateEmployee = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(150).email().required(),
        password: Joi.string().min(3).max(99).required(),
        nickName: Joi.string().min(2).max(99).required(),
        phone: Joi.string().min(9).max(10).required()
    })
    return joiSchema.validate(_reqBody);
}

exports.validateLoginEmployee = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(150).email().required(),
        password: Joi.string().min(3).max(99).required()
    })
    return joiSchema.validate(_reqBody);
}

exports.validateEditEmployee = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(150).email(),
        nickName: Joi.string().min(2).max(99),
        phone: Joi.string().min(9).max(10)
    })
    return joiSchema.validate(_reqBody);
}
