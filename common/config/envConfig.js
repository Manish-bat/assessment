const env = require('dotenv');
const path = require('path');
const joi = require('joi');

env.config({
    path: path.join(__dirname, '../../.env')
});

const configSet = joi
    .object()
    .keys({
        NODE_ENV: joi.string()
            .valid('production', 'development', 'test')
            .required(),
        MONGODB_URI: joi.string()
    }).unknown(true)

const { value: envConfig, error } = configSet
    .prefs({ errors: { label: 'key' } })
    .validate(process.env);

if (error) {
    throw new Error(`ENV config validation has failed with error: ${error.message}`);
}

module.exports = envConfig;
