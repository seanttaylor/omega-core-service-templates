const ServerError = require('../error.lib.js');
const jwt = require('jsonwebtoken');


module.exports = function authenticateRequest(req, res, next) {
    const authToken = req.headers.authorization.split(" ")[1];
    try {
        jwt.verify(authToken, process.env.JWT_SECRET);
    } catch(e) {
        throw new ServerError({
            status: 400,
            error: 'Missing or bad authorization'
        });
    }
    next();
}