const ServerError = require('../error.lib.js');
const jwt = require('jsonwebtoken');

/**
 * Authenticates an incoming request against a JWT.
 * @param {Object} req - Express Request object.
 * @param {Object} res - Express Response object.
 * @param {Function} next - Express 'next' function.
 * @returns
 * 
*/

module.exports = function authenticateRequest(req, res, next) {
    const authToken = req.headers.authorization.split(" ")[1];
    try {
        jwt.verify(authToken, process.env.JWT_SECRET);
        next();
    } catch(e) {
        res.status(401).send({
            error: 'Missing or bad authorization.'
        });
    }
}