const Ajv = require('ajv');
const ServerError = require('../error.lib.js');
const ajv = new Ajv({ allErrors:true, removeAdditional:'all' });

module.exports = function(schema) {
    const validate = ajv.compile(schema);
    return function validateRequest(req, res, next) {
        const validation = validate(req.body);
        if (!validation) {
          throw new ServerError({
            status: 400,
            error: validate.errors[0]
          });
        }
        next();
    }
}