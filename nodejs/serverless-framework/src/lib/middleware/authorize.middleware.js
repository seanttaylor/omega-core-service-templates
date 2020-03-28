const ServerError = require('../error.lib.js');
const accessGrants = require('../../config/grants.json');
const AccessControl = require('accesscontrol');
const jwt = require('jsonwebtoken');
const ac = new AccessControl(accessGrants.grants);

/**
 * Authorizes an incoming request against the 'roles' claim in a JWT.
 * @param {String} action - The action being taken against the resource per the 'access-control' package API specification.
 * @param {String} resource - The API resource requiring authorization.
 * @param {Function} next - Express 'next' function.
 * @returns {Function} - function with Express middleware signature.
 * 
*/

module.exports = function(action, resource) { 
    return function authorizeRequest(req, res, next) {
        try {
            const authToken = req.headers.authorization.split(" ")[1];
            const decodedToken = jwt.decode(authToken);
            const permission = ac.can(decodedToken.role[0])[action](resource);

            res.locals.CONTEXT.permissions = {
                filter: function(data) {
                    return permission.filter(data);
                }
            };
            
            if (!permission.granted) {
                res.status(403).send({
                    error: 'Missing or invalid access grant(s).'
                });
            }
            //The requester has admin privileges.
            if (permission.granted && decodedToken.role[0] === 'admin') {
                next();
                return;
            }
            //The request is for a record whose id matches the subject claim on the authorization token.
            if (req.params.id && req.params.id !== decodedToken.sub) {
                res.status(403).send({
                    error: 'Access denied.'
                });
            }
            next();
            
        } catch(e) {
            console.error(e);
             res.status(401).send({
                error: 'Missing or bad authorization.'
            });
        }
    }
}