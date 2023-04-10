const Joi = require('joi');

const insertData = {
    body: Joi.object().keys({
        phoneNumber: Joi.string().pattern(/^[6789]\d{9}$/).required(),
        email: Joi.string().email({ tlds: { allow: false } }).required(),
        name: Joi.string().required()
    })
};

const searchData = {
    body: Joi.object().keys({
        phoneNumber: Joi.string().pattern(/^[6789]\d{9}$/).required()
    })
};

module.exports = {
    insertData,
    searchData
}