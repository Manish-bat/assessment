const joi = require('joi');
const { pick } = require('../utils');


const validateMiddleware = schema => (req, res, next) => {
    const validSchema = pick(schema, ['params', 'query', 'body']);
    const object = pick(req, Object.keys(validSchema));
    const { value, error } = joi.compile(validSchema)
        .prefs({ errors: { label: 'key' } })
        .validate(object);

    if (error) {
        throw new Error('Validation error');
    }

    Object.assign(req, value);

    return next();
};

module.exports = {
    validateMiddleware
};