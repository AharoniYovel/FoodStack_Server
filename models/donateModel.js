const mongoose = require('mongoose');
const Joi = require('joi');

const donatedSchema = new mongoose.Schema({
    fullName: String,
    short_id: Number,
    phone: String,
    rangePeople: Number,
    role: { type: String, default: "donated" },
    status: { type: String, default: "pending" },
    anonymous: { type: Boolean, default: true },
    create_at: { type: Date, default: Date.now() }
})

exports.DonatedModel = mongoose.model("donates", donatedSchema);

exports.validateDonated = (_reqBody) => {
    let joiSchema = Joi.object({
        fullName: Joi.string().min(2).max(99).required(),
        phone: Joi.string().min(9).max(10).required(),
        rangePeople: Joi.number().min(1).max(20).required(),
        anonymous: Joi.boolean().required()
    })
    return joiSchema.validate(_reqBody);
}

exports.validateEditDonated = (_reqBody) => {
    let joiSchema = Joi.object({
        phone: Joi.string().min(9).max(10),
        rangePeople: Joi.number().min(1).max(20),
        status: Joi.string().min(1).max(99),
        anonymous: Joi.boolean()
    })
    return joiSchema.validate(_reqBody);
}